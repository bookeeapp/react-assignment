import { TableHeader } from "../TableHeader/TableHeader";
import { TableCell } from "../TableCell/TableCell";
import PropTypes from "prop-types";
import "./ShiftsOnDate.css";

export const ShiftsOnDate = ({ dateText, dateInfo, shifts }) => {
  return (
    <div className="shift">
      <TableHeader dateText={dateText} shiftInfoText={dateInfo} />
      {shifts.map(({ id, timing, booked, overlapping }) => (
        <TableCell
          key={id}
          shiftId={id}
          shiftTime={timing}
          isShiftBooked={booked}
          isShiftOverlapping={overlapping}
        />
      ))}
    </div>
  );
};

ShiftsOnDate.propTypes = {
  dateText: PropTypes.string.isRequired,
  dateInfo: PropTypes.string,
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
};
