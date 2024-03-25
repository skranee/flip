import {WebSocketServer} from "ws";
import botService from "./services/botService.js";
import {banWords} from "./banwords.js";

export const handleOnline = (change) => {
    plusUsers += change;
    if(plusUsers < 0) {
        plusUsers = 0;
    }
    broadcastAmount('connection');
}

export const sendMessage = (message) => {
    for(const word of banWords) {
        if(message.replace(/\s/g, '').toLowerCase().includes(word.replace(/\s/g, '').toLowerCase())) {
            return null;
        }
    }
    if(messages.length > 50) {
        messages = messages.filter(item => item.id > messages[0].id);
    }
    messages.push(message);
    broadcastMessage(message);
}

export const fake = () => {
    return plusUsers;
}

let plusUsers = 0;
let streamStatus = 'offline';
let messages = [];
let giveawayGoing = false;
let giveaway = {};
let participants = [];
let usernames = [];

const wss = new WebSocketServer({
    port: 4000
}, () => console.log(`Websocket started on port 4000`))

function heartbeat() {
    this.isAlive = true;
}

wss.on('connection', function connection(ws) {

    ws.isAlive = true;

    ws.on('pong', heartbeat);

    ws.send(JSON.stringify({
        method: 'stream',
        streamStatus: streamStatus,
    }))

    ws.send(JSON.stringify({
        method: 'giveaway',
        giveaway: giveaway,
        giveawayStatus: giveawayGoing,
        participants: usernames
    }))

    ws.on('message', function (message) {
        message = JSON.parse(message);
        switch(message.method) {
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
            case 'giveaway':
                const formatTime = (milliseconds) => {
                    const totalSeconds = Math.floor(milliseconds / 1000);
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);

                    const formattedHours = String(hours).padStart(2, '0');
                    const formattedMinutes = String(minutes).padStart(2, '0');

                    return `${formattedHours}:${formattedMinutes}`;
                }
                const time = formatTime(message.giveaway.timer);
                const timeRaw = message.giveaway.timer;
                message.giveaway.timer = time;
                giveawayGoing = message.giveawayStatus;
                giveaway = message.giveaway;
                announceGiveaway(message.giveaway);
                updateTimer(timeRaw);
                break;
            case 'participate':
                participants.push(message.user);
                usernames.push(message.user.username);
                broadcastParticipants(usernames);
                break;
            case 'endGiveaway':
                giveaway = {};
                giveawayGoing = false;
                participants = [];
                usernames = [];
                break;
        }
    })

    ws.on('close', function () {
        wss.clients.delete(ws);
        broadcastAmount('close');
    })
})

function broadcastParticipants(array) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify({
            method: 'participate',
            participants: array
        }))
    })
}

function updateTimer(time) {
    const tick = setInterval(() => {
        if(time > 0) {
            const formatTime = (milliseconds) => {
                const totalSeconds = Math.floor(milliseconds / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);

                const formattedHours = String(hours).padStart(2, '0');
                const formattedMinutes = String(minutes).padStart(2, '0');

                return `${formattedHours}:${formattedMinutes}`;
            }

            const formattedTime = formatTime(time);
            wss.clients.forEach(client => {
                client.send(JSON.stringify({
                    method: 'timeUpdate',
                    time: formattedTime
                }))
            })
            time -= 60000;
            giveaway.timer = formattedTime;
        } else {
            findWinner();
            clearInterval(tick);
        }
    }, 60 * 1000)
}

function findWinner() {
    const amount = participants.length;
    let winnerIndex = Math.floor(Math.random() * amount);
    if(winnerIndex === amount && amount > 0) {
        winnerIndex--;
    }
    const winner = participants[winnerIndex];

    const complete = async () => {
        await botService.endGiveaway(giveaway.items, winner);
    }
    if(winner) {
        complete();
    }

    wss.clients.forEach(client => {
        client.send(JSON.stringify({
            method: 'giveawayEnded',
            giveaway: giveaway,
            winner: (winner && winner.username) ? winner.username : ''
        }))
    })
}

function announceGiveaway(giveawayData) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify({
            method: 'giveaway',
            giveaway: giveawayData,
            giveawayStatus: giveawayGoing,
            participants: usernames,
            firstAnnounce: true
        }))
    })
}

function joinGame(message) {
    const game = message.game;
    wss.clients.forEach(client => {
        if(game && game.player1) {
            client.send(JSON.stringify({
                method: 'joinGame',
                game: game,
                mainReceiver: game.player1._id
            }))
        }
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