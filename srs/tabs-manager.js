import { chromeUpdateIconsMenuBages } from './chrome-utils.js';


export class TabManager {
  constructor(getSettings) {
    this.tabs = [];
    this.tabs_back = [];
    this.tabs_forward = [];
    this.activatedTabId = null;
    this.getSettings = getSettings;
    this.switchingTime = null;
  }

  _resetCurrentSeries() {
    this.tabs_back = [];
    this.tabs_forward = [];
    this.activatedTabId = null;
  }

  activateTab(tabId) {
    if((Date.now() < this.switchingTime+1000) && (tabId != this.activatedTabId)){
      return;
    }
    this.switchingTime = null;
    //Reset if tab was switched not by extension
    if (tabId !== this.activatedTabId) {
      this._resetCurrentSeries();
    }

    if (this.tabs[this.tabs.length - 1] != tabId) {
      if(this.getSettings().filterDuplicates){
        this.tabs = this.tabs.filter(element => element !== tabId);
      }

      this.tabs.push(tabId);
      this._limitMaxTabsNum();
    }
  }

  _limitMaxTabsNum() {
    if (this.tabs.length > this.getSettings().maxTabs + 1) {
      let start = this.tabs.length - this.getSettings().maxTabs - 1;
      this.tabs = this.tabs.slice(start);
    }
  }

  _switchTabs(from, to) {
    to.push(this.activatedTabId);
    this.activatedTabId = from.pop();

    this.switchingTime = Date.now();
    chrome.tabs.update(this.activatedTabId, { active: true });
  }

  switchToPreviouslyActiveTab() {
    if ((this.tabs.length < 2) || (this.switchingTime != null)) {
      return;
    }

    //initiate  new series
    if (this.activatedTabId === null) {
      this._limitMaxTabsNum();
      this.tabs_back = this.tabs.slice(0, this.tabs.length - 1);
      this.tabs_forward = [];
      this.activatedTabId = this.tabs[this.tabs.length - 1]
    }
    if (this.tabs_back.length < 1) {
      //Last tab reached!
      return;
    }
    this._switchTabs(this.tabs_back, this.tabs_forward);
  }

  switchToNextActiveTab() {
    if (this.tabs_forward.length < 1) {
      return;
    }
    this._switchTabs(this.tabs_forward, this.tabs_back);
  }

  isStackInProgress() {
    if ((this.tabs_back.length > 0) || (this.tabs_forward.length > 0)) {
      return true;
    }
    return false;
  }

  fastForward() {
    if (this.isStackInProgress()) {
      if (this.activatedTabId === this.tabs_forward[0]) {
        //series started from the current tab, no switching is needed
        this._resetCurrentSeries();
        this.updateIconsMenuBages(this.tabs[this.tabs.length - 1]);
      } else {
        this.activateTabId = this.tabs_forward.shift();
        this.tabs_back = [...this.tabs_forward];
        this.tabs_forward = [this.activateTabId];
        this._switchTabs(this.tabs_forward, this.tabs_back);
      }
    }
  }


  removeTab(tabId) {
    //remove tab
    this.tabs = this.tabs.filter(element => element !== tabId);
    //remove consecutive duplicates
    this.tabs = this.tabs.filter((item, index) => index === 0 || item !== this.tabs[index - 1]);
    this.tabs_back = this.tabs_back.filter((item, index) => index === 0 || item !== this.tabs_back[index - 1]);
    this.tabs_forward = this.tabs_forward.filter((item, index) => index === 0 || item !== this.tabs_forward[index - 1]);
    //return remaining tabs
    return this.tabs.length;
  }

  replaceTab(oldTabId, newTabId) {
    //replace all instances of this tabId
    if (this.activateTab == oldTabId) {
      this.activateTab = newTabId;
    }
    this.tabs = this.tabs.map(number => number === oldTabId ? newTabId : number);
    this.tabs_back = this.tabs_back.map(number => number === oldTabId ? newTabId : number);
    this.tabs_forward = this.tabs_forward.map(number => number === oldTabId ? newTabId : number);
  }


  updateIconsMenuBages(tabId) {
    let isBackAllowed = false;
    let isForwardAllowed = false;
    let forwardTabsNum = 0;
    if (this.isStackInProgress()) {
      if (this.tabs_back.length > 0) {
        isBackAllowed = true;
      }
      if (this.tabs_forward.length > 0) {
        isForwardAllowed = true;
      }
    } else {
      if (this.tabs.length > 1) {
        isBackAllowed = true;
      }
    }
    forwardTabsNum = this.tabs_forward.length;

    chromeUpdateIconsMenuBages(
      tabId,
      isBackAllowed,
      isForwardAllowed,
      forwardTabsNum,
      0);
  }
}