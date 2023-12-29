
import { ChromeWindowsManager } from './chrome-windows-manager.js';
import { RECENT_TABS_FORWARD_ID, RECENT_TABS_FAST_FORWARD_ID } from './constants.js';
import { contextMenuCreate, contextMenuOnClick } from './chrome-context-menu.js';
import { SettingsProvider } from './settings-provider.js'
import { chromeClearIconsMenuBages } from './chrome-utils.js';


const extensionSettings = {
  filterDuplicates: false,
  maxTabs: 20
};

const settingsProvider = new SettingsProvider(extensionSettings);
const chromeWindowsManager = new ChromeWindowsManager(() => settingsProvider.getSettings());

chrome.tabs.onActivated.addListener(async ({ tabId, windowId }) => {
  chromeWindowsManager.onActivatedTab(windowId, tabId);
});

chrome.action.onClicked.addListener(async (tab) => {
  await chromeWindowsManager.switchToPreviouslyActiveTab(tab.windowId);
});

chrome.runtime.onMessageExternal.addListener((request, sender) => {
  if (sender.id === RECENT_TABS_FORWARD_ID) {
    //message from forward ext recived
    chrome.windows.getCurrent({}, async ({ id: windowId }) => {
      chromeWindowsManager.switchToNextActiveTab(windowId);
    });
  }
  if (sender.id === RECENT_TABS_FAST_FORWARD_ID) {
    //message from fast forward ext recived
    chrome.windows.getCurrent({}, async ({ id: windowId }) => {
      chromeWindowsManager.fastForward(windowId);
    });
  }
});

chrome.tabs.onRemoved.addListener((tabId, { windowId }) => {
  chromeWindowsManager.removeTab(windowId, tabId);
});

chrome.tabs.onDetached.addListener((tabId, { oldWindowId }) => {
  chromeWindowsManager.removeTab(oldWindowId, tabId);
});


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    //update icons on onLoading evant as workaround - chromium rewrites icons with default state 
    if (tab.active) {
      let windowId = tab.windowId;
      chromeWindowsManager.updateIconsMenuBages(windowId, tabId);
    }
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    contextMenuCreate();
    chromeClearIconsMenuBages();
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  contextMenuOnClick(chromeWindowsManager, info, tab);
});

chrome.tabs.onReplaced.addListener((addedTabId, removedTabId) => {
  chromeWindowsManager.replaceTab(removedTabId, addedTabId);
});

chrome.commands.onCommand.addListener((command) => {
  if (command === 'switch-to-previously-active-tab') {
    chrome.windows.getCurrent({}, async ({ id: windowId }) => {
      chromeWindowsManager.switchToPreviouslyActiveTab(windowId);
    });
  }
  if (command === 'switch-to-next-active-tab') {
    chrome.windows.getCurrent({}, async ({ id: windowId }) => {
      chromeWindowsManager.switchToNextActiveTab(windowId);
    });
  }
  if (command === 'fast-forward-tabs-stack') {
    chrome.windows.getCurrent({}, async ({ id: windowId }) => {
      chromeWindowsManager.fastForward(windowId);
    });
  }
});