import {Form} from "protected-aidaforms";
let json = require('./archetypes/jdt_analises.json');
let style = require('./style_analises.json');

const saveComposition = (composition) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(composition)
  };
  
  return fetch('/api/form-submissions', requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    });
};


function FormPage() {
  const renderForm = (
    <div className="FormPage">
      <Form
        onSubmit={(values, changedFields) => saveComposition({ values, changedFields })}
        onSave={(values, changedFields) => console.log("SAVEDVALUES: ", values, "CHANGED FIELDS: ", changedFields)}
        onCancel={status => console.log("CANCELLED:", status)}
        template={json}
        dlm={{}}
        showPrint={true}
        editMode={true}
        professionalTasks={["Registar Pedido", "Consultar Pedido","Anular Pedido"]}
        canSubmit={true}
        canSave={true}
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
    </div>
  );
  
  return renderForm;
}

export default FormPage;


  //  referenceModel={[
        //   {"itemName": "Número mecanográfico",
        //   "item": "num_mecanografico",
        //   "value": "123456",
        //   "formVisible": true
        //   },
        //   {"itemName": "Número sequencial",
        //   "item": "num_seq",
        //   "value": 1347095,
        //   "formVisible": true
        //   },
        //   {"itemName": "Nome",
        //   "item": "Nome",
        //   "value": "José da Silva Pinto",
        //   "formVisible": true
        //   }
        // ]}