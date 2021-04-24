import { ShiftsOnDate } from "../../components";
import "./AvailableShifts.css";

export const AvailableShifts = () => {
  return (
    <div className="available-shifts">
      <div className="header">
        <span className="city">Helsinki (5)</span>
        <span className="city">Tampere (8)</span>
        <span className="city">Turku (7)</span>
      </div>
      <div className="content">
        <ShiftsOnDate />
      </div>
    </div>
  );
};
