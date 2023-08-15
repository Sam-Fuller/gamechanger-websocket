import ws from 'ws';
import { MESSAGE_TYPES, Player } from './types';
import dotenv from 'dotenv';
import { connect } from './operations/connect';
import { updateAll } from './operations/update';

dotenv.config();

const websocket = new ws.Server({ port: parseInt(process.env.WEBSOCKET_PORT || "80") });
const players: Player[] = [];

setInterval(() => {
    players.forEach((player) => {
        player.missedPings = (player.missedPings || 0) + 1;

        if (player.missedPings >= 10) {
            player.websocket?.terminate();
            console.log(`Player ${player.name} terminated`);

        } if (player.missedPings >= 1000) {
            players.splice(players.indexOf(player), 1);
            console.log(`Player ${player.name} removed`);

        } else {
            player.websocket?.ping();
        }
    });
}, 2000);

websocket.on('connection', (socket, request) => {
    let player: Player;
    try {
        player = connect(socket, players, request);
    } catch (error) {
        console.log("Error connecting to server")
        socket.send("Error connecting to server")
        socket.terminate();
        return;
    }
    console.log(`Player ${player.name} connected`);

    socket.on(`pong`, () => (player.missedPings = 0));
    socket.on(`close`, () => { });

    socket.on(`message`, (message: string) => {
        try {
            const parsedMessage = JSON.parse(message);

            switch (parsedMessage.type) {
                case MESSAGE_TYPES.SET_POINTS:
                    parsedMessage.players.forEach((player: Player) => {
                        const existingPlayer = players.find((existingPlayer) => existingPlayer.name === player.name);

                        if (existingPlayer) {
                            existingPlayer.score = player.score;
                            existingPlayer.total = player.total;
                        }
                    });
                //fall through

                case MESSAGE_TYPES.UPDATE:
                    updateAll(players);
                    break;
            }
        } catch (error) {
            console.log("Error parsing message", error)
            socket.send("Error parsing message")
            return;
        }
    });
});

console.log("websocket running")
