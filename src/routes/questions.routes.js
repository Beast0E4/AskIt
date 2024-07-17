const { isUserAuthenticated } = require("../validators/auth.validator")
const quesController = require('../controller/ques.controller')

module.exports = function(app) {
    app.post('/askit/question/submit', isUserAuthenticated, quesController.createQuestion);
    app.patch('/askit/question/updateQuestion/:id', isUserAuthenticated, quesController.updateQuestion);
}