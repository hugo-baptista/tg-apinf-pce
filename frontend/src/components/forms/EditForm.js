import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../static/UserContext';
import {Form} from "protected-aidaforms";
import { useParams } from 'react-router-dom';
let { editedJDT } = require('../../static/functions')
let style = require('../../static/style_analises.json');
var axios = require('axios');

function EditForm() {
  const {user} = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [composition, setComposition] = useState(null);
  const { formID: composition_id } = useParams();


  useEffect(() => {
    let message_body = {
      current_user: {
        username: user.username,
        password: user.password
      }
    }

    axios.post("http://localhost:8080/forms/"+composition_id, message_body)
      .then(res => {
        setComposition(res.data.form[0].composition);
        setLoading(false);
        console.log(res.data.form[0].composition);
      })
      .catch(err => {
        console.log(err);
      });
  }, [user.username, user.password, composition_id]);

  const saveComposition = (composition) => {
    console.log(composition);

    let message_body = {
      current_user: {
        username: user.username,
        password: user.password
      },
      composition_id,
      composition
    }
  
    axios.post('http://localhost:8080/forms/submit', message_body)
      .then(res => {
        setResponse(res.data.info);
        alert(res.data.info);
      })
      .catch(err => {
        console.log(err);
      })
  };

  return (
    <div>
      {loading && (
        <p>Loading...</p>
      )}
      {!(loading) && (
        <Form
          template={editedJDT(composition)}
          formDesign={JSON.stringify(style)}

          canSubmit={true}
          onSubmit={(values) => saveComposition(values)}

          canSave={false}
          
          canCancel={true}
          onCancel={status => console.log("CANCELLED:", status)}
          
          editMode={true}
          professionalTasks={["Registar Pedido", "Consultar Pedido","Anular Pedido"]}
        />
      )}
      {response && (
        <p>{response}</p>
      )}
    </div>
    );
}

export default EditForm;