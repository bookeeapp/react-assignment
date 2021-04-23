import PropTypes from "prop-types";
import "./Button.css";

export const Button = ({
  label,
  disabled,
  isLoading,
  className,
  loadingIcon,
  onClick,
}) => (
  <button
    type="button"
    disabled={disabled}
    className={`btn app-btn ${className}`}
    onClick={onClick}
  >
    {isLoading ? loadingIcon : label}
  </button>
);

Button.propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.string,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  loadingIcon: PropTypes.element,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  disabled: false,
  isLoading: false,
  className: "",
  onClick: null,
};
