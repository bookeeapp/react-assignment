import { useSelector } from "react-redux";
import "./LoadingOverlay.css";

export const LoadingOverlay = () => {
  const isLoading = useSelector((state) => state.shifts.isLoading);

  return isLoading ? <div className="loading-overlay"></div> : null;
};
