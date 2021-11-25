const configuration = importModule('config');

module.exports.computeMileageLevel = function (currentMileage) {
  const totalMileage =
    configuration.LEASING_DURATION * configuration.KILOMETER_PER_YEAR + configuration.FAIRNESS_KILOMETER + configuration.START_KILOMETER;
  const startDate = new Date(configuration.LEASING_START_DATE);
  const endDate = new Date(+startDate);
  endDate.setFullYear(startDate.getFullYear() + configuration.LEASING_DURATION);
  const today = new Date();

  const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
  const kilometersPerDay = Math.floor(totalMileage / totalDays);
  const daysToToday = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  const kilometersOK = daysToToday * kilometersPerDay;

  const result = {
    total: totalMileage,
    withinLimit: kilometersOK > currentMileage - configuration.START_KILOMETER ? true : false,
    difference: currentMileage - configuration.START_KILOMETER - kilometersOK,
    current: currentMileage,
  };
  return result;
};

module.exports.encodeAsQueryString = function (json) {
  var result = '';
  for (var key in json) {
    let val = json[key];
    val = encodeURIComponent(val);
    result += result ? '&' : '';
    result += `${key}=${val}`;
  }
  return result;
};

module.exports.getAsset = async function (name) {
  let fm = FileManager.iCloud();
  let dir = fm.documentsDirectory();
  let path = fm.joinPath(dir + '/bmw-leaselense/assets', name);
  let download = await fm.downloadFileFromiCloud(path);
  let isDownloaded = await fm.isFileDownloaded(path);

  if (fm.fileExists(path)) {
    return fm.readImage(path);
  } else {
    console.log('Error: File does not exist.');
  }
};

module.exports.createProgressbar = function (total, used, withinLimit) {
  const width = 200;
  const height = 5;
  const fillColor = withinLimit ? new Color('#26CC23') : new Color('#CC2323');

  const context = new DrawContext();
  context.size = new Size(width, height);
  context.opaque = false;
  context.respectScreenScale = true;
  context.setFillColor(new Color('#9C9C9C'));

  const path = new Path();
  path.addRoundedRect(new Rect(0, 0, width, height), 3, 2);
  context.addPath(path);
  context.fillPath();
  context.setFillColor(fillColor);

  const path1 = new Path();
  path1.addRoundedRect(new Rect(0, 0, (width * used) / total, height), 3, 2);
  context.addPath(path1);
  context.fillPath();

  return context.getImage();
};
