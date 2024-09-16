const { isUserAuthenticated } = require("../validators/auth.validator")
const solutionController = require('../controller/solution.controller')
const upload = require('../config/multer.config');

module.exports = function(app) {
    app.post('/askit/solution/submit', isUserAuthenticated, upload.single('image'),solutionController.createSolution);
    app.get('/askit/solutionByQuestion/:id', solutionController.getSolutionByQuestion);
    app.get('/askit/likedSolutions/:id', isUserAuthenticated, solutionController.getLikes)
    app.get('/askit/solution/:id', solutionController.getSolution);
    app.get('/askit/solutionByUser/:id', solutionController.getSolutionByUser);
    app.patch('/askit/solution/updateSolution/:id', isUserAuthenticated, solutionController.updateSolution);
    app.delete('/askit/solution/deleteSolution/:id', isUserAuthenticated, solutionController.deleteSolution);
    app.patch('/askit/solution/verifySolution/:id', isUserAuthenticated, solutionController.verifySolution);
}