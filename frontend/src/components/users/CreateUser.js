import { useContext, useState } from 'react';
import { UserContext } from '../../static/UserContext';
import { Button, FormControl, InputLabel, Select, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';

var axios = require('axios');

const CreateUser = () => {
  const {user} = useContext(UserContext)
  const [loading, setLoading] = useState(true);
  const [userTypes, setUserTypes] = useState([]);
  const [response, setResponse] = useState('');
  const [code, setCode] = useState('');
  const [designation, setDesignation] = useState('');

  if (loading) {
    axios.get('http://localhost:8080/users/types')
    .then(res => {
      console.log(res);
      setLoading(false);
      setUserTypes(res.data);
    });
  }

  const handleClear = () => {
    document.getElementById('uname').value = '';
    document.getElementById('pass').value = '';
    document.getElementById('name').value = '';
    setCode('');
    setDesignation('');
    // document.getElementById('designation').innerHTML = '';
  };
  
  const handleChange = (info) => {
    setDesignation(info.designation);
    setCode(info.code);
  };

  const handleSubmission = () => {
    let message_body = {
      current_user: {
        username: user.username,
        password: user.password
      },
      new_user: {
          username: document.getElementById("uname").value,
          password: document.getElementById("pass").value,
          name: document.getElementById("name").value,
          code: document.getElementById("code").value
      }
    }

    axios.post('http://localhost:8080/users/create', message_body)
    .then(res => {
      setResponse(res.data.info);
      if (res.data.success) {
        handleClear();
      }
    })
    .catch(err => {
      console.log(err);
    })
  };

  return(
    <div className="createuser">
      {loading && (
        <p className='center'>Loading...</p>
      )}
      {!loading && (
        <div>
          <TextField id='uname' label="Username" type="search" variant="filled" /> <br /> <br />
          <TextField id='pass' label="Password" type="search" variant="filled" /> <br /> <br />
          <TextField id='name' label="Nome" type="search" variant="filled" /> <br /> <br />
          <TextField id='code' label="Código" type="search" variant="filled"
            sx={{ marginRight: 1 }} InputProps={{readOnly: true}} value={code}
          />
            <FormControl variant="filled" sx={{ minWidth: 200 }}>
              <InputLabel id="demo-simple-select-filled-label">Tipo de Utilizador</InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="designation"
                value={designation}
              >
                {userTypes.map((userType) => (
                  <MenuItem key={userType.code} value={userType.designation} variant="filled" onClick={() => handleChange({code: userType.code, designation: userType.designation})}>
                    {userType.designation}
                  </MenuItem>
                ))}
              </Select>
            </FormControl><br /> <br />
          <Button variant="outlined" size="large" onClick={handleClear} startIcon={<ClearIcon />}
            sx={{ marginRight:1, minWidth: 200 }}>
              Limpar
          </Button>
          <Button variant="contained" size="large" onClick={handleSubmission} endIcon={<AddIcon />}
            sx={{ marginRight:1, minWidth: 200 }}>
              Adicionar
          </Button>
        </div>
      )}
      {response && (
        <p className='center'>{response}</p>
      )}
    </div>
  );
}
export default CreateUser;