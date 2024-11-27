const net = require('net');

// Configuración del cliente
const HOST = '127.0.0.1';
const PORT = 3000;

// Crear conexión al servidor
const client = net.createConnection({ host: HOST, port: PORT }, () => {
    console.log('Conectado al servidor');
    client.write('¡Hola, servidor!');
});

// Manejar mensajes recibidos del servidor
client.on('data', (data) => {
    console.log(`Mensaje del servidor: ${data}`);
});

// Manejar cierre de conexión
client.on('end', () => {
    console.log('Desconectado del servidor');
});

// Manejar errores
client.on('error', (err) => {
    console.error(`Error: ${err.message}`);
});

// Simular el envío de varios mensajes
setTimeout(() => client.write('Primer mensaje'), 2000);
setTimeout(() => client.write('Segundo mensaje'), 4000);
setTimeout(() => client.write('Tercer mensaje'), 6000);
setTimeout(() => client.end(), 8000); // Cierra la conexión después de enviar mensajes
