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

var axios = require('axios');

function ListUser() {
  const {user} = useContext(UserContext);

  const [userList, setUserList] = useState([]);
  useEffect(() => {    
    let message_body = {
      current_user: {
        username: user.username,
        password: user.password
      }
    }

    axios.post('http://localhost:8080/users/list', message_body)
    .then((response) => {
      setUserList(response.data.users);
      console.log(response.data);
    });
  }, [user.username, user.password]);

  return (
    <div>
      {user && user.permissions.create_users && (
        <Link to="/users/create">
          <Button startIcon={<AddIcon/>} color='success' variant='contained'
            sx={{ my: 2 }}
          >
              Criar Utilizador
          </Button>
        </Link>
      )}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Tipo de Utilizador</TableCell>
              <TableCell align="right">Opções</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userList.map((user) => (
              <TableRow
                key={user.username}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {user.username}
                </TableCell>
                <TableCell component="th" scope="row">
                  ({user.code}) {user.designation}
                </TableCell>
                <TableCell align="right">
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

export default ListUser;