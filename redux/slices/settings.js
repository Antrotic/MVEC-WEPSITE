// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axiosService from "../../services/axios";
import { parseCookies, setCookie } from "nookies";
export const getSettings = createAsyncThunk(
  "settings/getSettings",
  async () => {
    const response = await axiosService.get("/rest/settings");

    return {
      data: response.data.data,
    };
  }
);
function createSettings(list) {
  const result = list.map((item) => ({
    [item.key]: item.value,
  }));
  return Object.assign({}, ...result);
}
export const storesSlice = createSlice({
  name: "settings",
  initialState: {
    data: {},
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSettings.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getSettings.fulfilled, (state, action) => {
      state.loading = false;
      const result = createSettings(action.payload.data);
      state.data = result;
      if (result) {
        setCookie(null, "settings", JSON.stringify(result), {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
        setCookie(null, "site_title", result?.title, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
        setCookie(null, "favicon", result?.favicon, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
        if (!Boolean(parseCookies()?.userLocation))
          setCookie(null, "userLocation", result.location, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          });
      }
    });
    builder.addCase(getSettings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default storesSlice.reducer;
