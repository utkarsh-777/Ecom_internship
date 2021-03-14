import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import Signup from "./components/signup";
import Login from "./components/login";
import Home from "./components/home";
import UpdateItem from "./components/update";
import CreateItem from './create';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/" component={Home} />
        <Route exact path="/updateitem" component={UpdateItem} />
        <Route exact path="/create" component={CreateItem} />
      </Switch>
    </Router>
  );
}

export default App;
