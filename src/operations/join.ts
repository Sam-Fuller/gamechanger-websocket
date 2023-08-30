import { COLORS, Player } from "../types";

import { updateAll } from "./update";
import ws from "ws";

let idIterator = 0;

export const join = (
    socket: ws.WebSocket,
    players: Player[],
): Player => {
    const player: Player = {
        id: idIterator,
        player: false,
        websocket: socket,

        color: Object.keys(COLORS)[players.length % Object.keys(COLORS).length] as COLORS,
        score: 0,
    };

    idIterator++;
    players.push(player);

    updateAll(players);

    return player;
}
