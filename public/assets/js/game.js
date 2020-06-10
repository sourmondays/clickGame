const socket = io();

const startEl = document.querySelector('#start');
const gameWrapperEl = document.querySelector('#game-wrapper');
const playernameForm = document.querySelector('#playername-form');

let username = null;

const updateOnlinePlayers = (users) => {
	document.querySelector('#online-players').innerHTML = users.map(user => `<li class="user">${user}</li>`).join("");
}

// get username from form and emit `register-user`-event to server
playernameForm.addEventListener('submit', e => {
	e.preventDefault();

	username = document.querySelector('#username').value;
	socket.emit('register-user', username, (status) => {
		console.log("Server acknowledged the registration", status);

		if (status.joinChat) {
			startEl.classList.add('hide');
			gameWrapperEl.classList.remove('hide');

			updateOnlinePlayers(status.onlineUsers);
		}
	});

});

socket.on('reconnect', () => {
	if (username) {
		socket.emit('register-user', username, () => {
			console.log("The server acknowledged our reconnect.");
		});
	}
});

socket.on('online-players', (users) => {
	updateOnlinePlayers(users);
});
