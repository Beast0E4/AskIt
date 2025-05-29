const express = require('express');
const bodyParser = require('body-parser');
const connectToDb = require('./src/config/db.config');
const authRoutes = require('./src/routes/auth.routes');
const { PORT } = require('./src/config/server.config');
const userRoutes = require('./src/routes/user.routes');
const questionsRoutes = require('./src/routes/questions.routes');
const solutionsRoutes = require('./src/routes/solutions.routes');
const commentRoutes = require('./src/routes/comments.routes')
const cors = require('cors');
const likesRoutes = require('./src/routes/likes.routes');
const configCloudinary = require('./src/config/cloudinary.config');
const path = require('path');
const http = require ('http');
const setupSocket = require("../server/socket/socket");
const notificationRoutes = require('./src/routes/notification.routes');

const app = express();
const server = http.createServer(app);

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, x-access-token");
    next();
});

app.use(cors({
    origin: 'http://localhost:5173' // Your frontend's origin
}));

// Handle preflight requests
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());

app.use('uploads', express.static(path.join(__dirname, "public/assets")));

authRoutes(app);
userRoutes(app);
questionsRoutes(app);
solutionsRoutes(app);
likesRoutes(app);
commentRoutes(app);
notificationRoutes (app);

setupSocket(server);

server.listen(PORT, async () => {
    console.log(`Server is up at port ${PORT}`);
    await connectToDb();
    console.log('Successfully connected to the db');
})