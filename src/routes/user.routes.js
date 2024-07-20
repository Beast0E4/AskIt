const { isUserAuthenticated } = require("../validators/auth.validator")
const userController = require('../controller/user.controller')

module.exports = function(app) {
    app.get('/askit/users', isUserAuthenticated, userController.getUsers);
    app.get('/askit/users/:id', isUserAuthenticated, userController.getUser);
    app.patch('/askit/users/updateUser', isUserAuthenticated, userController.updateUser);
    app.delete('/askit/users/deleteUser/:id', isUserAuthenticated, userController.deleteUser);
}