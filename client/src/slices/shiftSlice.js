import { compareAsc, format } from "date-fns";
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
} from "../utilities";

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
  error: null,
});

export const fetchShifts = createAsyncThunk("shifts/fetchShifts", async () => {
  const response = await axios.get("/shifts");
  return response.data.map((shift) => {
    const { startTime, endTime } = shift;
    const startTimeText = format(startTime, "HH:mm");
    const endTimeText = format(endTime, "HH:mm");
    return {
      ...shift,
      timing: `${startTimeText}-${endTimeText}`,
      overlapping: false,
    };
  });
});

export const bookShift = createAsyncThunk(
  "shifts/bookShift",
  async (shiftId) => {
    const response = await axios
      .post(`/shifts/${shiftId}/book`)
      .catch((error) => error.request);
    if (response.status === 200) {
      const { id, booked } = response.data;
      return {
        id,
        changes: { booked },
      };
    } else {
      return null;
    }
  },
);

export const cancelShift = createAsyncThunk(
  "shift/cancelShift",
  async (shiftId) => {
    const response = await axios
      .post(`/shifts/${shiftId}/cancel`)
      .catch((error) => error.request);
    if (response.status === 200) {
      const { id, booked } = response.data;
      return {
        id,
        changes: { booked },
      };
    } else {
      return null;
    }
  },
);

const shiftsSlice = createSlice({
  name: "shifts",
  initialState,
  reducers: {
    setSelectedArea: (state, action) => {
      const { payload: selectedCity } = action;
      state.selectedArea = selectedCity;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShifts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchShifts.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        shiftsAdapter.setAll(state, action.payload);
        const areas = Object.keys(getAreaWiseCount(action.payload)).sort();
        state.selectedArea = areas[0];
        state.isLoading = false;
      })
      .addCase(bookShift.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(bookShift.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(bookShift.fulfilled, (state, action) => {
        const { id } = action.payload;
        const overlappingShifts = getShiftsToUpdate(id, state);
        shiftsAdapter.updateOne(state, action.payload);
        shiftsAdapter.updateMany(state, overlappingShifts);
        state.isLoading = false;
      })
      .addCase(cancelShift.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelShift.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(cancelShift.fulfilled, (state, action) => {
        const { id } = action.payload;
        const overlappingShifts = getShiftsToUpdate(id, state, false);
        shiftsAdapter.updateOne(state, action.payload);
        shiftsAdapter.updateMany(state, overlappingShifts);
        state.isLoading = false;
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
  (bookedShifts) => groupShiftsByDate(bookedShifts),
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

export const { setSelectedArea } = shiftsSlice.actions;

export default shiftsSlice.reducer;
