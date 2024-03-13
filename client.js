var socket = io.connect('http://localhost:1337');

while(!pseudo){
    var pseudo = prompt('Quel est ton pseudo ?');
}

socket.emit('pseudo', pseudo);
document.title = pseudo + ' - Notre chat';


// EVENTS

socket.on('newUser', (pseudo) =>{
    createElementFunction('newUser', pseudo);
});

socket.on('quitUser', (pseudo) => {
    createElementFunction('quitUser', pseudo);
});


// FUNCTIONS

function createElementFunction(element, content){

    const newElement = document.createElement('div');

    switch(element){

        case 'newUser':
            newElement.classList.add(element, 'message');
            newElement.textContent = content + ' a rejoint le chat.';
            document.getElementById('msgContainer').appendChild(newElement);
            break;

        case 'quitUser':
            newElement.classList.add(element, 'message');
            newElement.textContent = content + ' a quitté le chat.';
            document.getElementById('msgContainer').appendChild(newElement);
            break;

    }

};