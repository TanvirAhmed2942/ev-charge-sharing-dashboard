import { io } from "socket.io-client";
import Cookies from "js-cookie";
export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  reconnectionDelayMax: 10000,
  withCredentials: true,
  extraHeaders: {
    Authorization: `Bearer ${Cookies.get("accessToken")}`,
  },
  transports: ["websocket"],
  query: {
    token: Cookies.get("accessToken"),
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("[socket] connected", { id: socket.id });
});

socket.on("disconnect", (reason) => {
  console.log("[socket] disconnected", reason);
});

socket.on("connect_error", (err) => {
  console.log("[socket] connect_error", err.message);
});

socket.io.on("reconnect_attempt", (attempt) => {
  console.log("[socket] reconnect_attempt", attempt);
});

socket.io.on("reconnect", (attempt) => {
  console.log("[socket] reconnected after", attempt, "attempt(s)");
});

export function socketForNewNotification(
  userId: string,
  onNotification?: (notification: unknown) => void,
): () => void {
  if (!userId) {
    return () => {};
  }
  const event = `notification::${userId}`;
  const handler = (notification: unknown) => {
    console.log("new notification received 📡", notification);
    onNotification?.(notification);
  };

  socket.on(event, handler);
  return () => {
    socket.off(event, handler);
  };
}
