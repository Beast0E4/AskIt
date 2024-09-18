const { isUserAuthenticated } = require("../validators/auth.validator");
const userController = require('../controller/user.controller');
const upload = require("../config/multer.config");

module.exports = function(app) {
    app.get('/askit/users', userController.getUsers);
    app.get('/askit/users/:id', isUserAuthenticated, userController.getUser);
    app.patch('/askit/users/updateUser', isUserAuthenticated, upload.single('image'), userController.updateUser);
    app.delete('/askit/users/deleteUser/:id', isUserAuthenticated, userController.deleteUser);
    app.patch('/askit/users/toggleFollow', isUserAuthenticated, userController.toggleFollow);
    app.patch('/askit/user/question', isUserAuthenticated, userController.saveQuestion)
    app.get('/askit/users/voted/:id', userController.getVoted);
    app.get('/askit/users/getFollowing/:id', isUserAuthenticated, userController.getFollowing);
}