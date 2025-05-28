const { isUserAuthenticated } = require("../validators/auth.validator")
const solutionController = require('../controller/solution.controller')
const upload = require('../config/multer.config');

module.exports = function(app) {
    app.post('/solution/submit', isUserAuthenticated, upload.single('image'),solutionController.createSolution);
    app.get('/solutionByQuestion/:id', solutionController.getSolutionByQuestion);
    app.get('/likedSolutions/:id', isUserAuthenticated, solutionController.getLikes)
    app.get('/solution/:id', solutionController.getSolution);
    app.get('/solutionByUser/:id', solutionController.getSolutionByUser);
    app.patch('/solution/updateSolution/:id', isUserAuthenticated, solutionController.updateSolution);
    app.delete('/solution/deleteSolution/:id', isUserAuthenticated, solutionController.deleteSolution);
    app.patch('/solution/verifySolution/:id', isUserAuthenticated, solutionController.verifySolution);
}