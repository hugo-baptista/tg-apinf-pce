// Editar o JDT com os dados da composition
function editedJDT(composition) {
    let original_jdt = require('./jdt_analises.json');
    let jdt = JSON.parse(JSON.stringify(original_jdt));

    // Paciente
    // ID do paciente
    jdt.items[0][0].items[0].items[0].value=composition["items.0.0.items.0.items.0.value"];
    // Nome paciente
    jdt.items[0][0].items[0].items[1].value=composition["items.0.0.items.0.items.1.value"];
    // Género
    jdt.items[0][0].items[0].items[4].value = composition["items.0.0.items.0.items.4.value"];
    // Data de nascimento
    jdt.items[0][0].items[0].items[3].items[0].value = composition["items.0.0.items.0.items.3.items.0.value"];
    // Morada
    jdt.items[0][0].items[0].items[2].items[0].value = composition["items.0.0.items.0.items.2.items.0.value"];
    
    // Procedimento
    // Categoria
    jdt.items[0][1].items[0].value = composition["items.0.1.items.0.value"];
    // Código
    jdt.items[0][1].items[1].value = composition["items.0.1.items.1.value"];
    // Conclusão
    jdt.items[0][1].items[3].value = composition["items.0.1.items.3.value"];

    // Resultados
    jdt.items[0][1].items[2].value = composition["items.0.1.items.2.value"];

    // Recetor
    // Nome
    jdt.items[0][1].items[5].items[0].value = composition["items.0.1.items.5.items.0.value"];
    // ID
    jdt.items[0][1].items[5].items[1].value = composition["items.0.1.items.5.items.1.value"];

    return jdt;
}



// Editar o JDT com os dados da composition
function editedFhirJDT(fhir) {
    let original_jdt = require('./jdt_analises.json');
    let jdt = JSON.parse(JSON.stringify(original_jdt));

    // Paciente
    // ID do paciente
    jdt.items[0][0].items[0].items[0].value = fhir.entry[1].resource.id;
    // // Nome paciente
    jdt.items[0][0].items[0].items[1].value = fhir.entry[1].resource.name[0].text;
    // // Género
    // jdt.items[0][0].items[0].items[4].value = fhir.entry[1].resource.gender;
    // // Data de nascimento
    jdt.items[0][0].items[0].items[3].items[0].value = fhir.entry[1].resource.birthDate;
    // // Morada
    jdt.items[0][0].items[0].items[2].items[0].value = fhir.entry[1].resource.address[0].text;
    
    // Procedimento
    // Categoria
    // jdt.items[0][1].items[0].value = composition["items.0.1.items.0.value"];
    // // Código
    // jdt.items[0][1].items[1].value = composition["items.0.1.items.1.value"];
    // // Conclusão
    // jdt.items[0][1].items[3].value = composition["items.0.1.items.3.value"];

    // Resultados
    // jdt.items[0][1].items[2].value = composition["items.0.1.items.2.value"];

    // Recetor
    // Nome
    // jdt.items[0][1].items[5].items[0].value = composition["items.0.1.items.5.items.0.value"];
    // // ID
    // jdt.items[0][1].items[5].items[1].value = composition["items.0.1.items.5.items.1.value"];

    return jdt;
}



module.exports = {editedJDT, editedFhirJDT};