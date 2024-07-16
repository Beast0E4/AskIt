const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./src/utils/errorHandler');
const connectToDb = require('./src/config/db.config');
const authRoutes = require('./src/routes/auth.routes');
const { PORT } = require('./src/config/server.config');
const userRoutes = require('./src/routes/user.routes');
const questionsRoutes = require('./src/routes/questions.routes');
const solutionsRoutes = require('./src/routes/solutions.routes');

const app = express();

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, x-access-token");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());

authRoutes(app);
userRoutes(app);
questionsRoutes(app);
solutionsRoutes(app);

app.use(errorHandler);

app.listen(PORT, async () => {
    console.log(`Server is up at port ${PORT}`);
    await connectToDb();
    console.log('Successfully connected to the db');
})