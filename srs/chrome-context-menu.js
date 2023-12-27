

export function contextMenuCreate() {
  chrome.contextMenus.create({
    "id": "prev_tab",
    "title": "Previous Tab",
    "contexts": ["all"]
  });
  chrome.contextMenus.create({
    "id": "next_tab",
    "title": "Next Tab",
    "contexts": ["all"]
  });
  chrome.contextMenus.create({
    "id": "fast_forward",
    "title": "Fast Forward",
    "contexts": ["all"]
  });
  chrome.contextMenus.create({
    "id": "separator1",
    "type": "separator",
    "contexts": ["all"]
  });
  chrome.contextMenus.create({
    "id": "donation",
    "title": "Support Recent Tabs Master",
    "contexts": ["all"]
  });
}

export function contextMenuOnClick(chromeWindowsManager, info, tab) {
  if (info.menuItemId === "fast_forward") {
    chromeWindowsManager.fastForward(tab.windowId);
  } else if (info.menuItemId === "next_tab") {
    chromeWindowsManager.switchToNextActiveTab(tab.windowId)
  } else if (info.menuItemId === "prev_tab") {
    chromeWindowsManager.switchToPreviouslyActiveTab(tab.windowId)
  } else if (info.menuItemId === "donation") {
    chrome.tabs.create({ url: 'https://www.paypal.com/donate/?hosted_button_id=6AWZ2H7WHZPYC' });
  }
}
