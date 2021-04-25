import { combineReducers } from "@reduxjs/toolkit";
import shiftsReducer from "./slices/shiftSlice";

const rootReducer = combineReducers({
  shifts: shiftsReducer,
});

export default rootReducer;
