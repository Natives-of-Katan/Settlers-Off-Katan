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

//const game = require('./client/src/Components/gameLogic.js')
//const board = require('./client/src/Components/GameBoard.js');

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

    //user creates lobby, emit back the matchID and the player name
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

    //player requests to join lobby using match ID, their socketID and player name is added to the arrays of the matching game object in gamesList array
    socket.on('join', (requestObj) => {
        socketsToEmit = [];
        playersToEmit = [];
        let validated = false;
        for(var i = 0; i < gamesList.length; i++) {
            if(gamesList[i].matchID == requestObj.matchID) {
                gamesList[i].socketIDs.push(socket.id);
                socketsToEmit = gamesList[i].socketIDs;
                gamesList[i].players.push(requestObj.name)
                playersToEmit = gamesList[i].players;
                validated = true;
                socket.emit('code-validated');
                break;
            }
        }
        if(!validated) {
            socket.emit('invalid-code');
            return;
        }

        socketsToEmit.forEach(socketID => {
            socketServer.to(socketID).emit('player-joined',{
                matchID: requestObj.matchID,
                players: playersToEmit
            });
        })
        console.log('player joined lobby for match %s', requestObj.matchID);
    })

    //once at least four players joined, players can start game, emit back a confirmation to start game
    socket.on('start-game', (matchID) => {
        console.log("start game for match %s", matchID);
            for(var i = 0; i < gamesList.length; i++) {
                if(gamesList[i].matchID == matchID) {
                    gamesList[i].socketIDs.forEach(socketID => {
                        socketServer.to(socketID).emit('confirm-start');
                        console.log('game started for match %s', matchID);
                    });
                }
            }
        })

    socket.on('initial-state-send', (initialState) => {
        const matchID = initialState.matchID;
        gamesList.forEach(game => {
        if(game.matchID == matchID)
            game.socketIDs.forEach(socketID => {
                socketServer.to(socketID).emit('initial-state-receive', {initialState});
                console.log('initial state sent for match %d', matchID);
            })
        })
    })

    socket.on('updated-state', (gameState) => {
        console.log(gameState);
        console.log(gameState.ctx);
       const matchID = gameState.matchID;
       gamesList.forEach(game => {
        if(game.matchID == matchID)
            game.socketIDs.forEach(socketID => {
                socketServer.to(socketID).emit('board-update', gameState);
                console.log('game state updated for match %d', matchID);
            })
       })
    })

    socket.on('turn-end', (gameState) => {
        console.log(gameState);
        console.log(gameState.ctx);
       const matchID = gameState.matchID;
       gamesList.forEach(game => {
        if(game.matchID == matchID)
            game.socketIDs.forEach(socketID => {
                socketServer.to(socketID).emit('ctx-update', gameState);
                console.log('next turn on match %d', matchID);
            })
       })
    })
  });

 

module.exports = {port, session};