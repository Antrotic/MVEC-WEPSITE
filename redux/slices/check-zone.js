import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import checkUserLocationService from "../../services/check-user-location";

const initialState = { loading: false, error: "" };
export const checkZone = createAsyncThunk(
  "shop/checkZone",
  async (params = {}) => {
    const res = await checkUserLocationService.check({
      "address[latitude]": params.lat,
      "address[longitude]": params.lng,
    });
    return res.data;
  }
);

const checkZoneSlice = createSlice({
  name: "checkZone",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(checkZone.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(checkZone.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
    });
    builder.addCase(checkZone.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
  reducers: {
    handleLoading(state, action) {
      state.loading = action.payload;
    },
  },
});
export const { handleLoading } = checkZoneSlice.actions;
export default checkZoneSlice.reducer;
