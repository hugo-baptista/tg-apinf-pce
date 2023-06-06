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

var axios = require('axios');

function ListUser() {
  const {user} = useContext(UserContext);

  const [success, setSuccess] = useState(false);

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
      console.log(response.data);
      if (response.data.success) {
        setUserList(response.data.users);
      } else {
        setSuccess(response.data.info)
      }
    });
  }, [user.username, user.password]);

  return (
    <div>
      {user && user.permissions.create_users && (
        <div className="center">
          <Link to="/users/create">
            <Button startIcon={<AddIcon/>} color='success' variant='contained'
              sx={{ my: 2 }}
            >
                Criar Utilizador
            </Button>
          </Link>
        </div>
      )}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Tipo de Utilizador</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {success && (
        <p className='center'>Erro: {success}</p>
      )}
    </div>
  );
}

export default ListUser;