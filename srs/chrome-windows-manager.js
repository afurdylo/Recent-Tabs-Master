import {TabManager} from './tabs-manager.js'
import { ObjectsStorage } from './object-storage.js';
import { chromeClearIconsMenuBages } from './chrome-utils.js';


export class ChromeWindowsManager {
  constructor(getSettings) {
    this.windowsStorage = new ObjectsStorage("windowsStorage", TabManager, getSettings);
    this.getSettings = getSettings;
  }
 
  async onActivatedTab(windowId, tabId){
    const windows = await this.windowsStorage.getDataObject();
    if(!(windowId in windows)){
      windows[windowId] = new TabManager(this.getSettings);
    }
    windows[windowId].activateTab(tabId);
    this.updateIconsMenuBages(windowId, tabId);
    this.windowsStorage.updateDataObject();
  }

  async switchToPreviouslyActiveTab(windowId){
    const windows = await this.windowsStorage.getDataObject();
    if(windowId in windows){
      windows[windowId].switchToPreviouslyActiveTab() ;
    }
    this.windowsStorage.updateDataObject();
  }
  
  async switchToNextActiveTab(windowId){
    const windows = await this.windowsStorage.getDataObject();
    if(windowId in windows){
      windows[windowId].switchToNextActiveTab();
    }
    this.windowsStorage.updateDataObject();
  }

  async fastForward(windowId){
    const windows = await this.windowsStorage.getDataObject();
    if(windowId in windows){
      windows[windowId].fastForward();
    }
    this.windowsStorage.updateDataObject();
  }

  async removeTab(windowId, tabId) {
    const windows = await this.windowsStorage.getDataObject();
    if(windowId in windows){
      if( 0 === windows[windowId].removeTab(tabId) ){
        delete windows[windowId];
      }
    }
    this.windowsStorage.updateDataObject();
  }

  async replaceTab( oldTabId, newTabId) {
    const windows = await this.windowsStorage.getDataObject();
    Object.keys(windows).forEach(windowId => {
      windows[windowId].replaceTab(oldTabId, newTabId);
    });
    this.windowsStorage.updateDataObject();
  }

  async updateIconsMenuBages(windowId, tabId){
    const windows = await this.windowsStorage.getDataObject();
    if(windowId in windows){
      windows[windowId].updateIconsMenuBages(tabId);
    }else{
      chromeClearIconsMenuBages();
    }
    // this.windowsStorage.updateDataObject();
  }

  clearData(){
    this.windowsStorage.updateDataObject();
  }

}
