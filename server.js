const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const socketServer = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
var corsOptions = {
    origin: '*', 
    optionsSuccessStatus: 200
}

let gamesList = [];

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

//start server
server.listen(port, () => {
    console.log('Settlers Off Katan Server listening on port %s \n',port);
})

//socket handlers for lobby creation/game state management  ------------------------------------------------------------------------------------------------------
socketServer.on('connect', (socket) => {
    console.log('A user connected');

    socket.on('create-lobby', (lobbyObject) => {
        console.log('match ID is %s and player name is %s', lobbyObject.matchID, lobbyObject.name)
        let players = [];
        players.push(lobbyObject.name);
        const game = {
            code: lobbyObject.matchID,
            players: players
        }

        let playerSockets = [];
        playerSockets.push(socket.id);
        const storeGame = {
            matchID: lobbyObject.matchID,
            socketIDs: playerSockets,
            players: players
        }

        gamesList.push(storeGame);
        console.log(gamesList);
        socket.emit('lobby-created', (game));
    })

    socket.on('join', (requestObj) => {
        socketsToEmit = [];
        playersToEmit = [];
        for(var i = 0; i < gamesList.length; i++) {
            if(gamesList[i].matchID == requestObj.matchID) {
                gamesList[i].socketIDs.push(socket.id);
                socketsToEmit = gamesList[i].socketIDs;
                gamesList[i].players.push(requestObj.name)
                playersToEmit = gamesList[i].players;
                break;
            }
        }

        socketsToEmit.forEach(socketID => {
            socketServer.to(socketID).emit('player-joined',{
                matchID: requestObj.matchID,
                players: playersToEmit
            });
        })
        console.log('player joined lobby for match %s', requestObj.matchID);
    })
  });

module.exports = {port, session};