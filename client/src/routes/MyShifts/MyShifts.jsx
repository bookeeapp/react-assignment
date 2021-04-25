import { useSelector } from "react-redux";
import { ShiftsOnDate } from "../../components";
import { selectMyShifts } from "../../slices/shiftSlice";
// import PropTypes from "prop-types";
import "./MyShifts.css";

export const MyShifts = () => {
  const myBookedShifts = useSelector((state) => selectMyShifts(state));

  if (myBookedShifts.length === 0) {
    return (
      <div className="my-shifts">
        <div className="no-shifts">No upcoming shifts!</div>
      </div>
    );
  }

  return (
    <div className="my-shifts">
      {myBookedShifts.map(({ id, ...rest }) => (
        <ShiftsOnDate key={id} {...rest} showShiftArea={true} />
      ))}
    </div>
  );
};
