import amqp from 'amqplib';

const queue = 'my_queue';

async function sendMessage() {
    try {
        const connection = await amqp.connect({
            hostname: 'localhost',
            port: 5672,
            username: 'MateoGonz',
            password: 'astrocomet',
        });
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, { durable: true });
        const message = 'Hola desde el Publisher!';
        channel.sendToQueue(queue, Buffer.from(message));
        console.log(`Mensaje enviado: ${message}`);
        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);
    } catch (error) {
        console.error('Error enviando mensaje:', error);
    }
}

sendMessage();