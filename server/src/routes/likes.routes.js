const likes = require('../controller/likes.controller')

module.exports = function(app) {
    app.post('/askit/like', likes.like);
    app.post('/askit/unLike', likes.unLike);
}