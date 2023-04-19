import React, { useState } from 'react';

function Login() {
    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
  
    
    const database = [
      {
        username: "new",
        password: "new"
      },
    ];
  
    const errors = {
      uname: "invalid username",
      pass: "invalid password"
    };
  
    const handleSubmit = (event) => {
      
      event.preventDefault();
  
      var { uname, pass } = document.forms[0];
  
      
      const userData = database.find((user) => user.username === uname.value);
  
      
      if (userData) {
        if (userData.password !== pass.value) {
          
          setErrorMessages({ name: "pass", message: errors.pass });
        } else {
          setIsSubmitted(true);
        }
      } else {
        
        setErrorMessages({ name: "uname", message: errors.uname });
      }
    };
  
  
    
    const renderErrorMessage = (name) =>
      name === errorMessages.name && (
        <div className="error">{errorMessages.message}</div>
      );
  
    const renderForm = (
      <div className="form">
        <form onSubmit={handleSubmit}> 
          <div className="input-container">
            <label>Username </label>
            <input type="text" name="uname" required />
            {renderErrorMessage("uname")}
          </div>
          <div className="input-container">
            <label>Password </label>
            <input type="password" name="pass" required />
            {renderErrorMessage("pass")}
          </div>
          <div className="button-container">
            <input type="submit" />
          </div>
        </form>
      </div>
    );
  
    return (
      <div className="app">
        <div className="login-form">
          <div className="title">Login</div>
          {isSubmitted ? <div>Login efetuado com sucesso</div> : renderForm}
        </div>
      </div>
    );
  }
  
  export default Login;
  