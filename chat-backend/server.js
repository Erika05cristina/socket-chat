const net = require('net');
const crypto = require('crypto');

// Configuración para cifrado y HMAC
const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = '12345678901234567890123456789012'; // 32 bytes
const IV = Buffer.from('1234567890123456'); // 16 bytes (requerido para CBC)

const HMAC_SECRET = 'your_hmac_secret_key'; // Clave secreta para HMAC

// Lista de sockets conectados
const clients = [];

// Función para descifrar mensajes
function decryptMessage(encryptedMessage) {
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, IV);
    let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Función para generar HMAC
function generateHMAC(message) {
    return crypto.createHmac('sha256', HMAC_SECRET).update(message).digest('hex');
}

// Crear el servidor TCP
const server = net.createServer((socket) => {
    console.log('Cliente conectado:', socket.remoteAddress);
    clients.push(socket); // Agregar cliente a la lista

    socket.on('data', (data) => {
        try {
            // Descifrar mensaje recibido
            const decryptedData = decryptMessage(data.toString());
            console.log('Mensaje descifrado:', decryptedData);

            // Separar mensaje y HMAC
            const [message, clientHMAC] = decryptedData.split('|');
            if (!message || !clientHMAC) {
                console.error('Formato de mensaje inválido.');
                return;
            }

            // Generar HMAC en el servidor para verificar integridad
            const serverHMAC = generateHMAC(message);
            if (serverHMAC !== clientHMAC) {
                console.error('Error: Integridad del mensaje comprometida.');
                return;
            }

            console.log('Mensaje recibido y validado:', message);

            // Difundir el mensaje validado a todos los clientes
            broadcastMessage(socket, message);

        } catch (error) {
            console.error('Error al procesar el mensaje:', error.message);
        }
    });

    socket.on('end', () => {
        console.log('Cliente desconectado:', socket.remoteAddress);
        // Eliminar cliente de la lista
        const index = clients.indexOf(socket);
        if (index !== -1) clients.splice(index, 1);
    });

    socket.on('error', (err) => {
        console.error('Error en el socket:', err.message);
    });
});

// Difundir mensajes a otros clientes
function broadcastMessage(senderSocket, message) {
    clients.forEach((socket) => {
        if (socket !== senderSocket) {
            socket.write(message);
        }
    });
}

// Iniciar el servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor TCP escuchando en el puerto ${PORT}`);
});