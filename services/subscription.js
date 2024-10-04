import axiosService from "./axios";

const subcriptionService = {
  create: (data) => axiosService.post("/rest/subscription", data),
};

export default subcriptionService;
