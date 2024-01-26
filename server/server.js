const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const socketIo = require("socket.io");
const cors = require("cors");
const { dbConnection } = require("../database/configDB");
const { alumnosConectados } = require("../controllers/alumno.controller");
const entidad = "alumno";
const WebSocketServer = WebSocket.Server;


class ServerApi {
  constructor() {
    this.app = express();
    this.port = 3000;
    this.alumnoRoutes = `/API/${entidad}`;
    this.authRoutes = `/API/auth`;
    this.administrador = '/API/administrador'

    // Conectar a la base de datos
    this.conectarDB();

    // Middlewares
    this.middelewares();

    // Rutas
    this.routes();

    // Inicializar WebSocket y Socket.IO
    this.initializeWebSocket();
    this.initializeSocketIO();
  }

  async conectarDB() {
    await dbConnection();
  }

  middelewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static("Public/build"));
  }

  routes() {
    this.app.use(this.alumnoRoutes, require("../routes/alumno.routes"));
    this.app.use(this.authRoutes, require("../routes/auth.routes"));
    this.app.use(this.administrador ,require('../routes/administrador.routes'));
  }

  initializeWebSocket() {
    // Crear el servidor HTTP para WebSocket
    const server = http.createServer(this.app);

    // Declarar wss en el ámbito global
    global.wss = new WebSocketServer({ server });

    wss.on("connection", (ws) => {
      console.log("Nuevo cliente de WebSocket conectado");

      ws.on("message", (message) => {
        console.log(`Mensaje recibido de WebSocket: ${message}`);
        const parsedMessage = JSON.parse(message);

        // Procesar el tipo de mensaje y realizar acciones correspondientes
        switch (parsedMessage.tipo) {
          case "actualizacion":
            console.log("Alumno actualizado:", parsedMessage.mensaje);
            console.log("Estado anterior:", parsedMessage.estadoAnterior);
            console.log("Nuevo estado:", parsedMessage.nuevoEstado);
            // Aquí puedes realizar acciones adicionales según la actualización
            break;
          case "eliminacion":
            console.log("Alumno eliminado:", parsedMessage.mensaje);
            console.log("Estado anterior:", parsedMessage.estadoAnterior);
            // Aquí puedes realizar acciones adicionales según la eliminación
            break;
          default:
            console.log("Tipo de mensaje no reconocido");
        }
      });
    });

    // Iniciar el servidor
    server.listen(this.port, () => {
      console.log(`Escuchando en el puerto ${this.port}`);
    });
  }

  initializeSocketIO() {
    // Crear el servidor HTTP para Socket.IO
    const server = http.createServer(this.app);
    const io = socketIo(server, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("Nuevo cliente de Socket.IO conectado");
      alumnosConectados(socket)
      // Manejar eventos de chat
      socket.on("mensaje", (msg) => {
        console.log(`Mensaje de chat de Socket.IO: ${msg}`);
        // Aquí puedes procesar el mensaje y emitirlo a todos los clientes
        io.emit("mensaje", msg);
      });

      // Manejar cierre de conexión
      socket.on("disconnect", () => {
        console.log("Cliente de Socket.IO desconectado");
      });
    });

    // Iniciar el servidor
    server.listen(this.port + 1, () => {
      console.log(`Escuchando en el puerto ${this.port + 1} para Socket.IO`);
    });
  }
}

module.exports = ServerApi;
