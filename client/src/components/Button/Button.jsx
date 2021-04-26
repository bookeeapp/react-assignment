import PropTypes from "prop-types";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { ReactComponent as GreenSpinner } from "../../assets/spinner_green.svg";
import { ReactComponent as RedSpinner } from "../../assets/spinner_red.svg";
import { BTN_TYPES } from "../../utilities";
import "./Button.css";

export const Button = ({ btnType, disabled, shiftId, onClick }) => {
  const isLoading = useSelector((state) => state.shifts.isLoading);
  const activeShiftId = useSelector((state) => state.shifts.activeShiftId);

  return (
    <button
      type="button"
      disabled={disabled}
      className={classNames({
        btn: true,
        "btn-outline-success": btnType === BTN_TYPES.BOOK,
        "btn-outline-danger": btnType === BTN_TYPES.CANCEL,
      })}
      onClick={onClick}
    >
      {isLoading && activeShiftId === shiftId ? (
        btnType === BTN_TYPES.BOOK ? (
          <GreenSpinner />
        ) : (
          <RedSpinner />
        )
      ) : (
        btnType
      )}
    </button>
  );
};

Button.propTypes = {
  btnType: PropTypes.oneOf(Object.values(BTN_TYPES)).isRequired,
  shiftId: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  disabled: false,
  onClick: null,
};
