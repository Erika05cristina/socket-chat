const net = require('net');

const HOST = '127.0.0.1';
const PORT = 3000;

let client = new net.Socket();

// Conectar al servidor
client.connect(PORT, HOST, () => {
    console.log('Conectado al servidor.');
});

client.on('data', (data) => {
    appendMessage(`Servidor: ${data.toString()}`);
});

// Manejar mensajes enviados por el usuario
const sendButton = document.getElementById('send');
const messageInput = document.getElementById('message');
const messagesDiv = document.getElementById('messages');

sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        client.write(message);
        appendMessage(`Tú: ${message}`);
        messageInput.value = '';
    }
});

function appendMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
