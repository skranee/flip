const ws = require('ws')

const wss = new ws.Server({
    port: 4000,

}, () => console.log('WebSocket Server started on PORT 4000'))

wss.on('connection', function connection(ws) {
    ws.on('message', function (message) {
        message = JSON.parse(message);
        switch(message.event) {
            case 'message':
                broadcastMessage(message);
                break;
            case 'connection':
                //...
                break;
        }
    })
})

function broadcastMessage(message) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message));
    })
}



// const message = {
//     event: 'message/connection',
//     id: 123,
//     date: new Intl.DateTimeFormat('en-US', {
//         hour: 'numeric',
//         minute: 'numeric',
//         hour12: true
//     }).format(new Date()),
//     username: 'aaaa',
//     message: '999'
// }