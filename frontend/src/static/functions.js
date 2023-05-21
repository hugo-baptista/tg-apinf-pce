// Editar o JDT com os dados da composition
function editedJDT(composition) {
    let jdt = require('./jdt_analises.json');

    // Paciente
    // Nome paciente
    if (composition["items.0.0.items.0.items.0.value"]) {
        jdt.items[0][0].items[0].items[0].value=composition["items.0.0.items.0.items.0.value"].blocks[0].text;
    }
    // Género
    jdt.items[0][0].items[0].items[3].value = composition["items.0.0.items.0.items.3.value"];
    // Data de nascimento
    jdt.items[0][0].items[0].items[2].items[0].value.date = composition["items.0.0.items.0.items.2.items.0.value.date"];
    jdt.items[0][0].items[0].items[2].items[0].value.time = composition["items.0.0.items.0.items.2.items.0.value.time"];
    // Morada
    if (composition["items.0.0.items.0.items.1.items.0.value"]) {
        jdt.items[0][0].items[0].items[1].items[0].value = composition["items.0.0.items.0.items.1.items.0.value"].blocks[0].text;
    }
    
    // Procedimento
    // Categoria
    jdt.items[0][1].items[0].value = composition["items.0.1.items.0.value"];
    // Código
    jdt.items[0][1].items[1].value = composition["items.0.1.items.1.value"];
    // Conclusão
    if (composition["items.0.1.items.3.value"]) {
        jdt.items[0][1].items[3].value = composition["items.0.1.items.3.value"].blocks[0].text;
    }

    // Resultados
    jdt.items[0][1].items[2].value = [];
    composition["items.0.1.items.2.value"].forEach(resultado => {
        let resultado_corrigido = JSON.parse(JSON.stringify(resultado))
        if (resultado["values"]["items.0.1.items.2.items.1.value"]) {
            resultado_corrigido["values"]["items.0.1.items.2.items.1.value"] = resultado["values"]["items.0.1.items.2.items.1.value"]["blocks"][0]["text"];
        }
        if (resultado["values"]["items.0.1.items.2.items.2.items.0.value"]) {
            resultado_corrigido["values"]["items.0.1.items.2.items.2.items.0.value"] = resultado["values"]["items.0.1.items.2.items.2.items.0.value"]["blocks"][0]["text"];
        }
        if (resultado["values"]["items.0.1.items.2.items.2.items.1.value"]) {
            resultado_corrigido["values"]["items.0.1.items.2.items.2.items.1.value"] = resultado["values"]["items.0.1.items.2.items.2.items.1.value"]["blocks"][0]["text"];
        }
        jdt.items[0][1].items[2].value.push(resultado_corrigido);
    });

    // Recetor
    // Nome
    if (composition["items.0.1.items.5.items.0.value"]) {
        jdt.items[0][1].items[5].items[0].value = composition["items.0.1.items.5.items.0.value"].blocks[0].text;
    }
    // ID
    if (composition["items.0.1.items.5.items.1.value"]) {
        jdt.items[0][1].items[5].items[1].value = composition["items.0.1.items.5.items.1.value"].blocks[0].text;
    }

    return jdt;
}
  
module.exports = {editedJDT};