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
