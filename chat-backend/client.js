const net = require('net');
const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = '12345678901234567890123456789012'; // 32 bytes
const IV = Buffer.from('1234567890123456'); // 16 bytes
const HMAC_SECRET = 'your_hmac_secret_key';

let client;
let clientId = 'user123'; // Identificador único para el cliente
let reconnectInterval = 5000;

function encryptMessage(message, clientId) {
    const data = `${message}|${generateHMAC(message)}|${clientId}`;
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, IV);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function generateHMAC(message) {
    return crypto.createHmac('sha256', HMAC_SECRET).update(message).digest('hex');
}

function connectToServer() {
    client = new net.Socket();

    client.connect(3000, '127.0.0.1', () => {
        console.log('Conectado al servidor.');
        sendMessage('Hola desde el cliente!');
    });

    client.on('data', (data) => {
        console.log('Mensaje del servidor:', data.toString());
    });

    client.on('close', () => {
        console.log('Conexión cerrada. Intentando reconectar...');
        setTimeout(connectToServer, reconnectInterval);
    });

    client.on('error', (err) => {
        console.error('Error en el cliente:', err.message);
    });
}

function sendMessage(message) {
    const encryptedMessage = encryptMessage(message, clientId);
    client.write(encryptedMessage);
}

connectToServer();
