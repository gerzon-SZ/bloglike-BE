const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/error');
const post = require('./routes/post');
const user = require('./routes/user');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
require('dotenv').config();

connectDB();

const app = express(); 

app.use(cookieParser());

app.use(mongoSanitize());

app.use(cors());

app.use(bodyParser.json())

app.use(logger);

app.use('/api/v1/post', post);
app.use('/api/v1/user', user);

app.use(errorHandler);

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`)
})

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error ${err.message}`);
    server.close(() => process.exit(1))
})
