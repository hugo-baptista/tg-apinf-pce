import Navbar from "./Navbar";
import Home from "./Home";
import NotFound from "./NotFound";
import Login from "./components/users/Login";
import CreateUser from "./components/users/CreateUser";
import Form from "./components/forms/FormPage";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { useState } from "react";
import { UserContext } from "./static/UserContext";

function App() {
  const [user, setUser] = useState(false);

  return (
    <UserContext.Provider value={{user, setUser}}>
      <Router>
        <div className="App">
          <Navbar/>
          <div className="content">
            <Switch>
              <Route exact path="/">
                <Home></Home>
              </Route>
              <Route path="/login">
                <Login></Login>
              </Route>
              <Route path="/form">
                <Form></Form>
              </Route>
              <Route path="/createuser">
                <CreateUser></CreateUser>
              </Route>
              <Route path="*">
                <NotFound></NotFound>
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
