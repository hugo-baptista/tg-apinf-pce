let UserModel = require('../model/User');

module.exports.newUser = async (username, password, name, code, designation, create_users, create_forms, view_forms) => {
    try {
        newUser = {
            username,
            password,
            name,
            code,
            designation,
            permissions: {
                create_users,
                create_forms,
                view_forms
            }
        }
        let User = new UserModel(newUser);
        let response = await User.save();
        return {success: true, response};
    } catch(err) {
        console.log(err);
        return {success: false, response: err}
    }
}

