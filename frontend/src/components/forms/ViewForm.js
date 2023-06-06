import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../static/UserContext';
import {Form} from "protected-aidaforms";
import { useParams } from 'react-router-dom';
let { editedJDT } = require('../../static/functions')
let style = require('../../static/style_analises.json');
var axios = require('axios');

function ViewForm() {
  const {user} = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [composition, setComposition] = useState(null);
  const { composition_id } = useParams();

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

  return (
    <div>
      {loading && (
        <p className='center'>Loading...</p>
      )}
      {!(loading) && (
        <Form
          template={editedJDT(composition)}
          formDesign={JSON.stringify(style)}

          canSubmit={false}

          canSave={false}
          
          canCancel={false}
          onCancel={status => console.log("CANCELLED:", status)}
          
          editMode={true}
          professionalTasks={["Registar Pedido", "Consultar Pedido","Anular Pedido"]}
        />
      )}
    </div>
    );
}

export default ViewForm;