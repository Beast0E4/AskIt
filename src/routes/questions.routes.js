const { isUserAuthenticated } = require("../validators/auth.validator")
const quesController = require('../controller/ques.controller')

module.exports = function(app) {
    app.post('/askit/question', isUserAuthenticated, quesController.createQuestion);
    app.get('/askit/question', isUserAuthenticated, quesController.getAllQuestions);
    app.patch('/askit/question/updateQuestion/:id', isUserAuthenticated, quesController.updateQuestion);
    app.delete('/askit/question/deleteQuestion/:id', isUserAuthenticated, quesController.deleteQuestion);
}