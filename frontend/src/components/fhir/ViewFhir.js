import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../static/UserContext';
import { useParams } from 'react-router-dom';
import {Form} from "protected-aidaforms";
let { editedFhirJDT } = require('../../static/functions')
let style = require('../../static/style_analises.json');
var axios = require('axios');

function ViewFhir() {
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

    axios.post("http://localhost:8080/fhir/"+composition_id, message_body)
      .then(res => {
        setComposition(res.data.fhir[0].message);
        setLoading(false);  
        console.log(res.data.fhir[0].message);
      })
      .catch(err => {
        console.log(err);
      });
  }, [user.username, user.password, composition_id]);

  return (
    <div>
      {loading && (
        <p>Loading...</p>
      )}
      {!(loading) && (
        <Form
          template={editedFhirJDT(composition)}
          fhirDesign={JSON.stringify(style)}

          canSubmit={false}

          canSave={false}
          
          canCancel={false}
          onCancel={status => console.log("CANCELLED:", status)}
          
          editMode={false}
          professionalTasks={["Registar Pedido", "Consultar Pedido","Anular Pedido"]}
        />
      )}
    </div>
    );
}

export default ViewFhir;