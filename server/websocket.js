import {WebSocketServer} from "ws";
import gameService from "./services/gameService.js";

export const handleOnline = (change) => {
    plusUsers += change;
    broadcastAmount('connection');
}

let plusUsers = 0;
let streamStatus = 'offline';
let messages = [];

const wss = new WebSocketServer({
    port: 4000
}, () => console.log(`Websocket started on port 4000`))

function heartbeat() {
    this.isAlive = true;
}

wss.on('connection', function connection(ws) {
    console.log('new commit 1')

    ws.isAlive = true;

    ws.on('pong', heartbeat);

    ws.send(JSON.stringify({
        method: 'stream',
        streamStatus: streamStatus
    }))

    ws.on('message', function (message) {
        message = JSON.parse(message);
        console.log('new commit 2')
        switch(message.method) {
            case 'message':
                if(messages.length > 50) {
                    messages = messages.filter(item => item.id > messages[0].id);
                }
                messages.push(message);
                broadcastMessage(message);
                break;
            case 'stream':
                streamStatus = message.streamStatus;
                broadcastMessage(message);
                break;
            case 'connection':
                broadcastAmount('connection');
                break;
            case 'close':
                console.log('closed')
                broadcastAmount('close');
                break;
            case 'joinGame':
                joinGame(message);
                break;
        }
    })

    ws.on('close', function () {
        wss.clients.delete(ws);
        broadcastAmount('close');
    })
})

function joinGame(message) {
    const game = message.game;
    wss.clients.forEach(client => {
        client.send(JSON.stringify({
            method: 'joinGame',
            game: game,
            mainReceiver: game.player1._id
        }))
    })
}

function broadcastAmount(method) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify({
            messages: messages,
            amount: wss.clients.size + plusUsers,
            method: method
        }));
    })
}

function broadcastMessage(message) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message));
    })
}

const pingInterval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) {
            return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping(noop);
    });
}, 5000);

function noop() {}

wss.on("close", function close() {
    clearInterval(pingInterval);
});