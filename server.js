//server.js
const express= require('express');

const path= require('path');
const app= express();
const http= require('http');
const server= http.createServer(app);
const socketio= require('socket.io');
const io= socketio(server);
const PORT= process.env.PORT || 5000;
const dotenv= require('dotenv');
dotenv.config();

app.use(express.static(path.join(__dirname, 'public')));
const users = []; // Store usernames

io.on('connection', socket=>{
    socket.emit('message', "Welcome to ChatApp");
    socket.broadcast.emit('message', "New user entered the chat");

    socket.on('newUser', (username)=>{
        users.push({ id: socket.id, username }); // Save socket.id to track users individually

        // 1. Send the full user list only to the new user
        socket.emit('userList', users.map(user => user.username));

        // 2. Tell all other users about the new user
        socket.broadcast.emit('add_user_to_usersList', username);
    })
    
    socket.on('chatMsg', (msg)=>{
        io.emit('message', msg);
    })

    socket.on('disconnect', ()=>{
        const user = users.find(u => u.id === socket.id);
        if (user) {
            users.splice(users.indexOf(user), 1); //remove one user from index==> users.indexOf(user)
            io.emit('remove_user_from_usersList', user.username); // tell everyone to remove this user
        }

        socket.broadcast.emit('message', `A user left the chat`);
    });
});


server.listen(PORT, ()=>{
    console.log(`App listening to port ${PORT}`);
})