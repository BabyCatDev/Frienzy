import { Strings } from "../utils/Localizations";

let instance;

class LocalizationService {
  constructor() {
    if (instance) {
      throw new Error("New instance cannot be created!!");
    }
    instance = this;
  }
  getString(key1, key2) {
    if (Strings[key1] && Strings[key1][key2]) return Strings[key1][key2];
    else return "";
  }
}

let Localization = Object.freeze(new LocalizationService());
export default Localization;
