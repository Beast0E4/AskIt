const { isUserAuthenticated } = require("../validators/auth.validator")
const solutionController = require('../controller/solution.controller')

module.exports = function(app) {
    app.post('/askit/solution/submit', isUserAuthenticated, solutionController.createSolution);
    app.patch('/askit/solution/updateSolution/:id', isUserAuthenticated, solutionController.updateSolution);
}