import { Player, MESSAGE_TYPES, Message } from "../types";

export const updateAll = (players: Player[]) => {
    const message: Message = {
        type: MESSAGE_TYPES.UPDATE,
        players: players.map((player) => ({ name: player.name, color: player.color, score: player.score, total: player.total }))
    }

    const stringMessage = JSON.stringify(message);

    players.forEach((player) => {
        player.websocket?.send(stringMessage);
    });
}
