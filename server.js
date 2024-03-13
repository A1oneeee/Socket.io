/* BIBLIO */
var mongoose = require('mongoose');
var express = require('express');
var app = express();
var server = require('http').createServer(app);

/* REDIRECT THE SERVER RESSOURCES TO THE DIRECTORY SERVER */
app.use(express.static(__dirname));

/* LISTEN SERVER ON PORT 1337 */
server.listen(1337, () => {
    console.log('Server started at port: 1337 ...');
});


/* IO
 * Events that will be use by the SOCKET
 */
var io = require('socket.io')(server);

io.sockets.on('connection', function(socket){
    socket.on('pseudo', (pseudo) => {
        socket.pseudo = pseudo;
        socket.broadcast.emit('newUser', pseudo);
    });
    socket.on('newMessage', (message) => {
        socket.broadcast.emit('newMessageAll', {message: message, pseudo: socket.pseudo});
    });

    socket.on('writting', (pseudo) => {
        socket.broadcast.emit('writting', pseudo);
    });

    socket.on('notWritting', () => {
        socket.broadcast.emit('notWritting');
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('quitUser', socket.pseudo);
    });
});