/*jshint esversion: 6 */

/*
These files are made available to you on an as-is and restricted basis, and may only be redistributed or sold to any third party as expressly indicated in the Terms of Use for Seed Vault.
Seed Vault Code (c) Botanic Technologies, Inc. Used under license.
*/

// Facade for localStorage.  Is NOT a replacement, implements basic functionality.
export class HadronStorage {
  constructor(self, target, options) {
    options = typeof(options) !== "undefined" ? options : {};

    this.name = self;

    this.provider = "localStorage";
//    this.provider = "HadronFauxStorage";

    this.storageCheck();
    this.initializeStore();
  }

  getItem(named) {
    var value = this.dataStore.getItem(named);

    console.log("'" + value + "' <= hadronStorage.getItem('" + named + "')");

    return value;
  }

  setItem(named, value) {
    console.log("hadronStorage.setItem('" + named + "', '" + value + "')");

    return this.dataStore.setItem(named, value);
  }

  removeItem(named) {
    console.log("hadronStorage.removeItem('" + named + "')");

    return this.dataStore.removeItem(named);
  }

  storageCheck() {
    if (this.provider == "localStorage") {
      if (this.localStorageCheck() == false) {
        this.provider = "HadronFauxStorage";
      }
    }

    if (this.provider == "HadronFauxStorage") {
      console.log("This is not an error, it is diagnostic information.  Your browser may have prevented access to the localStorage object.  To allow Hadron to work we've created a storage object that only remembers data for this visit.  It is not sent anywhere, it only resides in your browser.");
    }
  }

  initializeStore() {
    console.log(this.provider);

    if (this.provider == "localStorage") {
      this.dataStore = localStorage;
    }

    if (this.provider == "HadronFauxStorage") {
      this.dataStore = new HadronFauxStorage("hadronFauxStorage");
    }
  }

  // is local storage available?
  localStorageCheck() {
    var test = "chat-quark-storage-test";
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);

      return true;
    } catch (error) {
      console.log("This is not an error, this is diagnostic information.  Your server does not allow storing data locally. Most likely it's because you've opened this page from your hard-drive. For testing you can disable your browser's security or start a localhost environment.  Switched to alternate storage method.");
      return false;
    }
  }
}

// This exposes methods like localStorage but keeps them locally.
// V1 treats it as an array/object so it simulates localStorage behaior.
// Future versions may store using other methods.
class HadronFauxStorage {
  constructor(self, target, options) {
    options = typeof(options) !== "undefined" ? options : {};

    this.dataStore = [];
		this.name = self;
  }

  getItem(named) {
    return this.dataStore[named];
  }

  setItem(named, value) {
    this.dataStore[named] = value;
  }

  removeItem(named) {
    delete this.dataStore[named];
  }
}
