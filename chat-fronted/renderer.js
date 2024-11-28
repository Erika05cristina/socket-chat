const net = require('net'); // Usamos el módulo net directamente

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

const sendButton = document.getElementById('send');
const messageInput = document.getElementById('message');
const messagesDiv = document.getElementById('messages');

sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        // Enviar el mensaje al servidor
        client.write(message);
        // Mostrar el mensaje en la interfaz
        appendMessage(`Tú: ${message}`);
        // Limpiar el campo de entrada
        messageInput.value = '';
    }
});

function appendMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
