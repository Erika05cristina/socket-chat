const net = require('net');
const crypto = require('crypto');

// Define la clave secreta para HMAC
const HMAC_SECRET = 'your_hmac_secret_key'; // Asegúrate de usar la misma clave en el servidor

// Conectar al servidor
const client = new net.Socket();
const HOST = '127.0.0.1';
const PORT = 3000;
let clientId = 'user123'; // Identificador único para el cliente

client.connect(PORT, HOST, () => {
    console.log('Conectado al servidor.');
});

// Manejar mensajes del servidor (de otros clientes)
client.on('data', (data) => {
    const message = data.toString();
    console.log(`Mensaje del servidor: ${message}`);
    appendMessage(message);  // Mostrar mensaje en la interfaz de usuario
});

// Enviar mensaje al servidor
const sendButton = document.getElementById('send');
const messageInput = document.getElementById('message');
const messagesDiv = document.getElementById('messages');

sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        client.write(encryptMessage(message, clientId));  // Enviar mensaje cifrado
        appendMessage(`Tú: ${message}`);  // Mostrar en la interfaz
        messageInput.value = '';  // Limpiar caja de texto
    }
});

function appendMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Funciones de cifrado (como las que ya tienes)
function encryptMessage(message, clientId) {
    const data = `${message}|${generateHMAC(message)}|${clientId}`;
    const cipher = crypto.createCipheriv('aes-256-cbc', '12345678901234567890123456789012', '1234567890123456'); // Usa la misma clave y IV en el servidor
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function generateHMAC(message) {
    return crypto.createHmac('sha256', HMAC_SECRET).update(message).digest('hex');
}
