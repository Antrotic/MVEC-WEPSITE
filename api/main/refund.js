import mainCaller from "./mainCaller";
import HTTPMethods from "../HTTPMethods";

export class RefundApi {
  static endpoint = "/dashboard/user/refund";

  static get(params) {
    return mainCaller(this.endpoint, HTTPMethods.GET, null, null, params);
  }
  static getId(id) {
    return mainCaller(this.endpoint + `/${id}`, HTTPMethods.GET);
  }
  static create(data) {
    return mainCaller(this.endpoint, HTTPMethods.POST, data);
  }

  static update(id, data) {
    return mainCaller(this.endpoint + `${id}/`, HTTPMethods.PATCH, data);
  }
}
