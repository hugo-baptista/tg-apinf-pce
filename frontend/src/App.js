import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { UserContext } from "./static/UserContext";
import Navbar from "./Navbar";
import Home from "./Home";
import NotFound from "./NotFound";
import Login from "./components/users/Login";
import ListForm from "./components/forms/ListForm";
import ViewForm from "./components/forms/ViewForm";
import CreateForm from "./components/forms/CreateForm";
import EditForm from "./components/forms/EditForm";
import ListFhir from "./components/fhir/ListFhir";
import ViewFhir from "./components/fhir/ViewFhir";
import ListUser from "./components/users/ListUser";
import CreateUser from "./components/users/CreateUser";

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
            <Route exact path="/forms/:composition_id">
              <ViewForm/>
            </Route>
            <Route exact path="/forms/edit/:composition_id">
              <EditForm/>
            </Route>
            <Route exact path="/fhir">
              <ListFhir/>
            </Route>
            <Route exact path="/fhir/:composition_id">
              <ViewFhir/>
            </Route>
            <Route exact path="/users">
              <ListUser/>
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
