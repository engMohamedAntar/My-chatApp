//script.js
const socket= io();//"https://nettle-local-halloumi.glitch.me"

const messagesDiv= document.getElementById('messages');
const usersListDiv= document.getElementById('usersList');
const usersUl = document.getElementById('userListItems');


const username = `User ${Date.now()}`;
//satart

socket.emit('newUser', username);

socket.on('userList', (usernames) => {
    usersUl.innerHTML = ''; // clear old list
    usernames.forEach((username) => {
        const liElement = `<li>${username}</li>`;
        usersUl.insertAdjacentHTML('beforeend', liElement);
        usersListDiv.scrollTop= usersListDiv.scrollHeight;
    });
});

socket.on('add_user_to_usersList', (username) => {
    const liElement = `<li>${username}</li>`;
    usersUl.insertAdjacentHTML('beforeend', liElement);
    usersListDiv.scrollTop= usersListDiv.scrollHeight;
});

socket.on('remove_user_from_usersList', (username) => {
    const userItems = usersUl.querySelectorAll('li');
    userItems.forEach((li) => {
        if (li.textContent.trim() === username.trim()) {
            li.remove();
        }
    });
});



socket.on('message', (msg)=>{
    const msgElement = `<div class="message">
    <p class="username">  ${username}<span class="timestamp">10:31</span></p>
    <p class="message-text">${msg}</p>
    </div>`;
    const parentForm= document.getElementById('messageList');
    parentForm.insertAdjacentHTML("beforeend", msgElement);
    messagesDiv.scrollTop= messagesDiv.scrollHeight;
});


const messagesForm= document.getElementById('messageForm');
messagesForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    const userMsg= document.getElementById('messageInput').value;
    socket.emit('chatMsg', userMsg);
    document.getElementById('messageInput').value='';
    document.getElementById('messageInput').focus();
})