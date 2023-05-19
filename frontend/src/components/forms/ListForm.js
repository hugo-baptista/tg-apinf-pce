import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../static/UserContext';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';

var axios = require('axios');

function ListForm() {
  const {user} = useContext(UserContext);

  const [formList, setFormList] = useState([]);
  useEffect(() => {    
    let message_body = {
      current_user: {
        username: user.username,
        password: user.password
      }
    }

    axios.post('http://localhost:8080/forms/list', message_body)
    .then((response) => {
      setFormList(response.data.forms);
      console.log(response.data);
    });
  }, [user.username, user.password]);

  return (
    <div>
      {user && user.permissions.create_forms && (
        <Link to="/forms/create">
          <Button startIcon={<AddIcon/>} color='success' variant='contained'
            sx={{ my: 2 }}
          >
              Adicionar novo Form
          </Button>
        </Link>
      )}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Form (ID)</TableCell>
              <TableCell align="right">Opções</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formList.map((form) => (
              <TableRow
                key={form.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {form.id}
                </TableCell>
                <TableCell align="right">
                  <IconButton aria-label="edit" size="small" color='primary'>
                    <SendIcon fontSize="small" />
                  </IconButton>
                  <IconButton aria-label="edit" size="small" color='success'>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton aria-label="delete" size="small" color='error'>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ListForm;