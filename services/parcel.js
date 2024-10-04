import request from "./axios";

const parcelService = {
     getAll: (params) => request.get(`/dashboard/user/parcel-orders?${params}`),
     getAllTypes: (params) => request.get(`/rest/parcel-order/types`, { params }),
     getById: (id, params) => request.get(`/dashboard/user/parcel-orders/${id}`, { params }),
     create: (data) => request.post(`/dashboard/user/parcel-orders`, data),
     calculate: (params) => request.get(`/rest/parcel-order/calculate-price`, { params }),
     cancel: (id) => request.post(`/dashboard/user/parcel-orders/${id}/status/change?status=canceled`),
     review: (id, data) => request.post(`/dashboard/user/parcel-orders/deliveryman-review/${id}`, data),
};

export default parcelService;
