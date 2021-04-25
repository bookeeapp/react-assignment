import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import { MyShifts, AvailableShifts } from "./routes";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="shift-app">
        <nav>
          <ul>
            <li>
              <NavLink to="/" exact>
                My shifts
              </NavLink>
            </li>
            <li>
              <NavLink to="/shifts">Available shifts</NavLink>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/shifts">
            <AvailableShifts />
          </Route>
          <Route path="/">
            <MyShifts />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
