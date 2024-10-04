import mainCaller from "./mainCaller";
import HTTPMethods from "../HTTPMethods";

export class WalletApi {
  static endpoint = "/dashboard/user/wallet";

  static createBilling(params) {
    return mainCaller(
      this.endpoint + "/billing",
      HTTPMethods.POST,
      null,
      null,
      params
    );
  }

  static topUpWallet(params) {
    return mainCaller(
      this.endpoint + "/withdraw?type=topup",
      HTTPMethods.POST,
      null,
      null,
      params
    );
  }
}
