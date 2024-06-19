const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT||4000;
const server = app.listen(PORT, ()=>{
    console.log(`Listening to server on port ${PORT}`);
})
const io = require('socket.io')(server);
app.use(express.static(path.join(__dirname,'public')));
//To store socket id and name
let socketsConnected = new Map();

io.on('connection',onConnected)

function onConnected(socket){
    console.log('User Connected',socket.id);

    socket.on('new-user-joined',username =>{
        console.log('New User: '+username);
        //setting up socketid , username in socketsConnected
        socketsConnected.set(socket.id, username);
        socket.broadcast.emit('new-user-joined',username)
        io.emit('clients-total',socketsConnected.size)
    });

    socket.on('disconnect',() => {
        const uname = socketsConnected.get(socket.id);
        if(uname){
            console.log('User Disconnected: '+uname);
            //notifying others that user has left
            socket.broadcast.emit('user-left',uname);

            socketsConnected.delete(socket.id);
            io.emit('clients-total',socketsConnected.size)
        }
    })

socket.on('message',(data)=>{
    //console.log(data);
    socket.broadcast.emit('chat-message',data)
})

socket.on('feedback',(data)=>{
    socket.broadcast.emit('feedback',data)
})
}


