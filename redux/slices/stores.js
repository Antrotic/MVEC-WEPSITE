import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  currentStore: {},
};

const saveUser = createSlice({
  name: "stores",
  initialState,
  reducers: {
    addCurrentStore(state, action) {
      state.currentStore = action.payload;
    },
    removeCurrentStore(state, action) {
      state.currentStore = {};
    },
  },
});

export const { addCurrentStore, removeCurrentStore } = saveUser.actions;

export default saveUser.reducer;
