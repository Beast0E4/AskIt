const { isUserAuthenticated } = require("../validators/auth.validator")
const userController = require('../controller/user.controller');
const upload = require("../config/multer.config");

module.exports = function(app) {
    app.get('/askit/users', userController.getUsers);
    app.get('/askit/users/:id', isUserAuthenticated, userController.getUser);
    app.patch('/askit/users/updateUser', isUserAuthenticated, upload.single('image'), userController.updateUser);
    app.delete('/askit/users/deleteUser/:id', isUserAuthenticated, userController.deleteUser);
    app.post('/askit/users/follow', isUserAuthenticated, userController.followUser);
    app.patch('/askit/users/unFollow', isUserAuthenticated, userController.unFollowUser);
}