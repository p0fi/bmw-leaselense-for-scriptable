// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: taxi;

const api = importModule('bmw-leaselense/api');
const utils = importModule('bmw-leaselense/utils');
const configuration = importModule('bmw-leaselense/config');

if (config.runsInWidget) {
  const size = config.widgetFamily;
  const widget = await createWidget(size);

  Script.setWidget(widget);
  Script.complete();
} else {
  // Choose a size for debugging
  //const size = 'small';
  const size = 'medium';
  //const size = 'large'
  const widget = await createWidget(size);
  if (size == 'small') {
    widget.presentSmall();
  } else if (size == 'medium') {
    widget.presentMedium();
  } else {
    widget.presentLarge();
  }
  Script.complete();
}

async function createWidget(size) {
  const data = await api.fetchVehicleData();
  const colors = configuration.colorConfig(data.remainingRange);

  const widget = new ListWidget();
  widget.setPadding(0, 15, 10, 15);
  widget.backgroundColor = colors.bgColor;

  if (size == 'small') {
    // TODO: Show message that this size is currently not supported
  } else if (size == 'medium') {
    const car = await api.fetchVehicleImage();
    const mileage = utils.computeMileageLevel(data.mileage);
    
    const contentStack = widget.addStack();
    contentStack.layoutHorizontally();
    contentStack.addImage(car);

    contentStack.addSpacer();

    widget.addImage(utils.createProgressbar(mileage.total, mileage.current, mileage.withinLimit));

    widget.addSpacer();

    const mileageStack = widget.addStack();
    mileageStack.layoutHorizontally();

    // Display the expected cost if not within your limits
    if (!mileage.withinLimit) {
      const costStack = contentStack.addStack();
      costStack.layoutVertically();

      costStack.addSpacer();

      // Need to replace _ with - in the locale string since js has a different view on it then iOS
      const locale = Device.locale().replace('_', '-');
      const cost = (Math.abs(mileage.difference) * configuration.COST_PER_KILOMETER).toLocaleString(locale, {
        style: 'currency',
        currency: configuration.CURRENCY,
      });

      const costText = costStack.addText(cost);
      costText.font = Font.boldMonospacedSystemFont(35);
      costText.minimumScaleFactor = 0.5;

      costStack.addSpacer();
    }

    const milageIcon = mileageStack.addImage(await utils.getAsset('mileage.png'));
    milageIcon.imageSize = new Size(15, 15);
    milageIcon.tintColor = colors.textColor;

    mileageStack.addSpacer(5);

    const mileageText = mileageStack.addText(
      `${mileage.current.toLocaleString()} / ${mileage.total.toLocaleString()} km`
    );
    mileageText.font = Font.boldMonospacedSystemFont(15);

    mileageStack.addSpacer();

    const sign = mileage.difference > 0 ? '+' : '-';
    const diffText = mileageStack.addText(`${sign}${Math.abs(mileage.difference)} km`);
    diffText.font = Font.boldMonospacedSystemFont(15);

    const rangeStack = widget.addStack();
    rangeStack.layoutHorizontally();

    const rangeimg = rangeStack.addImage(await utils.getAsset('fuel.png'));
    rangeimg.imageSize = new Size(15, 15);
    rangeimg.tintColor = colors.rangeColor;

    rangeStack.addSpacer(5);

    const rangeText = rangeStack.addText(`${data.remainingRange} km`);
    rangeText.font = Font.regularMonospacedSystemFont(12);
    rangeText.textColor = colors.rangeColor;

    widget.addSpacer();

    const updateStack = widget.addStack();
    updateStack.addSpacer();

    const updateImg = SFSymbol.named('arrow.triangle.2.circlepath').image;
    const updateIcon = updateStack.addImage(updateImg);
    updateIcon.imageSize = new Size(11, 11);
    updateIcon.tintColor = colors.textColor;

    updateStack.addSpacer(3);

    const updated = new Date(data.updated);
    const updateText = updateStack.addText(`${updated.toLocaleString()}`);
    updateText.font = Font.systemFont(9);
  }
  return widget;
}
