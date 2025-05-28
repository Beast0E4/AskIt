const likes = require('../controller/likes.controller');
const { isUserAuthenticated } = require('../validators/auth.validator');

module.exports = function(app) {
    app.post('/like', isUserAuthenticated, likes.like);
    app.post('/unLike', isUserAuthenticated, likes.unLike);
}