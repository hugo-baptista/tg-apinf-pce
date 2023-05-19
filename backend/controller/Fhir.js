const FhirSchema = require('../model/Fhir');

module.exports.newFhir = async (id, message) => {
    try {
        newFhir = {
            id,
            message
        }
        let Fhir = new FhirSchema(newFhir);
        let response = await Fhir.save();
        return {success: true, response};
    } catch(err) {
        console.log(err);
        return {success: false, response: err}
    }
}