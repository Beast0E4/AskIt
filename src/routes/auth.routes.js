const authController = require('../controller/auth.controller')

module.exports = function(app) {
    app.post('/unn/signup', authController.signup);
    app.post('/unn/signin', authController.signin);
}