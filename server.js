const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

server.listen(process.env.PORT || 8080);

wss.on('connection', (ws) => {
  ws.userNum = 0;

  while (app.locals.defaultUsers[ws.userNum].inUse) {
    if (ws.userNum < 19) {
      ws.userNum += 1;
    } else {
      return ws.send('This chat room is full.');
    }
  }

  app.locals.defaultUsers[ws.userNum].inUse = true;

  app.locals.messages.forEach(message => {
    ws.send(message);
  });

  app.locals.messages.push(`A ${app.locals.defaultUsers[ws.userNum].name} has joined the chat.`);

  wss.broadcast(`A ${app.locals.defaultUsers[ws.userNum].name} has joined the chat.`);


  ws.on('message', (message) => {
    app.locals.messages.push(`${app.locals.defaultUsers[ws.userNum].name} says: ${message}`);

    wss.broadcast(`${app.locals.defaultUsers[ws.userNum].name} says: ${message}`);
  });

  ws.on('close', () => {
    app.locals.defaultUsers[ws.userNum].inUse = false;

    wss.broadcast(`A ${app.locals.defaultUsers[ws.userNum].name} has left the chat.`);

    app.locals.messages.push(`A ${app.locals.defaultUsers[ws.userNum].name} has left the chat.`);
  });
});

wss.broadcast = (data) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

app.locals.messages = [];
app.locals.defaultUsers = [
  {name: 'Red Panda', inUse: false},
  {name: 'Ocelot', inUse: false},
  {name: 'Kangaroo', inUse: false},
  {name: 'Walrus', inUse: false},
  {name: 'Hedgehog', inUse: false},
  {name: 'Cockatoo', inUse: false},
  {name: 'Giraffe', inUse: false},
  {name: 'Aligator', inUse: false},
  {name: 'Otter', inUse: false},
  {name: 'Elephant', inUse: false},
  {name: 'Axolotl', inUse: false},
  {name: 'Cheetah', inUse: false},
  {name: 'Platypus', inUse: false},
  {name: 'Lemur', inUse: false},
  {name: 'Finch', inUse: false},
  {name: 'Kakapo', inUse: false},
  {name: 'Python', inUse: false},
  {name: 'Komodo Dragon', inUse: false},
  {name: 'Chicken', inUse: false},
  {name: 'Moose', inUse: false}
];

app.use(express.static('public'));
