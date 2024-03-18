var socket = io.connect('http://localhost:1337');

while(!pseudo){
    var pseudo = prompt('Quel est ton pseudo ?');
}

socket.emit('pseudo', pseudo);
socket.emit('oldWhispers', pseudo);
document.title = pseudo + ' - Notre chat';

document.getElementById('chartForm').addEventListener('submit', (e) => {

    e.preventDefault();

    const textInput = document.getElementById('msgInput').value;
    document.getElementById('msgInput').value = '';

    const receiver = document.getElementById('receiverInput').value;

    if(textInput.length > 0){

        socket.emit('newMessage', textInput, receiver);
        if(receiver === "all"){
            createElementFunction('newMessageMe', textInput);
        }

    } else {
        return false;
    }

});


// EVENTS

socket.on('newUser', (pseudo) =>{
    createElementFunction('newUser', pseudo);
});

socket.on('newUserInDb', (pseudo) => {
    let newOption = document.createElement('option');
    newOption.textContent = pseudo;
    newOption.value = pseudo;
    document.getElementById('receiverInput').appendChild(newOption);
});

socket.on('oldWhispers', (messages) => {
    messages.forEach(message => {
        createElementFunction('oldWhispers', message);
    });
});

socket.on('newMessageMe', (content) => {
    createElementFunction('newMessageAll', content);
});

socket.on('newMessageAll', (content) => {
    createElementFunction('newMessageAll', content);
});

socket.on('whisper', (content) => {
    createElementFunction('whisper', content);
});

socket.on('oldMessages', (messages) => {
    messages.forEach(message => {
        if(message.sender === pseudo){
            createElementFunction('oldMessagesMe', message);
        } else {
            createElementFunction('oldMessages', message);
        }
    });
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
};

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

        case 'oldMessages':
            newElement.classList.add(element, 'message');
            newElement.innerHTML = content.sender + ': ' + content.content;
            document.getElementById('msgContainer').appendChild(newElement);
            break;
        
        case 'oldMessagesMe':
            newElement.classList.add('newMessageMe', 'message');
            newElement.innerHTML = content.sender + ': ' + content.content;
            document.getElementById('msgContainer').appendChild(newElement);
            break; 

        case 'whisper':
            newElement.classList.add(element, 'message');
            newElement.innerHTML = content.sender + ' vous a chuchoté: ' + content.message;
            document.getElementById('msgContainer').appendChild(newElement);
            break;

        case 'oldWhispers':
            newElement.classList.add(element, 'message');
            newElement.innerHTML = content.sender + ' vous a chuchoté: ' + content.content;
            document.getElementById('msgContainer').appendChild(newElement);
            break;
    }

};