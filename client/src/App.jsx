import { LoadingOverlay, Toast } from "./components";
import { RouteConfig } from "./RouteConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <>
      <LoadingOverlay />
      <Toast />
      <RouteConfig />
    </>
  );
}

export default App;
