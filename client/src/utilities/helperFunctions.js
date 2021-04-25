import {
  startOfDay,
  format,
  isToday,
  isTomorrow,
  areIntervalsOverlapping,
} from "date-fns";

const getDateText = (startTime) => {
  if (isToday(startTime)) return "Today";
  else if (isTomorrow(startTime)) return "Tomorrow";
  return format(startTime, "MMMM do");
};

export const groupShiftsByDate = (shifts) => {
  return shifts.reduce((prev, next) => {
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
