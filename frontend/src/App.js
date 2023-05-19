import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { UserContext } from "./static/UserContext";
import Navbar from "./Navbar";
import Home from "./Home";
import NotFound from "./NotFound";
import Login from "./components/users/Login";
import CreateUser from "./components/users/CreateUser";
import ListForm from "./components/forms/ListForm";
import CreateForm from "./components/forms/CreateForm";

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
              <Home/>
            </Route>
            <Route exact path="/login">
              <Login/>
            </Route>
            <Route exact path="/forms">
              <ListForm/>
            </Route>
            <Route exact path="/forms/create">
              <CreateForm/>
            </Route>
            <Route exact path="/users/create">
              <CreateUser/>
            </Route>
            <Route path="*">
              <NotFound/>
            </Route>
          </Switch>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
