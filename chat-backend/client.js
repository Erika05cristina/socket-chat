const net = require('net');
const crypto = require('crypto');
 // Genera una clave de 32 bytes

// Configuración para cifrado y HMAC
const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = '12345678901234567890123456789012'; // 32 bytes
const IV = Buffer.from('1234567890123456'); // 16 bytes (requerido para CBC)

const HMAC_SECRET = 'your_hmac_secret_key'; // Clave secreta para HMAC


// Función para cifrar mensajes
function encryptMessage(message) {
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, IV);
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Función para generar HMAC
function generateHMAC(message) {
    return crypto.createHmac('sha256', HMAC_SECRET).update(message).digest('hex');
}

// Conectarse al servidor
const client = new net.Socket();
const SERVER_PORT = 3000;
const SERVER_HOST = '127.0.0.1'; // Cambia si tu servidor está en otro host

client.connect(SERVER_PORT, SERVER_HOST, () => {
    console.log('Conectado al servidor.');
    sendMessage('Hola desde el cliente!');
});

// Escuchar mensajes del servidor
client.on('data', (data) => {
    console.log('Mensaje del servidor:', data.toString());
});

// Manejar desconexión
client.on('close', () => {
    console.log('Conexión cerrada.');
});

// Manejar errores
client.on('error', (err) => {
    console.error('Error en el cliente:', err.message);
});

// Función para enviar mensajes
function sendMessage(message) {
    // Generar HMAC del mensaje original
    const hmac = generateHMAC(message);

    // Crear mensaje en formato: mensaje|hmac
    const formattedMessage = `${message}|${hmac}`;

    // Cifrar el mensaje completo
    const encryptedMessage = encryptMessage(formattedMessage);

    // Enviar mensaje cifrado al servidor
    client.write(encryptedMessage);
}
