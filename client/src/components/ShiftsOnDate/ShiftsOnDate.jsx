import { TableHeader } from "../TableHeader/TableHeader";
import { TableCell } from "../TableCell/TableCell";
// import PropTypes from "prop-types";
import "./ShiftsOnDate.css";

export const ShiftsOnDate = () => {
  return (
    <div className="shift">
      <TableHeader dateText={"Today"} shiftInfoText={"2 shifts, 4 h"} />
      <TableCell shiftTime={"12:00-14:00"} shiftArea={"Helsinki"} />
      <TableCell shiftTime={"12:00-14:00"} shiftArea={"Helsinki"} />
      <TableCell shiftTime={"12:00-14:00"} shiftArea={"Helsinki"} />
    </div>
  );
};
