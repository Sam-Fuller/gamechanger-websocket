import { MESSAGE_TYPES, Message, Player } from "../types";

export const updateAll = (players: Player[]) => {
    players.forEach((player) => {
        const message: Message = {
            type: MESSAGE_TYPES.UPDATE,
            id: player.id,
            players: players
                .filter((player) => player.player)
                .filter((player) => (player.missedPings || 0) < 10)
                .map((player) => ({ id: player.id, color: player.color, score: player.score }))
        }

        const stringMessage = JSON.stringify(message);
        player.websocket?.send(stringMessage);
    });
}
