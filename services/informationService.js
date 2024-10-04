import axiosService from "./axios";

const informationService = {
  translations: (params) =>
    axiosService.get("/rest/translations/paginate", { params }),
  settingsInfo: (params) => axiosService.get("/rest/settings", { params }),
  getReferrals: (params) => axiosService.get(`/rest/referral`, { params }),
};

export default informationService;
