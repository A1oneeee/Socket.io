/* BIBLIO */
var mongoose = require('mongoose');
var express = require('express');
var app = express();
var server = require('http').createServer(app);

/* REDIRECT THE SERVER RESSOURCES TO THE DIRECTORY SERVER */
app.use(express.static(__dirname));

/* CREATE SERVER */
server.listen(1337, () => {
    console.log('Server started at port: 1337');
});


// IO
var io = require('socket.io')(server);

io.sockets.on('connection', function(socket){
    console.log("Nouvelle utilisateur");
});