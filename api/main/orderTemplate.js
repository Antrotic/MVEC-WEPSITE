import mainCaller from "./mainCaller";
import HTTPMethods from "../HTTPMethods";

export class OrderTemplateApi {
  static endpoint = "/dashboard/user/orders-template";
  static get(params) {
    return mainCaller(
      this.endpoint + "/paginate",
      HTTPMethods.GET,
      null,
      null,
      params
    );
  }
  static updateTemplateDate(id, params) {
    return mainCaller(
      `${this.endpoint}/${id}`,
      HTTPMethods.PUT,
      null,
      null,
      params
    );
  }
}
