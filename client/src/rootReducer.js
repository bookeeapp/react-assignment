import { combineReducers } from "@reduxjs/toolkit";
import shiftsReducer from "./slices/shiftSlice";
import toastReducer from "./slices/toastSlice";

const rootReducer = combineReducers({
  shifts: shiftsReducer,
  toasts: toastReducer,
});

export default rootReducer;
