//////////////////////////
//
//modules requis par l'app
//
//////////////////////////
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet')

//////////////////////////
//
//declaration des variables
//
//////////////////////////

const app = express();
require('dotenv').config();

//////////////////////////
//
//utilisation des modules
//
//////////////////////////

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Serve static files from the React app

//app.use('/assets', express.static('public'))
app.use(express.static('client/build'));

//////////////////////////
//
//Déclaration des routes
//
//////////////////////////
require('./routes')(app);


const PORT = process.env.PORT || 5000
app.listen(PORT);
console.log("Server listening on port", PORT);


module.exports = app;















