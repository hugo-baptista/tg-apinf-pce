let UserTypeModel = require('../model/UserType');

module.exports.newUserType = async (code, designation, create_users, create_forms, view_forms, view_fhir) => {
    try {
        newUserType = {
            code,
            designation,
            permissions: {
                create_users,
                create_forms,
                view_forms,
                view_fhir
            }
        }
        let UserType = new UserTypeModel(newUserType);
        let response = await UserType.save();
        return {success: true, response};
    } catch(err) {
        console.log(err);
        return {success: false, response: err}
    }
}

