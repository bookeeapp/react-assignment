import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
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
              <Link to="/">My shifts</Link>
            </li>
            <li>
              <Link to="/shifts">Available shifts</Link>
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
