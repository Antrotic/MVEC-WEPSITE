import axiosService from "./axios";

const checkUserLocationService = {
  check: (params) =>
    axiosService.get("/rest/shop/delivery-zone/check/distance", { params }),
};

export default checkUserLocationService;
