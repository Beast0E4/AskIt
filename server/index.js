const express = require('express');
const bodyParser = require('body-parser');
const connectToDb = require('./src/config/db.config');
const authRoutes = require('./src/routes/auth.routes');
const { PORT } = require('./src/config/server.config');
const userRoutes = require('./src/routes/user.routes');
const questionsRoutes = require('./src/routes/questions.routes');
const solutionsRoutes = require('./src/routes/solutions.routes');
const cors = require('cors');
const likesRoutes = require('./src/routes/likes.routes');
const configCloudinary = require('./src/config/cloudinary.config');
const path = require('path');

const app = express();

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, x-access-token");
    next();
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());

app.use('uploads', express.static(path.join(__dirname, "public/assets")));

authRoutes(app);
userRoutes(app);
questionsRoutes(app);
solutionsRoutes(app);
likesRoutes(app);

app.listen(PORT, async () => {
    console.log(`Server is up at port ${PORT}`);
    await connectToDb();
    console.log('Successfully connected to the db');
})