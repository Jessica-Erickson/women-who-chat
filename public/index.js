const url = 'wss://women-who-chat.herokuapp.com';
// const url = 'ws://localhost:8080';
const connection = new WebSocket(url);

connection.onmessage = e => {
  appendMessage(e.data);
}

const appendMessage = (message) => {
  const messageList = document.querySelector('ul');
  messageList.innerHTML += `<li>${message}</li>`;
  messageList.scrollTop = messageList.scrollHeight;
}

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.querySelector('#message');

  if (input.value.length > 0) {
    connection.send(input.value);
    input.value = '';
  }
});