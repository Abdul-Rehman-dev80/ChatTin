import jwt from "jsonwebtoken";


const socketAuth = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("No token provided"));
  }

  // Check if JWT_SECRET is set
  if (!process.env.JWT_SECRET) {
    return next(new Error("Server configuration error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user data to the socket object for use in chat events
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Invalid or expired token"));
  }
};

export default socketAuth;
