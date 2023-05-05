const UserController = require('./User')

module.exports.createBaseUsers = async () => {
    // Admin
    await UserController.newUser('admin', 'admin', 224608005, 'Administrative healthcare staff', true, false, false)

    // Laboratory hematologist
    await UserController.newUser('hugo', 'hugo', 224608005, 'Laboratory hematologist', false, true, true)

    // Laboratory medicine specialist
    await UserController.newUser('tomas', 'tomas', 224608005, 'Laboratory medicine specialist', false, true, true)

    // Clinical assistant 1
    await UserController.newUser('ciaran', 'ciaran', 224608005, 'Clinical assistant', false, false, true)

    // Clinical assistant 2
    await UserController.newUser('goncalo', 'goncalo', 224608005, 'Clinical assistant', false, false, true)
}