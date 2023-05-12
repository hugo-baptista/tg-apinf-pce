const UserController = require('./User')

module.exports.createBaseUsers = async () => {
    // Admin
    await UserController.newUser('admin', 'admin', 'Administrador', 224608005, 'Administrative healthcare staff', true, false, false, false)

    // Laboratory hematologist
    await UserController.newUser('hugo', 'hugo', 'Hugo Silva', 18850004, 'Laboratory hematologist', false, true, true, true)

    // Laboratory medicine specialist
    await UserController.newUser('tomas', 'tomas', 'Tomás Lima', 61246008, 'Laboratory medicine specialist', false, true, true, true)

    // Clinical assistant 1
    await UserController.newUser('ciaran', 'ciaran', 'Ciarán McEvoy', 224529009, 'Clinical assistant', false, false, true, true)

    // Clinical assistant 2
    await UserController.newUser('goncalo', 'goncalo', 'Gonçalo Carvalho', 224529009, 'Clinical assistant', false, false, true, true)
}