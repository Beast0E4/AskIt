const { isUserAuthenticated } = require("../validators/auth.validator")
const commentController = require('../controller/comments.controller')

module.exports = function(app) {
    app.post('/askit/comment/create', isUserAuthenticated, commentController.createComment);
    app.get('/askit/comment', commentController.getComments)
}