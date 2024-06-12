const socket = io();
const clientsTotal = document.getElementById('client-total')

const messageContainer = document.getElementById('message-container');
console.log('messageContainer'+messageContainer)
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input')

const messageTone = new Audio('/happy-pop.mp3')

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
})

socket.on('client-total',(data)=>{
    clientsTotal.innerText = `Users Online: ${data}`  
})

function sendMessage(){
    if(messageInput.value=='') return
    //console.log(messageInput.value)
    const data = {
        name: nameInput.value,
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
    //here this message is not our own message its a incoming mesg to other user
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
        feedback:`${nameInput.value} is typing a message...`
    })
})
//if someone is typing/ pressing keys
messageInput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameInput.value} is typing a message...`
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



  