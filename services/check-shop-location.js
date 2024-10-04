import axiosService from "./axios";

const checkShopLocationService = {
  check: (params) =>
    axiosService.get(`/rest/shop/${params.id}/delivery-zone/check/distance`, {
      params,
    }),
};
export default checkShopLocationService;
