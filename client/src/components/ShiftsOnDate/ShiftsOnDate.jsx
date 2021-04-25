import { TableHeader } from "../TableHeader/TableHeader";
import { TableCell } from "../TableCell/TableCell";
import PropTypes from "prop-types";
import "./ShiftsOnDate.css";

export const ShiftsOnDate = ({ dateText, dateInfo, shifts, showShiftArea }) => {
  return (
    <div className="shift">
      <TableHeader dateText={dateText} shiftInfoText={dateInfo} />
      {shifts.map(({ id, area, timing, booked, overlapping, activeOrOver }) => (
        <TableCell
          key={id}
          shiftId={id}
          shiftTime={timing}
          shiftArea={showShiftArea ? area : null}
          isShiftBooked={booked}
          isShiftOverlapping={overlapping}
          isShiftActive={activeOrOver}
        />
      ))}
    </div>
  );
};

ShiftsOnDate.propTypes = {
  dateText: PropTypes.string.isRequired,
  dateInfo: PropTypes.string,
  showShiftArea: PropTypes.bool,
  shifts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      area: PropTypes.string.isRequired,
      booked: PropTypes.bool.isRequired,
      overlapping: PropTypes.bool.isRequired,
      endTime: PropTypes.number.isRequired,
      startTime: PropTypes.number.isRequired,
      timing: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

ShiftsOnDate.defaultProps = {
  dateInfo: null,
  showShiftArea: false,
};
