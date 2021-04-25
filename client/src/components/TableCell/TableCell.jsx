import PropTypes from "prop-types";
import { Button, BTN_TYPES } from "../Button/Button";
import "./TableCell.css";

export const TableCell = ({
  shiftTime,
  shiftArea,
  isShiftBooked,
  // isShiftOverlapping,
}) => {
  return (
    <div className="table-cell">
      <div className="shift-details">
        <div className="shift-time">{shiftTime}</div>
        {shiftArea && <div className="shift-area">{shiftArea}</div>}
      </div>
      <div className="shift-action">
        <Button btnType={isShiftBooked ? BTN_TYPES.CANCEL : BTN_TYPES.BOOK} />
      </div>
    </div>
  );
};

TableCell.propTypes = {
  shiftTime: PropTypes.string.isRequired,
  shiftArea: PropTypes.string,
  isShiftBooked: PropTypes.bool.isRequired,
};

TableCell.defaultProps = {
  shiftArea: null,
};
