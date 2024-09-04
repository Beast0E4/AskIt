const { isUserAuthenticated } = require("../validators/auth.validator")
const quesController = require('../controller/ques.controller')
const upload = require('../config/multer.config');

module.exports = function(app) {
    app.post('/askit/question', isUserAuthenticated, upload.single('image'), quesController.createQuestion);
    app.get('/askit/likedQuestions/:id', isUserAuthenticated, quesController.getLikes)
    app.get('/askit/question', quesController.getAllQuestions);
    app.get('/askit/question/:id', quesController.getQuestion);
    app.delete('/askit/question/deleteQuestion/:id', isUserAuthenticated, quesController.deleteQuestion);
}