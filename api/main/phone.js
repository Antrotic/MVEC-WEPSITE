import mainCaller from "./mainCaller";
import HTTPMethods from "../HTTPMethods";

export class PhoneApi {
  static endpoint = "/auth/check/phone";

  static checkPhone(data) {
    return mainCaller(this.endpoint, HTTPMethods.POST, data);
  }
}
