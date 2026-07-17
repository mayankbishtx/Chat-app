import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
    if (!socket) {
        socket = io(process.env.BACKEND_URL || "http://localhost:4000");
    }
    return socket;
}