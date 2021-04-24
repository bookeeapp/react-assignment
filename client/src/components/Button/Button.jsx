import { ReactComponent as GreenSpinner } from "../../assets/spinner_green.svg";
import { ReactComponent as RedSpinner } from "../../assets/spinner_red.svg";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./Button.css";

export const BTN_TYPES = {
  BOOK: "book",
  CANCEL: "cancel",
};

export const Button = ({ label, btnType, disabled, isLoading, onClick }) => (
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
    {isLoading ? (
      btnType === BTN_TYPES.BOOK ? (
        <GreenSpinner />
      ) : (
        <RedSpinner />
      )
    ) : (
      label
    )}
  </button>
);

Button.propTypes = {
  label: PropTypes.string.isRequired,
  btnType: PropTypes.oneOf(Object.values(BTN_TYPES)).isRequired,
  disabled: PropTypes.string,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  disabled: false,
  isLoading: false,
  className: "",
  onClick: null,
};
