/* BIBLIO */
var mongoose = require('mongoose');
var express = require('express');
var app = express();
var server = require('http').createServer(app);

const ObjectId = mongoose.Types.ObjectId;

mongoose.connect('mongodb://localhost/ChatSocket')
    .then((success) => console.log('MongoDB connected ...'))
    .catch((err) => console.log(err.message));;

require('./models/chat.model');
require('./models/room.model');
require('./models/user.model');
var User = mongoose.model('user');
var Room = mongoose.model('room');
var Chat = mongoose.model('chat');

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

        User.findOne({ pseudo: pseudo })
        .then(
            (user) => { 
                if(!user) {
                    var user = new User();
                    user.pseudo = pseudo;
                    user.save();
                }
                socket.pseudo = pseudo;
                socket.broadcast.emit('newUser', pseudo);
                
                
                Chat.find()
                .then( messages => {
                    socket.emit('oldMessages', messages);
                })
                .catch( err => {
                    console.log(err);
                });
            }
        )
        .catch (
            (err) => {
                console.log(err.message);
            }
        );
    });

    socket.on('newMessage', (message) => {

        var chat = new Chat();
        chat.content = message;
        chat.sender = socket.pseudo;
        chat.save();

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