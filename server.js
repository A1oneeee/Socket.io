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

app.get('', function(req, res) {
    User.find()
        .then((users) => {
            res.render('index.ejs', {users: users });
        })
        .catch();
});

app.use(function(req, res, next) {
    res.setHeader('Content-type', 'text/html');
    res.status(404).send('Page introuvable');
})


/* LISTEN SERVER ON PORT 1337 */
server.listen(1337, () => {
    console.log('Server started at port: 1337 ...');
});


/* IO
 * Events that will be use by the SOCKET
 */
var io = require('socket.io')(server);
var connectedUsers = [];

io.sockets.on('connection', function(socket){

    socket.on('pseudo', (pseudo) => {

        User.findOne({ pseudo: pseudo })
        .then(
            (user) => { 
                if(!user) {
                    var user = new User();
                    user.pseudo = pseudo;
                    user.save();

                    socket.broadcast.emit('newUserInDb', pseudo);
                }
                socket.pseudo = pseudo;
                socket.broadcast.emit('newUser', pseudo);
                
                connectedUsers.push(socket);
                
                Chat.find( {receiver: 'all'} )
                .then( messages => {
                    socket.emit('oldMessages', messages);
                })
                .catch( (err) => {
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

    socket.on('oldWhispers', (pseudo) => {
        Chat.find({ receiver: pseudo })
        .limit(3)
        .then( (messages) => {
            socket.emit('oldWhispers', messages);
        })

        .catch()
        ;
    })

    socket.on('newMessage', (message, receiver) => {

        if(receiver === "all"){
            var chat = new Chat();
            chat.content = message;
            chat.sender = socket.pseudo;
            chat.receiver = "all";
            chat.save();
    
            socket.broadcast.emit('newMessageAll', {message: message, pseudo: socket.pseudo});
        } else {

            User.findOne({ pseudo: receiver })
                .then( (user) => {
                    if(!user){
                        return false;
                    } else {
                        socketReceiver = connectedUsers.find( socket => socket.pseudo === user.pseudo );
            
                        if(socketReceiver){
                            socketReceiver.emit('whisper', { sender: socket.pseudo, message: message });
                        }
            
                        var chat = new Chat();
                        chat.content = message;
                        chat.sender = socket.pseudo;
                        chat.receiver = receiver;
                        chat.save();
                    }
                })
                .catch();
        }
        
    });

    socket.on('writting', (pseudo) => {
        socket.broadcast.emit('writting', pseudo);
    });

    socket.on('notWritting', () => {
        socket.broadcast.emit('notWritting');
    });

    socket.on('disconnect', () => {
        var index = connectedUsers.indexOf(socket);
        if(index > -1){
            connectedUsers.splice(index, 1);
        }

        socket.broadcast.emit('quitUser', socket.pseudo);
    });
});