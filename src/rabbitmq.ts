import amqp from 'amqplib';

let connection: amqp.Connection;
let channel: amqp.Channel;

export async function connectRabbitMQ() {
    try {
        connection = await amqp.connect({
            hostname: 'localhost',
            port: 5672,
            username: 'MateoGonz',
            password: 'astrocomet',
        });

        channel = await connection.createChannel();
        console.log('Conectado a RabbitMQ');
    } catch (error) {
        console.error('Error conectándose a RabbitMQ:', error);
        process.exit(1);
    }
}

export function getChannel(): amqp.Channel {
    if (!channel) {
        throw new Error('RabbitMQ no está conectado');
    }
    return channel;
}