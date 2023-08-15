import { Player, COLORS } from "../types";
import ws from "ws";

export const connect = (
    socket: ws.WebSocket,
    players: Player[],
    request: any
): Player => {
    const url: string = request.url;

    // get query parameters
    const queryParamString = url.split(`?`)[1];
    const queryParamFinder = new URLSearchParams(queryParamString);

    const queryParams: { [key: string]: string } = {};
    for (const param of queryParamFinder) {
        queryParams[param[0]] = param[1];
    }

    // get player name
    const name = queryParams.name;

    // check player name is unique
    const existingPlayer = players.find((player) => player.name === name);

    if (existingPlayer) {
        existingPlayer.websocket?.terminate();
        existingPlayer.websocket = socket;

        return existingPlayer;
    } else {
        const player: Player = {
            name,
            websocket: socket,

            color: Object.keys(COLORS)[players.length % Object.keys(COLORS).length] as COLORS,
            score: 0,
            total: 0,
        };

        players.push(player);

        return player;
    }
}
