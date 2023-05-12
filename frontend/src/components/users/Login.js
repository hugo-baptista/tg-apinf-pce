import React, { useContext, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { UserContext } from '../../static/UserContext';

var axios = require('axios');

function Login() {
    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const {user, setUser} = useContext(UserContext);
  
    const handleSubmit = (event) => {
      event.preventDefault();
  
      var { uname, pass } = document.forms[0];

      let data = {
        username: uname.value,
        password: pass.value
      }

      axios.put('http://localhost:8080/users/validate', data)
      .then(res => {
        if (res.data.user) {
          console.log('user: ' + res.data);
          setUser(res.data.user)
          setIsSubmitted(true);
          console.log(user);
        } else if (res.data.password_error) {
          setErrorMessages({ name: "pass", message: "Invalid Password!" });
        } else {
          setErrorMessages({ name: "uname", message: "Invalid Username!" });
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
  
    const renderForm = (
      <div>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
          <div>
            <TextField
              id="uname"
              label="Username"
              type="search"
              variant="filled"
            />
            <br />
            {renderErrorMessage("uname")}
            <TextField
              id="pass"
              label="Password"
              type="password"
              autoComplete="current-password"
              variant="filled"
            />
            <br />
            {renderErrorMessage("pass")}
            <Button variant="contained" type='submit'>
              Login
            </Button>
          </div>
        </Box>
      </div>

      // <div className="form">
      //   <form onSubmit={handleSubmit}> 
      //     <div className="input-container">
      //       <label>Username </label>
      //       <input type="text" name="uname" required />
      //       {renderErrorMessage("uname")}
      //     </div>
      //     <div className="input-container">
      //       <label>Password </label>
      //       <input type="password" name="pass" required />
      //       {renderErrorMessage("pass")}
      //     </div>
      //     <div className="button-container">
      //       <input type="submit" />
      //     </div>
      //   </form>
      // </div>
    );
  
    return (
      <div className="app">
        <div className="login-form">
          {/* <div className="title">Login</div> */}
          {isSubmitted
            ? <div>Login efetuado com sucesso</div>
            : renderForm
          }
        </div>
      </div>
    );
  }
  
  export default Login;
  