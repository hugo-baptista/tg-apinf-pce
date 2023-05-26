import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../static/UserContext';
import { Link } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

var axios = require('axios');

function ListFhir() {
  const {user} = useContext(UserContext);

  const [success, setSuccess] = useState(false);

  const [fhirList, setFhirList] = useState([]);
  useEffect(() => {    
    let message_body = {
      current_user: {
        username: user.username,
        password: user.password
      }
    }

    axios.post('http://localhost:8080/fhir/list', message_body)
    .then((response) => {
      console.log(response.data);
      if (response.data.success) {
        setFhirList(response.data.fhirs);
      } else {
        setSuccess(response.data.info)
      }
    });
  }, [user.username, user.password]);

  return (
    <div>
      <h1 className='title'>Lista das Mensagens FHIR: </h1>
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
            {fhirList.map((fhir) => (
              <TableRow
                key={fhir.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {fhir.createdAt}
                </TableCell>
                <TableCell component="th" scope="row">
                  {fhir.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  ({fhir.message.entry[1].resource.id}) {fhir.message.entry[1].resource.name[0].text}
                </TableCell>
                <TableCell align="right">
                  <Link to={"/fhir/"+fhir.id}>
                    <IconButton aria-label="edit" size="small" color='primary'>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Link>
                  <IconButton aria-label="delete" size="small" color='error'>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {success && (
        <p>Erro: {success}</p>
      )}
    </div>
  );
}

export default ListFhir;