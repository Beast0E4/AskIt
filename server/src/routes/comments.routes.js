const { isUserAuthenticated } = require("../validators/auth.validator")
const commentController = require('../controller/comments.controller')

module.exports = function(app) {
    app.post('/comment/create', isUserAuthenticated, commentController.createComment);
    app.get('/comment', commentController.getComments);
    app.delete('/comment/delete/:id', isUserAuthenticated, commentController.deleteComments);
    app.get('/likedComment/:id', isUserAuthenticated, commentController.getLikedComments);
}