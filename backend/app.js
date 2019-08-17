const express = require('express');
const mangoose = require('mongoose');
const cors = require('cors');

const routes = require('./src/routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
    const { user } = socket.handshake.query;
    connectedUsers[user] = socket.id;
});

mangoose.connect('mongodb://kamino.mongodb.umbler.com:36840/medpp?retryWrites=true&w=majority', {useNewUrlParser: true})

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log('Umbler listening on port %s', port);
});