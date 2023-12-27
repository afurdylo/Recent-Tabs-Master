const extensionSettings = {
  filterDuplicates: false,
  maxTabs: 20
};


function loadSettings() {
  chrome.storage.local.get(Object.keys(extensionSettings), function(result) {
      for (let key in extensionSettings) {
          let element = document.getElementById(key);
          if (element) {
              if (element.type === 'checkbox') {
                  element.checked = result[key] !== undefined ? result[key] : extensionSettings[key];
              } else if (element.type === 'number') {
                  element.value = result[key] !== undefined ? result[key] : extensionSettings[key];
              } else {
                  element.value = result[key] !== undefined ? result[key] : extensionSettings[key];
              }
          } else {
              console.error(`Error loading settings! Cannot find element: ID '${key}'`);
          }
      }
  });
}


function saveSettings() {
  let settingsToUpdate = {};

  for (let key in extensionSettings) {
      let element = document.getElementById(key);
      if (element) {
          if (element.type === 'checkbox') {
              settingsToUpdate[key] = element.checked;
          } else if (element.type === 'number') {
              settingsToUpdate[key] = parseInt(element.value, 10) || 0;
          } else {
              settingsToUpdate[key] = element.value;
          }
      } else {
          console.error(`Error. Cannot find ID '${key}'`);
          return;
      }
  }

  chrome.storage.local.set(settingsToUpdate, function() {
      alert("Settings have been saved.")
  });
}

function openHotkeysSettings() {
  chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
}

function openDonation() {
  chrome.tabs.create({ url: 'https://www.paypal.com/donate/?hosted_button_id=6AWZ2H7WHZPYC' });
}


document.addEventListener('DOMContentLoaded', loadSettings);
document.getElementById('saveSettings').addEventListener('click', saveSettings);
document.getElementById('keybindings').addEventListener('click', openHotkeysSettings);
document.getElementById('donate').addEventListener('click', openDonation);
