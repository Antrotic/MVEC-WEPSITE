import mainCaller from "./mainCaller";
import HTTPMethods from "../HTTPMethods";

export class TransactionsApi {
  static endpoint = "/payments";

  static topUpWallet(id, data) {
    return mainCaller(
      `${this.endpoint}/wallet/${id}/transactions`,
      HTTPMethods.POST,
      data
    );
  }

  static create(id, data) {
    return mainCaller(
      `${this.endpoint}/order/${id}/transactions`,
      HTTPMethods.POST,
      data
    );
  }
}
