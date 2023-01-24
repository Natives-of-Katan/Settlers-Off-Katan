const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

var corsOptions = {
    origin: '*', 
    optionsSuccessStatus: 200
}
const port = process.env.PORT || 8080;
app.use(express.static('./tech-demo-client/build'));
const db = "mongodb+srv://Natives-of-Katan:COSC481@cluster0.lzewhnq.mongodb.net/test";  //database URI


//connects to database
mongoose.connect(db).then(con => {
    console.log('connected to MongoDb!');
});

//tells the server to use body-parser
app.use(bodyParser.urlencoded({ limit : '10mb', extended: true}));
app.use(bodyParser.json());
app.use(cors(corsOptions));

//import the routes folder for route handling
const routes = require('./routes/routes');
app.use('/', routes);

//spin up the server
app.listen(port, () => {
    console.log('Server listening on ' + port);
})

module.exports = port;