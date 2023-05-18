import { useContext, useState } from 'react';
import { UserContext } from '../../static/UserContext';
import {Form} from "protected-aidaforms";
let json = require('../../static/jdt_analises.json');
let style = require('../../static/style_analises.json');

var axios = require('axios');

function CreateForm() {
  const {user} = useContext(UserContext);
  const [response, setResponse] = useState('');

  const saveComposition = (composition) => {
    let message_body = {
      current_user: {
        username: user.username,
        password: user.password
      },
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

  const renderForm = (
    <div className="FormPage">
      <Form
        onSubmit={(values, changedFields) => saveComposition(values)}
        onSave={(values, changedFields) => console.log("SAVEDVALUES: ", values, "CHANGED FIELDS: ", changedFields)}
        onCancel={status => console.log("CANCELLED:", status)}
        template={json}
        dlm={{}}
        showPrint={true}
        editMode={true}
        professionalTasks={["Registar Pedido", "Consultar Pedido","Anular Pedido"]}
        canSubmit={true}
        canSave={false}
        canCancel={true}
        patientData={{
          "numSequencial": 1904865,
          "episodio": 21016848,
          "modulo": "INT",
          "processo": 99998888,
          "nome": "Manuel Utente Teste Teste Teste",
          "dtaNascimento": "1945-08-15",
          "idade": 77,
          "sexo": "Masculino"
        }}
        reportData={{
          dtaEncerrada: "22-05-2019 13:02",
          dtaCriada: "10-05-2019 18:47",
          realizada: "Joana Pascoal",
          responsavel: "José Costa"
        }}
        submitButtonDisabled={false}
        saveButtonDisabled={false}
        formDesign={JSON.stringify(style)}
      />
      {response && (
        <p>{response}</p>
      )}
    </div>
  );
  return renderForm;
}

export default CreateForm;