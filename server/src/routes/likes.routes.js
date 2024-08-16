const likes = require('../controller/likes.controller');
const { isUserAuthenticated } = require('../validators/auth.validator');

module.exports = function(app) {
    app.get('/askit/getLikes', isUserAuthenticated, likes.getLikes)
    app.post('/askit/like', isUserAuthenticated, likes.like);
    app.post('/askit/unLike', isUserAuthenticated, likes.unLike);
}