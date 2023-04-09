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
const onlineGame = require('./onlineGame');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const User = require('./models/userAccounts');
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
                socket.emit('code-validated', (playersToEmit.length));
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
                        socketServer.to(socketID).emit('confirm-start', gamesList[i]);
                        console.log('game started for match %s', matchID);
                    });
                }
            }
        })

    socket.on('end-turn', ({gameState, matchID}) => {
        const winner = onlineGame.checkVictory(gameState);
        console.log(winner);
        if(winner) {
            console.log('winner!')
            gameState.gameOver = true;
            gameState.winner = gameState.currentPlayer;
            const index = gamesList.findIndex(game => game.matchID === matchID);
            gamesList[index].socketIDs.forEach(socketID => {
                console.log('sent')
                socketServer.to(socketID).emit('game-over', gameState)
            })
            gamesList[index] = {
                matchID: 0,
                socketIDs: [],
                players: []
            }
            return;
        }
        gameState.currentPlayer = (gameState.currentPlayer +1) % gameState.players.length;
        gameState.turn +=1;
        gamesList.forEach(game => {
         if(game.matchID == matchID) {
             game.socketIDs.forEach(socketID => {
                 socketServer.to(socketID).emit('new-turn-update', gameState);
                 console.log('next turn updated for match %d', matchID);
             })}
        })
     })


     socket.on('dice-roll', ({gameState, matchID, seatNum}) => {
        gameState= onlineGame.diceRoll(gameState, seatNum);
        gamesList.forEach(game => {
            if(game.matchID == matchID) {
                game.socketIDs.forEach(socketID => {
                    socketServer.to(socketID).emit('roll-success', gameState);
                    console.log('roll update for match ', matchID);
                })}
        })
    })

    socket.on('winner', async (sessionID) => {
        const opts = {new:true};
        const user = await User.findOneAndUpdate({"sessionID" : sessionID},
        {
        $inc: {
            settlerWins: 1
            }
        },
        opts
    );
    socket.emit('done');
    console.log(user);
    console.log('lol')
    });

});

 

module.exports = {port, session};