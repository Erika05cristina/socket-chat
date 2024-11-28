const net = require('net');
const crypto = require('crypto');

// Configuración de cifrado y HMAC
const HMAC_SECRET = 'your_hmac_secret_key'; // Clave secreta para HMAC
const ENCRYPTION_KEY = '12345678901234567890123456789012'; // 32 bytes (igual que el servidor)
const IV = '1234567890123456'; // 16 bytes (igual que el servidor)

// Configuración inicial
const client = new net.Socket();
const HOST = '127.0.0.1';
const PORT = 3000;
let clientId = ''; // Se establecerá cuando el usuario ingrese su nombre
let username = ''; // Nombre de usuario que se enviará al servidor

// Conectar al servidor
function connectToServer() {
    client.connect(PORT, HOST, () => {
        console.log('Conectado al servidor.');
        // Enviar el nombre del usuario al servidor como primer mensaje
        client.write(encryptMessage(username, clientId));
    });

    // Manejar mensajes del servidor (de otros clientes)
    client.on('data', (data) => {
        const message = data.toString();
        appendMessage(message); // Mostrar mensaje en la interfaz de usuario
    });

    // Manejar errores
    client.on('error', (err) => {
        console.error('Error en el cliente:', err.message);
    });
}

// Enviar mensaje al servidor
function sendMessage() {
    const messageInput = document.getElementById('message');
    const message = messageInput.value.trim();

    if (message) {
        const encryptedMessage = encryptMessage(message, clientId);
        client.write(encryptedMessage); // Enviar mensaje cifrado
        appendMessage(`Tú: ${message}`); // Mostrar en la interfaz
        messageInput.value = ''; // Limpiar caja de texto
    }
}

// Mostrar mensajes en la interfaz
function appendMessage(text) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Desplazar hacia el final
}

// Manejar el formulario de nombre
document.getElementById('start-chat').addEventListener('click', () => {
    username = document.getElementById('username').value.trim();
    clientId = `user-${Date.now()}`; // Generar un ID único basado en el tiempo

    if (!username) {
        alert('Por favor, ingresa un nombre.');
        return;
    }

    // Ocultar formulario y mostrar el contenedor del chat
    document.getElementById('form-container').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';

    // Conectar al servidor con el nombre ingresado
    connectToServer();
});

// Manejar envío de mensajes desde el chat
document.getElementById('send-message').addEventListener('click', sendMessage);

// Funciones de cifrado
function encryptMessage(message, clientId) {
    const data = `${message}|${generateHMAC(message)}|${clientId}`;
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function generateHMAC(message) {
    return crypto.createHmac('sha256', HMAC_SECRET).update(message).digest('hex');
}
