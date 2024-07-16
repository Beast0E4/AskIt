const authController = require('../controller/auth.controller')

module.exports = function(app) {
    app.post('/askit/auth/signup', authController.signup);
    app.post('/askit/auth/signin', authController.signin);
}