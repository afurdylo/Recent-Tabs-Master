
export class ObjectsStorage {
  constructor(key, SubclassClassConstructor, ...args) {
      this.key = key;
      this.dataObject = null;
      this.initializationPromise = this._init(SubclassClassConstructor, ...args);
  }

  async _init(SubclassClassConstructor, ...args) {
      const data = await this._loadData();
      this.dataObject = {};
      for (let key in data) {
        let loadedData = data[key];
        this.dataObject[key] = new SubclassClassConstructor(...args);
        Object.assign(this.dataObject[key], loadedData);
    }      
  }
  async _loadData() {
    return new Promise((resolve) => {
      chrome.storage.session.setAccessLevel({accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS"})
      .then(() => {
        chrome.storage.session.get([this.key], (result) => {
          resolve(result[this.key] || {});
          // console.log((JSON.stringify(result[this.key] || {}, null, 2)));
        });
      });
    });
  }

  async _saveData() {
      chrome.storage.session.set({ [this.key]: this.dataObject }, () => {
        if (chrome.runtime.lastError) {
            console.error('error data storing:', chrome.runtime.lastError);
        }
    });
  }

  async getDataObject() {
      await this.initializationPromise;
      return this.dataObject;
  }

  updateDataObject() {
//      this.dataObject = newData;
      this._saveData();
  }
}

