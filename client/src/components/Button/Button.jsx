import PropTypes from "prop-types";
import { ReactComponent as GreenSpinner } from "../assets/spinner_green.svg";
import { ReactComponent as RedSpinner } from "../assets/spinner_red.svg";
import "./Button.css";

export const Button = ({
  label,
  btnType,
  disabled,
  isLoading,
  className,
  onClick,
}) => (
  <button
    type="button"
    disabled={disabled}
    className={`btn app-btn ${btnType + "-btn"} ${className}`}
    onClick={onClick}
  >
    {isLoading ? btnType === "book" ? <GreenSpinner /> : <RedSpinner /> : label}
  </button>
);

Button.propTypes = {
  label: PropTypes.string.isRequired,
  btnType: PropTypes.oneOf(["book", "cancel"]).isRequired,
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
