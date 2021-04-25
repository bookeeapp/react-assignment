import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";
import { ShiftsOnDate } from "../../components";
import {
  selectShiftAreas,
  selectShiftsByArea,
  setSelectedArea,
} from "../../slices";
import "./AvailableShifts.css";

export const AvailableShifts = () => {
  const dispatch = useDispatch();
  const shiftAreas = useSelector((state) => selectShiftAreas(state));
  const selectedArea = useSelector((state) => state.shifts.selectedArea);
  const shiftsInCity = useSelector((state) => selectShiftsByArea(state));

  const onCitySelection = (city) => {
    dispatch(setSelectedArea(city));
  };

  return (
    <div className="available-shifts">
      <div className="header">
        {shiftAreas.map(([cityName, shiftsInCity]) => (
          <span
            key={cityName}
            onClick={() => {
              onCitySelection(cityName);
            }}
            className={classNames({
              city: true,
              active: selectedArea === cityName,
            })}
          >
            {cityName} ({shiftsInCity})
          </span>
        ))}
      </div>
      <div className="content">
        {shiftsInCity.map(({ id, ...rest }) => (
          <ShiftsOnDate key={id} {...rest} />
        ))}
      </div>
    </div>
  );
};
