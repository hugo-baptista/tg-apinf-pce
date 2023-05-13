import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { UserContext } from "./static/UserContext";
import Navbar from "./Navbar";
import Home from "./Home";
import NotFound from "./NotFound";
import Login from "./components/users/Login";
import CreateUser from "./components/users/CreateUser";
import Form from "./components/forms/FormPage";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser
      ? JSON.parse(storedUser)
      : false;
  });

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const userLogin = (userData) => {
    setUser(userData);
  };

  const userLogout = () => {
    setUser(false);
  };


  return (
    <UserContext.Provider value={{user, userLogin, userLogout}}>
      <Router>
        <div className="App">
          <Navbar/>
          <Switch>
            <Route exact path="/">
              <div className="content">
                <Home></Home>
              </div>
            </Route>
            <Route path="/login">
              <div className="content">
                <Login></Login>
              </div>
            </Route>
            <Route path="/form">
              <Form></Form>
            </Route>
            <Route path="/createuser">
              <div className="content">
                <CreateUser></CreateUser>
              </div>
            </Route>
            <Route path="*">
              <div className="content">
                <NotFound></NotFound>
              </div>
            </Route>
          </Switch>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
