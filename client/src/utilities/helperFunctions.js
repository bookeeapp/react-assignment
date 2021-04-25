import {
  startOfDay,
  format,
  isToday,
  isTomorrow,
  differenceInMinutes,
  areIntervalsOverlapping,
} from "date-fns";

const getDateText = (startTime) => {
  if (isToday(startTime)) return "Today";
  else if (isTomorrow(startTime)) return "Tomorrow";
  return format(startTime, "MMMM do");
};

const getTotalShiftsAndTime = (shifts) => {
  const totalShifts = shifts.length;
  const totalMins = shifts.reduce(
    (prev, { startTime, endTime }) =>
      prev + differenceInMinutes(endTime, startTime),
    0,
  );

  const totalHrs = Math.floor(totalMins / 60);
  const remMins = totalMins - totalHrs * 60;

  return `${totalShifts} ${
    totalShifts > 1 ? "shifts" : "shift"
  }, ${totalHrs} h ${remMins > 0 ? `${remMins} m` : ""}`;
};

export const groupShiftsByDate = (shifts, calcDateInfo = false) => {
  const groupedShifts = shifts.reduce((prev, next) => {
    const { startTime } = next;
    const dateId = startOfDay(startTime).getTime();
    const shiftDayIndex = prev.findIndex((shiftDay) => shiftDay.id === dateId);
    if (shiftDayIndex >= 0) {
      const shiftOnDate = prev[shiftDayIndex];
      const { shifts } = shiftOnDate;
      shifts.push(next);
      prev[shiftDayIndex] = { ...shiftOnDate, shifts };
    } else {
      const shiftOnDate = {
        id: dateId,
        dateText: getDateText(dateId),
        shifts: [next],
      };
      prev.push(shiftOnDate);
    }
    return prev;
  }, []);

  if (calcDateInfo) {
    return groupedShifts.map((shiftGroup) => {
      const { shifts } = shiftGroup;
      return {
        ...shiftGroup,
        dateInfo: getTotalShiftsAndTime(shifts),
      };
    });
  }
  return groupedShifts;
};

export const getAreaWiseCount = (shifts) => {
  return shifts.reduce((prev, next) => {
    const { area } = next;
    prev[area] = prev[area] || 0;
    prev[area] += 1;
    return prev;
  }, {});
};

export const getShiftsToUpdate = (shiftId, state, shiftBooked = true) => {
  const { ids, entities } = state;
  const { startTime: shiftStartTime, endTime: shiftEndTime } = entities[
    shiftId
  ];

  return ids
    .map((id) => {
      if (id === shiftId) return null;
      const { startTime: start, endTime: end } = entities[id];
      const isShiftOverlapping = areIntervalsOverlapping(
        { start: shiftStartTime, end: shiftEndTime },
        { start, end },
      );
      if (isShiftOverlapping) {
        return {
          id,
          changes: {
            overlapping: isShiftOverlapping && shiftBooked,
          },
        };
      }
      return null;
    })
    .filter((shift) => shift);
};
