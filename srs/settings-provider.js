




export class SettingsProvider {
  constructor(settingsDefaultObject) {
    this.settings = settingsDefaultObject;
    this.initializeSettings();
    chrome.storage.onChanged.addListener(this.onChange.bind(this));
  }

  initializeSettings() {
    chrome.storage.local.get(Object.keys(this.settings), (items) => {
      // console.log("Settings loaded:", JSON.stringify(items || {}, null, 2))
      let settingsToInitialize = {};
      let shouldInitialize = false;
      for (let key in this.settings) {
        if (items[key] === undefined) {
          settingsToInitialize[key] = this.settings[key];
          shouldInitialize = true;
        } else {
          this.settings[key] = items[key];
        }
      }
      if (shouldInitialize) {
        chrome.storage.local.set(settingsToInitialize, function () {
          // console.log('Default settings has been initialized', settingsToInitialize);
        });
      }
    });
  }

  onChange(changes, areaName) {
    if (areaName === 'local') {
      for (let key in changes) {
        if (this.settings.hasOwnProperty(key)) {
          this.settings[key] = changes[key].newValue;
        }
      }
    }
  }

  getSettings() {
    return this.settings;
  }
}