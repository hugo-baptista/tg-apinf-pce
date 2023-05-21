const FormSchema = require('../model/Form');

module.exports.newForm = async (id, composition) => {
    try {
        newForm = {
            id,
            composition
        }
        let Form = new FormSchema(newForm);
        let response = await Form.save();
        return {success: true, response};
    } catch(err) {
        console.log(err);
        return {success: false, response: err}
    }
}

