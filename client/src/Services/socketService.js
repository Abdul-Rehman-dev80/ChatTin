import { io } from "socket.io-client";

/**
 * Creates a socket connection with the current token from localStorage
 * @returns {import("socket.io-client").Socket} Socket instance
 */
const createSocket = () => {
  const token = localStorage.getItem("chat_token");
  return io("http://localhost:3000", {
    autoConnect: false,
    auth: {
      token: token || null,
    },
  });
};

// Create initial socket instance
let socketInstance = createSocket();

/**
 * Reconnects the socket with updated token from localStorage
 * Useful after login when token is stored
 * Disconnects the old socket and creates a new one with updated auth
 */
export const reconnectSocket = () => {
  // Disconnect and remove all listeners from old socket
  if (socketInstance.connected) {
    socketInstance.disconnect();
  }
  socketInstance.removeAllListeners();
  
  // Create new socket instance with updated token
  socketInstance = createSocket();
  
  // Connect the new socket
  socketInstance.connect();
};

/**
 * Socket instance proxy that always references the current socket
 * This allows the socket to be recreated while maintaining the same reference
 */
export const socket = new Proxy(socketInstance, {
  get(target, prop) {
    return socketInstance[prop];
  },
  set(target, prop, value) {
    socketInstance[prop] = value;
    return true;
  },
  apply(target, thisArg, argumentsList) {
    // Handle if socket itself is callable (it's not, but for completeness)
    return socketInstance.apply(thisArg, argumentsList);
  }
});
