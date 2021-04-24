import PropTypes from "prop-types";
import { Button } from "../Button/Button";
import "./TableCell.jsx";

export const TableCell = ({
  shiftTime,
  shiftArea,
  // isShiftBooked,
  // isShiftOverlapping,
}) => {
  return (
    <div className="table-cell">
      <div className="shift-details">
        <div className="shift-time">{shiftTime}</div>
        {shiftArea && <div className="shift-area">{shiftArea}</div>}
      </div>
      <div className="shift-action">
        <Button btnType="book" />
      </div>
    </div>
  );
};

TableCell.propTypes = {
  shiftTime: PropTypes.string.isRequired,
  shiftArea: PropTypes.string,
};

TableCell.defaultProps = {
  shiftArea: null,
};
