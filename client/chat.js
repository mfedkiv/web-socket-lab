const chat = document.querySelector('#chat');
const registrationForm = document.querySelector('#registration_form');
const sendButton = document.querySelector('#send_button');
const messagesContainer = document.querySelector('#messages_container');
const inputBox = document.querySelector('#inputBox');
const submitButton = document.querySelector('#form_button');
let userName = 'Anon';

let socket = new WebSocket('ws://localhost:8080');

submitButton.onclick = function () {
    let input = document.querySelector('#name_input');
    userName = input.value;
    registrationForm.style.display = 'none';
    chat.style.display = 'block';
}

sendButton.onclick = function() {
    let now = new Date();
    let hours = now.getHours().toString().length < 2 ? `0${now.getHours()}` : now.getHours();
    let minutes = now.getMinutes().toString().length < 2 ? `0${now.getMinutes()}` : now.getMinutes();
    let data = {
        message: inputBox.value,
        userName: userName,
        sendTime: `${hours}:${minutes}`
    };

    socket.send(JSON.stringify(data));
    showMessage(data);
};

inputBox.addEventListener('keyup',(event) => {
    let enterNumberOnKeyboard = 13;
    if (event.keyCode === enterNumberOnKeyboard) {
        event.preventDefault();
        sendButton.click();
    }
});

inputBox.addEventListener('input',(event) => {
    sendButton.disabled = !event.target.value;
});

socket.onmessage = ({ data }) => showUsersMessage(data);


function showMessage(data) {
    createMessageBox(data, 'message_box_right');
    messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
    inputBox.value = '';
    sendButton.disabled = true;
}

function showUsersMessage(data) {
    data = JSON.parse(data);
    createMessageBox(data, 'message_box_left');
}

function createMessageBox(data, className) {
    let messageBox = document.createElement('div');
    let text = document.createElement('p');
    let sendTime = document.createElement('span');
    let userName = document.createElement('span');
    messageBox.classList.add('message_box', className);
    text.className = 'message';
    sendTime.className = 'time';
    userName.className = 'user_name';

    sendTime.textContent = data.sendTime;
    text.textContent = data.message;
    userName.textContent = data.userName;

    messageBox.appendChild(userName);
    messageBox.appendChild(text);
    messageBox.appendChild(sendTime);
    messagesContainer.appendChild(messageBox)
}
