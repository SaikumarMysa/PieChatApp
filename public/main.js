const socket = io();
const clientsTotal = document.getElementById('client-total')
const username = prompt('Enter your name to join chat!')
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input').value = username;
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input')
const messageTone = new Audio('/happy-pop.mp3')
messageContainer.innerHTML = '';

socket.emit('new-user-joined',username);

// Listener for user-joined the chat
socket.on('new-user-joined',username =>{
    append(`${username} joined the chat`, 'right')
})

// Listener for user-left the chat
socket.on('user-left',uname => {
    append(`${uname} left the chat`, 'left')
})

const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add('position');
    messageContainer.append(messageElement)
};

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
})

socket.on('clients-total',(data)=>{
    clientsTotal.innerText = `Users Online: ${data}`  
})

function sendMessage(){
    if(messageInput.value=='') return
    const data = {
        name: nameInput,
        message: messageInput.value,
        dateTime: new Date(),
    }
    socket.emit('message',data)
    addMessageToUI(true,data);
    messageInput.value = ''
}

socket.on('chat-message',(data)=>{
    messageTone.play();
    //console.log(data);
    addMessageToUI(false,data);
})

function addMessageToUI(isOwnMessage, data) {
    clearFeedback()
    const element = 
        `<li class="${isOwnMessage ? "message-right" : "message-left"}">
            <p class="message">
              ${data.message}
              <span>${data.name}  ${moment(data.dateTime).fromNow()}</span>
            </p>
          </li>`  
    messageContainer.innerHTML +=element;
    scrollToBottom();    
}

//function for Automatic-scrolldown
function scrollToBottom(){
messageContainer.scrollTo(0,messageContainer.scrollHeight);
}

//Event-listeners:

//if someone points on message input field
messageInput.addEventListener('focus',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameInput} is typing a message...`
    })
})

//if someone is typing/ pressing keys
messageInput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameInput} is typing a message...`
    })
})

messageInput.addEventListener('blur',(e)=>{
    socket.emit('feedback',{
        feedback:``
    })
})

socket.on('feedback',(data)=>{
    clearFeedback()
    const element = `<li class="message-feedback">
                <p class="feedback" id="feedback">${data.feedback}</p>
            </li>`
    messageContainer.innerHTML+=element;
})

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element=>{
        element.parentNode.removeChild(element)
    })
}



  