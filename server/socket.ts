import { Server as IOServer } from "socket.io";
import type { Server as HTTPServer } from "http";
import { randomUUID } from "crypto";

interface RoomMember {
  socketId: string;
  username: string;
}

interface JoinRoomPayload {
  roomId: string;
  username: string;
}

interface ChatMessagePayload {
  roomId: string;
  username: string;
  text: string;
}

const rooms = new Map<string, RoomMember[]>();

export function initSocket(httpServer: HTTPServer) {
  const io = new IOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_FRONTEND_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("create-room", () => {
      const roomId = randomUUID().slice(0, 8);
      rooms.set(roomId, []);
      socket.emit("room-created", { roomId });
    });

    socket.on("join-room", ({ roomId, username }: JoinRoomPayload) => {
      if (!rooms.has(roomId)) {
        socket.emit("join-error", { message: "Room does not exist" });
        return;
      }

      socket.join(roomId);
      const members = rooms.get(roomId)!;
      const alreadyIn = members.some((m) => m.socketId === socket.id);
      if (!alreadyIn) {
        members.push({ socketId: socket.id, username });
        rooms.set(roomId, members);
      }

      io.to(roomId).emit("room-members", members.map((m) => m.username));
    });

    socket.on("chat-message", ({ roomId, username, text }: ChatMessagePayload) => {
      io.to(roomId).emit("chat-message", { username, text, ts: Date.now() });
    });

    socket.on("disconnect", () => {
      for (const [roomId, members] of rooms.entries()) {
        const updated = members.filter((m) => m.socketId !== socket.id);
        if (updated.length) {
          rooms.set(roomId, updated);
          io.to(roomId).emit("room-members", updated.map((m) => m.username));
        } else {
          rooms.delete(roomId);
        }
      }
    });
  });
}