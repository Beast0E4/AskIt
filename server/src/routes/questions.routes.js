const { isUserAuthenticated } = require("../validators/auth.validator")
const quesController = require('../controller/ques.controller')
const upload = require('../config/multer.config');

module.exports = function(app) {
    app.post('/question', isUserAuthenticated, upload.single('image'), quesController.createQuestion);
    app.get('/likedQuestions/:id', isUserAuthenticated, quesController.getLikes)
    app.get('/question', quesController.getAllQuestions);
    app.get('/question/:id', quesController.getQuestion);
    app.delete('/question/deleteQuestion/:id', isUserAuthenticated, quesController.deleteQuestion);
    app.patch('/question/votes/:id', isUserAuthenticated, quesController.vote)
}