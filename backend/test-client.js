// test-client.js
const { io } = require("socket.io-client");

console.log("Intentando conectar a ws://localhost:3000...");

// Añadimos una opción de transporte explícita, que a veces ayuda
const socket = io("ws://localhost:3000", {
  transports: ["websocket"] 
});

socket.on("connect", () => {
  console.log("✅ ¡CONECTADO EXITOSAMENTE AL SERVIDOR!", `ID: ${socket.id}`);
  socket.disconnect();
});

socket.on("connect_error", (err) => {
  console.error("❌ ERROR DE CONEXIÓN:", err.message);
});