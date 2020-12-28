require('dotenv').config();

const express = require('express');
const cors = require('cors')

const { dbConnection } = require('./database/config');

// create express server
const app = express();

//configure cors
app.use(cors()); 

// reading and parse of the body
app.use(express.json());

// database
dbConnection();

// mongodb atlas user: mean_user
// password: 2Pk2lL2xDgbCFiLj

// routes
app.use( '/api/users', require('./routes/users'));
app.use( '/api/login', require('./routes/auth'));


app.listen( process.env.PORT, () => {
    console.log('server running on port ' + process.env.PORT);
});