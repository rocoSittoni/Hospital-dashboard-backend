require('dotenv').config();
const express = require('express');
const cors = require('cors')
const { dbConnection } = require('./database/config');

// create express server
const app = express();

//configure cors
app.use(cors()); 

// database
dbConnection();

console.log(process.env);
// mongodb atlas user: mean_user
// password: 2Pk2lL2xDgbCFiLj


// routes
app.get( '/', (req, res) => {

    res.json({
        ok: true,
        msg: 'hello world'
    })

});

app.listen( process.env.PORT, () => {
    console.log('server running on port ' + process.env.PORT);
});