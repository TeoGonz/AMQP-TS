import amqp from 'amqplib';

const queue = 'my_queue';

async function receiveMessage() {
    try {
        const connection = await amqp.connect({
            hostname: 'localhost',
            port: 5672,
            username: 'MateoGonz',
            password: 'astrocomet',
        });
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, { durable: true });
        console.log(`Esperando mensajes en la cola: ${queue}`);
        channel.consume(queue, (msg) => {
            if (msg) {
                console.log(`Mensaje recibido: ${msg.content.toString()}`);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('Error recibiendo mensaje:', error);
    }
}

receiveMessage();