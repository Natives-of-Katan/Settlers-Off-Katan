const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const socketServer = require('socket.io')(server, {
    maxHttpBufferSize: 1e8,
    cors: {
      origin: '*',
    }
});
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
const initialize = require('./onlineState');

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
        let sessionIDs = [];
        players.push(lobbyObject.name);
        sessionIDs.push(lobbyObject.sessionID);

        const game = {
            code: lobbyObject.matchID,
            players: players
        }

        let playerSockets = [];
        playerSockets.push(socket.id);
        const storeGame = {
            matchID: lobbyObject.matchID,
            socketIDs: playerSockets,
            players: players,
            sessionIDs: sessionIDs
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

    //server sends initial game state
    socket.on('ready', (matchID) => {
        const index = gamesList.findIndex(game => game.matchID === matchID);
        if(index >= 0 ) {
        const numPlayers = gamesList[index].players.length;
        const gameState = initialize(numPlayers);
        gamesList[index].socketIDs.forEach(socketID => {
                socketServer.to(socketID).emit('initial-state', gameState);
        })
    }
    })


   socket.on('state-change', ({newState, matchID}) => {
        console.log('state change for match %d', matchID);
        const index = gamesList.findIndex(game => game.matchID === matchID);
        gamesList[index].socketIDs.forEach(socketID => {
            if(socketID != socket.id)
                socketServer.to(socketID).emit('state-change', newState);
        })
    })


    socket.on('turn-end', ({newState, matchID}) => {

        newState.currentPlayer = (newState.currentPlayer + 1 ) % newState.players.length;
        newState.turn += 1;

        //find the game, change phase if necessary
        const index = gamesList.findIndex(game => matchID === matchID);
        if(newState.turn == gamesList[index].players.length)
            newState.phase = 'initRound2';
        if(newState.turn == (gamesList[index].players.length * 2))
            newState.phase = 'gameplay';

        gamesList[index].socketIDs.forEach(socketID => {
                    socketServer.to(socketID).emit('state-change', newState)
            })
    })

    socket.on('vertices-update', ({stringifiedVertices, matchID}) => {
        const index = gamesList.findIndex(game => game.matchID === matchID);
        gamesList[index].socketIDs.forEach(socketID => {
            if(socketID != socket.id)
                socketServer.to(socketID).emit('vertices-update', stringifiedVertices);
        })

    });

    socket.on('edge-update', ({stringifiedEdges, matchID}) => {
        const index = gamesList.findIndex(game => game.matchID === matchID);
        gamesList[index].socketIDs.forEach(socketID => {
            if(socketID != socket.id)
                socketServer.to(socketID).emit('edges-update', stringifiedEdges);
        })
    })

    socket.on('winner', async ({matchID, sessionID}) => {
        console.log('winner');
        const opts = {new:true};
        const user = await User.findOneAndUpdate({"sessionID" : sessionID},
        {
        $inc: {
            settlerWins: 1
            }
        },
        opts
    );
    console.log(user);
    });

    socket.on('trade-request', ({tempOutgoing, tempIncoming, matchID, newState}) => {
        console.log('request')
        const tempState = { ...newState };
        const filteredOutgoing = Object.entries(tempOutgoing).reduce((acc, [resource, value]) => {
            if(value > 0) {
                acc[resource] = value;
            }
            return acc;
        }, {});

        const filteredIncoming = Object.entries(tempIncoming).reduce((acc, [resource, value]) => {
            if(value > 0) {
                acc[resource] = value;
            }
            return acc;
        }, {});

        const index = gamesList.findIndex(game => game.matchID === matchID);
        gamesList[index].socketIDs.forEach(socketID => {
            if(socketID != socket.id)
                socketServer.to(socketID).emit('trade-request', filteredOutgoing, filteredIncoming, tempState);
        }) 
    });

    socket.on('decline-trade', ({seatNum, matchID}) => {
        console.log('trade declined in match %s', matchID);
        const index = gamesList.findIndex(game => game.matchID === matchID);
        gamesList[index].socketIDs.forEach(socketID => {
            if(socketID != socket.id)
                socketServer.to(socketID).emit('trade-declined', seatNum);
        })
    })

    socket.on('cancel-trade', ({matchID}) => {
        const index = gamesList.findIndex(game => game.matchID === matchID);
        gamesList[index].socketIDs.forEach(socketID => {
            if(socketID != socket.id)
                socketServer.to(socketID).emit('trade-cancelled');
        })
    })

    socket.on('trade-complete', ({tempState, seatNum, matchID}) => {
        console.log('trade done')
        const newState = { ...tempState };
        newState.tradeInProgress = false;
        const index = gamesList.findIndex(game => game.matchID === matchID);
        gamesList[index].socketIDs.forEach(socketID => {
            if(socketID != socket.id) {
                socketServer.to(socketID).emit('trade-success', newState);
                socketServer.to(socketID).emit('trade-partner', seatNum);
            }
                
        })
    }
    )
});

 

module.exports = {port, session};