import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

let toastId = 0;

const getNewToastId = () => {
  toastId += 1;
  return toastId;
};

const toastAdapter = createEntityAdapter();

const toastSlice = createSlice({
  name: "toasts",
  initialState: toastAdapter.getInitialState(),
  reducers: {
    addNewToast: (state, action) => {
      const { title, message } = action.payload;
      const newToast = {
        id: getNewToastId(),
        title,
        message,
      };
      toastAdapter.addOne(state, newToast);
    },
    removeToast: toastAdapter.removeOne,
  },
});

export const { addNewToast, removeToast } = toastSlice.actions;

export const { selectAll: selectAllToasts } = toastAdapter.getSelectors(
  (state) => state.toasts,
);

export default toastSlice.reducer;
