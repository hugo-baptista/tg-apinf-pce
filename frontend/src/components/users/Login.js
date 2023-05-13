import { useContext, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { UserContext } from '../../static/UserContext';
import LoginIcon from '@mui/icons-material/Login';

var axios = require('axios');

function Login() {
  const [errorMessages, setErrorMessages] = useState({});
  const {userLogin} = useContext(UserContext);

  const handleSubmit = () => {
    let data = {
      username: document.getElementById("uname").value,
      password: document.getElementById("pass").value
    }

    axios.put('http://localhost:8080/users/validate', data)
    .then(res => {
      if (res.data.user) {
        userLogin(res.data.user);
        setErrorMessages({ name: "success", message: "Logged in!" });
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
      <TextField id="uname" label="Username" type="search" variant="filled"
      /><br /> <br />
      {renderErrorMessage("uname_wrong")}
      <TextField id="pass" label="Password" type="password" variant="filled" autoComplete="current-password"
      /><br /> <br />
      {renderErrorMessage("pass_wrong")}
      <Button variant="contained"  onClick={handleSubmit} endIcon={<LoginIcon/>}
        sx={{ marginRight:1, minWidth: 200 }} size="large"
      >
        Login
      </Button>
      {renderErrorMessage("success")}
    </div>
  );
};
  
export default Login;
  