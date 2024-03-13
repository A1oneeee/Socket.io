var socket = io.connect('http://localhost:1337');

while(!pseudo){
    var pseudo = prompt('Quel est ton pseudo ?');
}

socket.emit('pseudo', pseudo);
document.title = pseudo + ' - Notre chat';

document.getElementById('chartForm').addEventListener('submit', (e) => {

    e.preventDefault();

    const textInput = document.getElementById('msgInput').value;
    document.getElementById('msgInput').value = '';

    if(textInput.length > 0){

        socket.emit('newMessage', textInput);
        createElementFunction('newMessageMe', textInput);

    } else {
        return false;
    }

});


// EVENTS

socket.on('newUser', (pseudo) =>{
    createElementFunction('newUser', pseudo);
});

socket.on('newMessageMe', (content) => {
    createElementFunction('newMessageAll', content);
});

socket.on('newMessageAll', (content) => {
    createElementFunction('newMessageAll', content);
});

socket.on('writting', (pseudo) => {
    document.getElementById('isWritting').textContent = pseudo + ' écrit...';
});

socket.on('notWritting', () => {
    document.getElementById('isWritting').textContent = '';
});

socket.on('quitUser', (pseudo) => {
    createElementFunction('quitUser', pseudo);
});


// FUNCTIONS

function writting(element){
    if(element.value.length > 0){
        socket.emit('writting', pseudo);
    }
}

function notWritting(){
    socket.emit('notWritting');
}



function createElementFunction(element, content){

    const newElement = document.createElement('div');

    switch(element){

        case 'newUser':
            newElement.classList.add(element, 'message');
            newElement.textContent = content + ' a rejoint le chat.';
            document.getElementById('msgContainer').appendChild(newElement);
            break;

        case 'newMessageMe':
            newElement.classList.add(element, 'message');
            newElement.innerHTML = pseudo + ': ' + content;
            document.getElementById('msgContainer').appendChild(newElement);
            break;        

        case 'quitUser':
            newElement.classList.add(element, 'message');
            newElement.textContent = content + ' a quitté le chat.';
            document.getElementById('msgContainer').appendChild(newElement);
            break;

        case 'newMessageAll':
            newElement.classList.add(element, 'message');
            newElement.innerHTML = content.pseudo + ': ' + content.message;
            document.getElementById('msgContainer').appendChild(newElement);
            break;
        

    }

};