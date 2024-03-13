/* BIBLIO */
var mongoose = require('mongoose');
var express = require('express');
var app = express();
var server = require('http').createServer(app);

/* REDIRECT THE SERVER RESSOURCES TO THE DIRECTORY SERVER */
app.use(express.static(__dirname));

/* LISTEN SERVER ON PORT 1337 */
server.listen(1337, () => {
    console.log('### Server started at port: 1337 ...');
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
    socket.on('disconnect', () => {

        socket.broadcast.emit('quitUser', socket.pseudo);

    });
});