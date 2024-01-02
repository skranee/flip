import {WebSocketServer} from "ws";

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

    ws.on('message', function (message) {
        message = JSON.parse(message);
        console.log('new commit 2')
        switch(message.method) {
            case 'message':
                broadcastMessage(message);
                break;
            case 'stream':
                broadcastMessage(message);
                break;
        }
    })
})

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