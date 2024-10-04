import mainCaller from "./mainCaller";
import HTTPMethods from "../HTTPMethods";
export class UserApi {
  static endpoint = "/dashboard/user";

  static get(params) {
    return mainCaller(
      `${this.endpoint}/profile/show`,
      HTTPMethods.GET,
      null,
      null,
      params
    );
  }
  static update(data) {
    return mainCaller(`${this.endpoint}/profile/update`, HTTPMethods.PUT, data);
  }
  static passwordUpdate(data) {
    return mainCaller(
      `${this.endpoint}/phone/password/update`,
      HTTPMethods.POST,
      null,
      null,
      data
    );
  }
  static getWallet(params = {}) {
    return mainCaller(
      `${this.endpoint}/wallet/histories`,
      HTTPMethods.GET,
      null,
      null,
      params
    );
  }
  static firebaseTokenUpdate(data) {
    return mainCaller(
      `${this.endpoint}/profile/firebase/token/update`,
      HTTPMethods.POST,
      data
    );
  }

  static myGiftCards(params, accessToken) {
    return mainCaller(
      `${this.endpoint}/my-gift-carts`,
      HTTPMethods.GET,
      null,
      null,
      params,
      accessToken
    );
  }

  static createRequestMoney(data) {
    return mainCaller(
      `${this.endpoint}/wallet/request`,
      HTTPMethods.POST,
      data,
    );
  }

  static getRequestMoney(params) {
    return mainCaller(
        `${this.endpoint}/wallet/request`,
        HTTPMethods.GET,
        null,
        null,
        params,
    )
  }

  static getSingleRequestMoney(id) {
    return mainCaller(
        `${this.endpoint}/wallet/request/${id}`,
        HTTPMethods.GET,
    )
  }

  static editWalletRequest(id, data) {
    return mainCaller(
        `${this.endpoint}/wallet/request/${id}`,
        HTTPMethods.PUT,
        data
    )
  }

  static  deleteWalletRequest(id) {
    return mainCaller(
        `${this.endpoint}/wallet/request/${id}`,
        HTTPMethods.DELETE,
    )
  }

  static  changeStatusWalletRequest(id, data) {
    return mainCaller(
        `${this.endpoint}/wallet/request/status/${id}`,
        HTTPMethods.POST,
        data
    )
  }
}
