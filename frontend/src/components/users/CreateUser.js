import { Box, Button, TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';

var axios = require('axios');

const options = [
  {
  designation: 'Administrative healthcare staff',
  code: 224608005,
  permissions: {
     create_users: true,
     create_froms: false,
     view_forms: false,
     }
  },
  {
  designation: 'Laboratory hematologist',
  code: 18850004,
  permissions: {
     create_users: false,
     create_froms: true,
     view_forms: true
     }
  },
  {
  designation: 'Laboratory medicine specialist',
  code: 61246008,
  permissions: {
     create_users: false,
     create_froms: true,
     view_forms: true
     }
  },
  {
  designation: 'Clinical assistant',
  code: 224529009,
  permissions: {
     create_users: false,
     create_froms: false,
     view_forms: true
     }
  }
]

const AdicionarAdmin = () => {
  const handleClear = () => {
    document.getElementById('uname').value = '';
    document.getElementById('pass').value = '';
    document.getElementById('name').value = '';
    document.getElementById("type_of_user").innerHTML = '';
  };

  const handleSubmission = () => {
    const new_uname = document.getElementById("uname").value;
    const new_pass = document.getElementById("pass").value;
    const new_name = document.getElementById("name").value;
    const new_type = document.getElementById("type_of_user").innerHTML;

    const new_user = {
        username: new_uname,
        password: new_pass,
        name: new_name,
        temp: new_type
    }

    console.log(new_user);
};

  return(
    <div>
      <TextField id='uname' placeholder="Username" variant="outlined" /> <br /> <br />
      <TextField id='pass' placeholder="Password" variant="outlined" /> <br /> <br />
      <TextField id='name' placeholder="Nome" variant="outlined" />
      <Box
        component="form"
        sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off">
        <TextField
          id="type_of_user"
          select
          label="Tipo de utilizador"
          >
          {options.map((option) => (
            <MenuItem key={option.designation} value={option}>
              {option.designation}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Button variant="outlined" size="large" onClick={handleClear} startIcon={<ClearIcon />}>
          Limpar
      </Button>
      <Button variant="contained" size="large" onClick={handleSubmission} endIcon={<AddIcon />}>
          Adicionar
      </Button>
    </div>
  );
}
export default AdicionarAdmin;