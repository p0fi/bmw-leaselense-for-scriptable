# BMW Lease Lense
![cover](https://github.com/p0fi/bmw-leaselense-for-scriptable/blob/main/cover.png)

Note: This script requires at least [Scriptable](https://scriptable.app/) version 1.6!

## What's this?
Driving a BMW on a lease? Having trouble to keep an eye on your mileage? Don't want to be shocked by the cost at the end of your lease? Than this is for you! This widget uses the BMW Connected Drive API to give you the widget the MyBWM app is missing! It calculates the daily mileage limit based on the terms of your lease and interpolates it linearly over time. Your current mileage is compared against this to tell you if you are on track or if you should slow down on your driving. 

## Features
### Estimated Cost
If you are exceeding your mileage limit for the day, the widget estimates the cost at the end of the lease based on the information you configured for your contract.

### Matching Car Image
The car on the widget is the exact picture of your configured VIN 🚀

### Dark Mode Support
Supports different color configurations for light ☀️ and dark 🕶️ mode 

## Instructions
1. Download and extract the content of this repository into the Scriptable folder located in your iCloud Drive.

Your Scriptable folder structure should look like this:

```
iCloud Drive/
├─ Scriptable/
│  ├─ bmw-leaselense.js
│  ├─ bmw-leaselense/
│  │  ├─ assets/
│  │  │  ├─ fuel.png
│  │  ├─ api.js
│  │  ├─ utils.js
│  │  ├─ config.js
```

2. Add your BMW Connected Drive credentials and the rest of the required information to `config.js`.
3. If you like, configure your color settings in the `colorConfig()` function to match the widget to your homescreen 🎨
4. Launch Scriptable and make sure that `bmw-leaselense` is listed in the scripts view.
5. Once everything is configured, run the script and verify that everything is working correctly.
6. Go back to your home screen and add a **medium** Scriptable widget.
7. Edit the Scriptable widget and choose `bmw-leaselense` as the script.

## Known Issues
* Right now the widget only supports the medium widget size. A Large and small sized version may follow in the future.

## About this project
The script is authored by [@thartwi](https://twitter.com/thartwi) (me) in order to keep track on how much I'm driving and what costs I have to face at the end of the lease. Because seriously, who likes this kind of surprise? 

## Thanks 🙏
Thanks to [Bimmer Connected](https://github.com/bimmerconnected) for providing inspiraton and help with understanding the BMW API!\
Thanks to [@simonbs](https://twitter.com/simonbs) for making an awesome app!

## Disclaimer
This widget is not affiliated with or endorsed by BMW Group.
