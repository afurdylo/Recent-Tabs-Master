import { RECENT_TABS_FORWARD_ID, RECENT_TABS_FAST_FORWARD_ID } from './constants.js';


export function chromeUpdateIconsMenuBages(tabId, isBackIconActive, isForwardIconActive, backBageNum, forwardBageNum) {
  setIcon(tabId, isBackIconActive);
  setBage(tabId, backBageNum);
  setMenuItems(isBackIconActive, isForwardIconActive, isForwardIconActive);
  setForwardExtIcon(tabId, isForwardIconActive, forwardBageNum);
  setFastForwardExtIcon(tabId, isForwardIconActive, forwardBageNum);
}

export function chromeClearIconsMenuBages(){
  chromeUpdateIconsMenuBages(null, false, false, 0, 0);
}

function setIcon(tabId, isActive) {
  const icon = isActive ? "./icons/back_32.png" : "./icons/back_inactive_32.png";
  if (tabId) {
    chrome.action.setIcon(({ path: icon, tabId: tabId }));
  } else {
    chrome.action.setIcon({ path: icon });
  }
}

function setMenuItems(isPrevActive, isNextActive, isFastForwardActive) {
  chrome.contextMenus.update("prev_tab", { enabled: isPrevActive });
  chrome.contextMenus.update("next_tab", { enabled: isNextActive });
  chrome.contextMenus.update("fast_forward", { enabled: isFastForwardActive });
}

function setForwardExtIcon(tabId, isIconActive, bageNum) {
  chromeSendMessage(RECENT_TABS_FORWARD_ID, { isIconActive: isIconActive, bageNum: bageNum, tabId: tabId });
}

function setFastForwardExtIcon(tabId, isIconActive, bageNum) {
  chromeSendMessage(RECENT_TABS_FAST_FORWARD_ID, { isIconActive: isIconActive, bageNum: bageNum, tabId: tabId });
}

function setBage(tabId, num) {
  const text = num ? String(num) : "";
  if (tabId) {
    chrome.action.setBadgeText({ text: text, tabId: tabId });
  } else {
    chrome.action.setBadgeText({ text: text });
  }
}

function chromeSendMessage(extId, msg) {
  chrome.runtime.sendMessage(extId, msg)
    .catch(error => {
      // console.error("Error in chrome.runtime.sendMessage: ", error);
    });
}
