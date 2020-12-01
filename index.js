const express = require('express');
const session = require('express-session');
var cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 5000

let rooms = 0;

const categoriesController = require("./categories/CategoriesController");
const skinsController = require("./skins/SkinsController");
const usersController = require("./users/UsersController");
const storeController = require("./store/StoreController");
const profileController = require("./profile/ProfileController");
const gameController = require("./game/GameController");

app.set('view engine','ejs');
app.set('trust proxy', 1)

app.use(express.static('public'));
//app.use(session({secret: 'mySecret'}))

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/",categoriesController);
app.use("/",skinsController);
app.use("/",usersController);
app.use("/",storeController);
app.use("/",profileController);
app.use("/",gameController);

app.get("/", (req,res) => {
    res.render("index");
})

io.on('connection', (socket) => {

    // Cria novo jogo e notifica o criador do jogo!
    socket.on('createGame', (data) => {
        socket.join(`room-${++rooms}`);
        socket.emit('newGame', { name: data.name, room: `room-${rooms}` });
        console.log(data.name, rooms);
    });

    // Conectar jogador 2. Erro para sala cheia.
    socket.on('joinGame', function (data) {
        var room = io.nsps['/'].adapter.rooms[data.room];
        console.log(data, room);
        if (room && room.length === 1) {
            socket.join(data.room);
            socket.broadcast.to(data.room).emit('player1', {});
            socket.emit('player2', { name: data.name, room: data.room })
        } else {
            socket.emit('err', { message: 'Sorry, The room is full!' });
        }
    });

    // Handle the turn played by either player and notify the other.
    socket.on('playTurn', (data) => {
        socket.broadcast.to(data.room).emit('turnPlayed', {
            tile: data.tile,
            room: data.room
        });
    });

    // Notify the players about the victor.
    socket.on('gameEnded', (data) => {
        socket.broadcast.to(data.room).emit('gameEnd', data);
        console.log("fim de jogo enviado");
    });
});

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));

