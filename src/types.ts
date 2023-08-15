import ws from 'ws';

export enum COLORS {
    BLUE = "#5e9790",
    YELLOW = "#f9a648",
    ORANGE = "#e05536",
    RED = "#a4202d",
    PURPLE = "#5c3852"
}

export interface Player {
    name: string,
    color: COLORS,

    missedPings?: number,
    websocket?: ws.WebSocket

    score: number,
    total: number,
}

export enum MESSAGE_TYPES {
    UPDATE = "UPDATE",
    SET_POINTS = "SET_POINTS",
}

export interface Message {
    type: MESSAGE_TYPES,
    players: Player[],
}
