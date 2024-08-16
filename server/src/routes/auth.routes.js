const upload = require('../config/multer.config');
const authController = require('../controller/auth.controller');

module.exports = function(app) {

    app.post('/askit/auth/signup', upload.single('image'), authController.signup);
    app.post('/askit/auth/signin', authController.signin);
}