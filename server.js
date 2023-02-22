const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
//var cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');


var corsOptions = {
    origin: '*', 
    optionsSuccessStatus: 200
}
const port = process.env.PORT || 8080;
app.use(express.static(path.join(__dirname,'client', 'build')));

//tells server to use body-parser
app.use(bodyParser.urlencoded({ limit : '10mb', extended: true}));
app.use(bodyParser.json());
app.use(cors(corsOptions));

//session setup
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret:"secret",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

//database connection
const db = "mongodb+srv://Natives-of-Katan:COSC481@cluster0.lzewhnq.mongodb.net/NativesOffKatan";  //database URI
mongoose.connect(db).then(con => {
    console.log('connected to MongoDb!');
});

//import the routes folder for route handling
const routes = require('./routes/routes');
app.use('/', routes);

//spin up the server
app.listen(port, () => {
    console.log('Server listening on ' + port);
})

module.exports = {port, session};