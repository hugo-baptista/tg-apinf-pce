import { useContext, useState } from 'react';
import { Button, Link, TextField } from '@mui/material';
import { UserContext } from '../../static/UserContext';

var axios = require('axios');

function Login() {
    const [errorMessages, setErrorMessages] = useState({});
    const {user, userLogin} = useContext(UserContext);
  
    const handleSubmit = () => {
      let data = {
        username: document.getElementById("uname").value,
        password: document.getElementById("pass").value
      }

      axios.put('http://localhost:8080/users/validate', data)
      .then(res => {
        if (res.data.user) {
          console.log('user: ' + res.data);
          userLogin(res.data.user)
          console.log(user);
        } else if (res.data.password_error) {
          setErrorMessages({ name: "pass_wrong", message: "Invalid Password!" });
        } else {
          setErrorMessages({ name: "uname_wrong", message: "Invalid Username!" });
        }
      })
      .catch(err => {
        console.log(err);
      })
    };
  
    const renderErrorMessage = (name) =>
      name === errorMessages.name && (
        <div className="error">{errorMessages.message}</div>
      );
  
    return (
      <div className="login-form">
        <TextField
          id="uname"
          label="Username"
          type="search"
          variant="filled"
        /><br /><br />
        {renderErrorMessage("uname_wrong")}
        <TextField
          id="pass"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="filled"
        /><br /><br />
        {renderErrorMessage("pass_wrong")}
        <Link to='/' onClick={handleSubmit}>
          <Button variant="contained">
            Login
          </Button>
        </Link>
      </div>
    );
  }
  
  export default Login;
  