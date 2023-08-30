import { MESSAGE_TYPES, Player } from './types';

import dotenv from 'dotenv';
import { join } from './operations/join';
import { updateAll } from './operations/update';
import ws from 'ws';

dotenv.config();

const websocket = new ws.Server({ port: parseInt(process.env.WEBSOCKET_PORT || "80") });
const players: Player[] = [];

setInterval(() => {
    players.forEach((player) => {
        player.missedPings = (player.missedPings || 0) + 1;

        if (player.missedPings >= 10) {
            player.websocket?.terminate();
            updateAll(players);

        } if (player.missedPings >= 1000) {
            players.splice(players.indexOf(player), 1);
            console.log(`Player ${player.id} removed`);

        } else {
            player.websocket?.ping();
        }
    });
}, 2000);

websocket.on('connection', (socket, request) => {
    const player: Player = join(socket, players);
    console.log(`Player ${player.id} joined`);

    socket.on(`pong`, () => (player.missedPings = 0));
    socket.on(`close`, () => { updateAll(players); });

    socket.on(`message`, (message: string) => {
        try {
            const parsedMessage = JSON.parse(message);

            switch (parsedMessage.type) {
                case MESSAGE_TYPES.SET_POINTS:
                    parsedMessage.players.forEach((player: Player) => {
                        const existingPlayer = players.find((existingPlayer) => existingPlayer.id === player.id);

                        if (existingPlayer) {
                            existingPlayer.score = player.score;
                        }
                    });

                    updateAll(players);
                    break;

                case MESSAGE_TYPES.UPDATE:
                    updateAll(players);
                    break;

                case MESSAGE_TYPES.JOIN:
                    if (player.player) break;

                    player.player = true;
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
