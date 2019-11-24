const express = require('express');
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');
const passport = require("passport");
const swaggerUi = require('swagger-ui-express');
const BearerStrategy = require("passport-http-bearer").Strategy;
const setModels = require('./models/setModels');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then( () => console.log('Connected to MongoDB') )
    .catch( (err) => console.log(err) );
setModels();

const AuthService = require('./services/AuthService');

app.use(cors());
app.use(express.json());
app.use(swaggerUi.serve);
passport.use( new BearerStrategy(AuthService.verifyToken) );
app.use('/api', require('./routes/AuthRouter').getRouter());
app.use('/api', require('./routes/UserRouter').getRouter());
app.use('/api', require('./routes/ProductRouter').getRouter());
app.use('/api', require('./routes/ImageRouter').getRouter());
app.use(require('./routes/SwaggerRouter').getRouter());

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server started. PORT : ${port}`)
});
