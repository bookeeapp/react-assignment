import {
  compareAsc,
  format,
  isBefore,
  areIntervalsOverlapping,
} from "date-fns";
import { axios } from "../axios";
import {
  createSlice,
  createEntityAdapter,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import {
  groupShiftsByDate,
  getAreaWiseCount,
  getShiftsToUpdate,
  TOAST_TYPES,
  TOAST_MSGS,
} from "../utilities";
import { addNewToast } from "./toastSlice";

const shiftsAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    const areaA = a.area.toLowerCase();
    const areaB = b.area.toLowerCase();
    if (areaA < areaB) {
      return -1;
    }
    if (areaA > areaB) {
      return 1;
    }
    return compareAsc(a.startTime, b.startTime);
  },
});

const initialState = shiftsAdapter.getInitialState({
  selectedArea: null, // dynamic filter
  isLoading: false,
  activeShiftId: null,
});

const showToast = (title, message, dispatch) => {
  const toast = {
    title,
    message,
  };
  setTimeout(() => dispatch(addNewToast(toast)), 100);
};

// ** Thunks ** //

export const fetchShifts = createAsyncThunk(
  "shifts/fetchShifts",
  async (_, { dispatch }) => {
    const response = await axios
      .get("/shifts")
      .catch((error) => error.response || error.request);
    if (response.status === 200) {
      const allShifts = response.data;
      const bookedShifts = allShifts.filter((shift) => shift.booked);
      const overlappingShiftIds = allShifts
        .filter(({ startTime, endTime, booked }) => {
          if (booked) return false;
          return bookedShifts.some(
            ({ startTime: bookedStTime, endTime: bookedEndTime }) =>
              areIntervalsOverlapping(
                { start: bookedStTime, end: bookedEndTime },
                { start: startTime, end: endTime },
              ),
          );
        })
        .map((shift) => shift.id);

      return response.data.map((shift) => {
        const { id, startTime, endTime } = shift;
        const startTimeText = format(startTime, "HH:mm");
        const endTimeText = format(endTime, "HH:mm");
        return {
          ...shift,
          timing: `${startTimeText}-${endTimeText}`,
          overlapping: overlappingShiftIds.includes(id),
          activeOrOver: isBefore(startTime, new Date()),
        };
      });
    } else {
      showToast(TOAST_TYPES.ERROR, TOAST_MSGS.FETCH_FAILURE, dispatch);
    }
  },
);

export const bookShift = createAsyncThunk(
  "shifts/bookShift",
  async (shiftId, { dispatch }) => {
    const response = await axios
      .post(`/shifts/${shiftId}/book`)
      .catch((error) => error.response || error.request);
    if (response.status === 200) {
      const { id, booked } = response.data;
      showToast(TOAST_TYPES.SUCCESS, TOAST_MSGS.BOOK_SUCCESS, dispatch);
      return {
        id,
        changes: { booked },
      };
    } else {
      showToast(TOAST_TYPES.ERROR, TOAST_MSGS.BOOK_FAILURE, dispatch);
    }
  },
);

export const cancelShift = createAsyncThunk(
  "shift/cancelShift",
  async (shiftId, { dispatch }) => {
    const response = await axios
      .post(`/shifts/${shiftId}/cancel`)
      .catch((error) => error.response || error.request);
    if (response.status === 200) {
      const { id, booked } = response.data;
      showToast(TOAST_TYPES.INFO, TOAST_MSGS.CANCEL_SUCCESS, dispatch);
      return {
        id,
        changes: { booked },
      };
    } else {
      showToast(TOAST_TYPES.ERROR, TOAST_MSGS.CANCEL_FAILURE, dispatch);
    }
  },
);

// ** Thunks ** //

const shiftsSlice = createSlice({
  name: "shifts",
  initialState,
  reducers: {
    setSelectedArea: (state, action) => {
      state.selectedArea = action.payload;
    },
    setActiveShiftId: (state, action) => {
      state.activeShiftId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShifts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchShifts.rejected, (state) => {
        state.isLoading = false;
        state.activeShiftId = null;
      })
      .addCase(fetchShifts.fulfilled, (state, { payload }) => {
        if (payload) {
          shiftsAdapter.setAll(state, payload);
          const areas = Object.keys(getAreaWiseCount(payload)).sort();
          state.selectedArea = areas[0];
        }
        state.isLoading = false;
      })
      .addCase(bookShift.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(bookShift.rejected, (state) => {
        state.isLoading = false;
        state.activeShiftId = null;
      })
      .addCase(bookShift.fulfilled, (state, { payload }) => {
        if (payload) {
          const { id } = payload;
          const overlappingShifts = getShiftsToUpdate(id, state);
          shiftsAdapter.updateOne(state, payload);
          shiftsAdapter.updateMany(state, overlappingShifts);
        }
        state.isLoading = false;
        state.activeShiftId = null;
      })
      .addCase(cancelShift.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelShift.rejected, (state) => {
        state.isLoading = false;
        state.activeShiftId = null;
      })
      .addCase(cancelShift.fulfilled, (state, { payload }) => {
        if (payload) {
          const { id } = payload;
          const overlappingShifts = getShiftsToUpdate(id, state, false);
          shiftsAdapter.updateOne(state, payload);
          shiftsAdapter.updateMany(state, overlappingShifts);
        }
        state.isLoading = false;
        state.activeShiftId = null;
      });
  },
});

// ** Selectors ** //

export const { selectAll: selectAllShifts } = shiftsAdapter.getSelectors(
  (state) => state.shifts,
);

const selectBookedShifts = createSelector(selectAllShifts, (shifts) =>
  shifts.filter((shift) => shift.booked),
);

export const selectMyShifts = createSelector(
  selectBookedShifts,
  (bookedShifts) => groupShiftsByDate(bookedShifts, true),
);

export const selectShiftAreas = createSelector(selectAllShifts, (shifts) => {
  const areaWiseCount = getAreaWiseCount(shifts);
  return Object.entries(areaWiseCount);
});

export const selectShiftsByArea = createSelector(
  selectAllShifts,
  (state) => state.shifts.selectedArea,
  (shifts, selectedArea) => {
    const filteredShifts = shifts.filter(({ area }) => area === selectedArea);
    return groupShiftsByDate(filteredShifts);
  },
);

// ** Selectors ** //

export const { setSelectedArea, setActiveShiftId } = shiftsSlice.actions;

export default shiftsSlice.reducer;
