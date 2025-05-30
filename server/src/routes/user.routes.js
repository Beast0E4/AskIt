const { isUserAuthenticated } = require("../validators/auth.validator");
const userController = require('../controller/user.controller');
const upload = require("../config/multer.config");

module.exports = function(app) {
    app.get('/users', userController.getUsers);
    app.get('/users/:id', isUserAuthenticated, userController.getUser);
    app.patch('/users/updateUser', isUserAuthenticated, upload.single('image'), userController.updateUser);
    app.delete('/users/deleteUser/:id', isUserAuthenticated, userController.deleteUser);
    app.patch('/users/toggleFollow', isUserAuthenticated, userController.toggleFollow);
    app.patch('/user/question', isUserAuthenticated, userController.saveQuestion)
    app.get('/users/voted/:id', userController.getVoted);
    app.get('/users/getFollowing/:id', isUserAuthenticated, userController.getFollowing);
    app.get('/users/getFollower/:id', isUserAuthenticated, userController.getFollower);
    app.get('/users/saved/:id', isUserAuthenticated, userController.getSaved);

    app.post('/sendOtp', userController.sendOtp);
    app.post('/verifyOtp', userController.verifyOtp);
}