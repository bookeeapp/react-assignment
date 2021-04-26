import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { FaCheckCircle } from "react-icons/fa";
import { RiErrorWarningFill } from "react-icons/ri";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { IoIosWarning } from "react-icons/io";
import { selectAllToasts, removeToast } from "../../slices";
import { TOAST_BACKGROUND_COLORS, TOAST_TYPES } from "../../utilities";
import PropTypes from "prop-types";
import "./Toast.css";

export const Toast = ({ position }) => {
  const allToasts = useSelector((state) => selectAllToasts(state));
  const dispatch = useDispatch();

  useEffect(() => {
    if (allToasts.length > 5) {
      dispatch(removeToast(allToasts[0].id));
    }
  }, [allToasts]);

  const deleteToast = (id) => {
    dispatch(removeToast(id));
  };

  return (
    <>
      <div className={`notification-container ${position}`}>
        <TransitionGroup component={null}>
          {allToasts.map((toast) => (
            <CSSTransition key={toast.id} timeout={500} classNames="toast-item">
              <div
                className="notification custom-toast"
                style={{
                  backgroundColor:
                    TOAST_BACKGROUND_COLORS[toast.title.toUpperCase()],
                }}
              >
                <button onClick={() => deleteToast(toast.id)}>X</button>
                <div className="notification-image">
                  {toast.title === TOAST_TYPES.SUCCESS && <FaCheckCircle />}
                  {toast.title === TOAST_TYPES.ERROR && <RiErrorWarningFill />}
                  {toast.title === TOAST_TYPES.INFO && <BsFillInfoCircleFill />}
                  {toast.title === TOAST_TYPES.WARNING && <IoIosWarning />}
                </div>
                <div>
                  <p className="notification-title">{toast.title}</p>
                  <p className="notification-message">{toast.message}</p>
                </div>
                <div
                  onAnimationEnd={() => deleteToast(toast.id)}
                  className="progress-bar"
                ></div>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    </>
  );
};

Toast.propTypes = {
  position: PropTypes.oneOf([
    "top-right",
    "top-left",
    "bottom-right",
    "bottom-left",
  ]),
};

Toast.defaultProps = {
  position: "top-right",
};
