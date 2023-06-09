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
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

var axios = require('axios');

function ListForm() {
  const {user} = useContext(UserContext);

  const [success, setSuccess] = useState(false);

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
      console.log(response.data);
      if (response.data.success) {
        setFormList(response.data.forms);
      } else {
        setSuccess(response.data.info)
      }
    });
  }, [user.username, user.password]);

  const handleDelete = (id) => {
    let message_body = {
      current_user: {
        username: user.username,
        password: user.password
      }
    }

    axios.post('http://localhost:8080/forms/delete/' + id, message_body)
    .then((res) => {
      alert(res.data.info);
    })
  }

  return (
    <div>
      <h1 className='title'>Lista dos Registos:</h1>

      <div className="center">
        {user && user.permissions.create_forms_fhir && (
          <Link to="/forms/create">
            <Button startIcon={<AddIcon/>} color='success' variant='contained'
              sx={{ my: 2 }}
            >
                Novo Registo
            </Button>
          </Link>
        )}
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Data de criação</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Paciente</TableCell>
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
                  {form.createdAt}
                </TableCell>
                <TableCell component="th" scope="row">
                  {form.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  ({form.composition["items.0.0.items.0.items.0.value"]}) {form.composition["items.0.0.items.0.items.1.value"]}
                </TableCell>
                <TableCell align="right">
                  <Link to={"/forms/"+form.id}>
                    <IconButton aria-label="edit" size="small" color='primary'>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Link>
                  {user && user.permissions.create_forms_fhir && (
                    <Link to={"/forms/edit/"+form.id}>
                      <IconButton aria-label="edit" size="small" color='success'>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Link>
                  )}
                  {user && user.permissions.create_forms_fhir && (
                    <IconButton aria-label="delete" size="small" color='error' onClick={() => handleDelete(form.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
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

export default ListForm;