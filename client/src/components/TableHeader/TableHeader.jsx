import PropTypes from "prop-types";
import "./TableHeader.css";

export const TableHeader = ({ dateText, shiftInfoText }) => (
  <div className="table-header">
    <span className="shift-date">{dateText}</span>
    {shiftInfoText && <span className="shift-info">{shiftInfoText}</span>}
  </div>
);

TableHeader.propTypes = {
  dateText: PropTypes.string.isRequired,
  shiftInfoText: PropTypes.string,
};

TableHeader.defaultProps = {
  shiftInfoText: null,
};
