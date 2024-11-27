const net = require('net'); // Módulo para sockets TCP

// Configuración del servidor
const PORT = 3000; // Puerto donde el servidor escuchará
const HOST = '0.0.0.0'; // Acepta conexiones desde cualquier IP

// Lista para rastrear a los clientes conectados
let clients = [];

const server = net.createServer((socket) => {
    console.log(`Nuevo cliente conectado: ${socket.remoteAddress}:${socket.remotePort}`);

    // Agrega el nuevo cliente a la lista
    clients.push(socket);

    // Escucha los mensajes del cliente
    socket.on('data', (data) => {
        console.log(`Mensaje recibido: ${data}`);
        
        // Difunde el mensaje a todos los clientes conectados
        broadcastMessage(socket, data);
    });

    // Maneja la desconexión del cliente
    socket.on('end', () => {
        console.log(`Cliente desconectado: ${socket.remoteAddress}:${socket.remotePort}`);
        clients = clients.filter((client) => client !== socket);
    });

    // Maneja errores en el socket
    socket.on('error', (err) => {
        console.error(`Error en socket: ${err.message}`);
    });
});

// Difunde un mensaje a todos los clientes, excepto al emisor
function broadcastMessage(sender, message) {
    clients.forEach((client) => {
        if (client !== sender) {
            client.write(message);
        }
    });
}

// Inicia el servidor
server.listen(PORT, HOST, () => {
    console.log(`Servidor escuchando en ${HOST}:${PORT}`);
});

// Maneja señales para detener el servidor limpiamente
process.on('SIGINT', () => {
    console.log('Cerrando el servidor...');
    clients.forEach((client) => client.destroy());
    server.close(() => {
        console.log('Servidor cerrado.');
        process.exit();
    });
});
