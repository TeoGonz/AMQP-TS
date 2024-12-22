import { getChannel } from './rabbitmq';

const queue = 'mi_cola';

export async function subscribeMessages(): Promise<void> {
    const channel = getChannel();
    await channel.assertQueue(queue, { durable: true });
    console.log(`Esperando mensajes en la cola: ${queue}`);
    channel.consume(queue, (msg) => {
        if (msg) {
            console.log(`Mensaje recibido: ${msg.content.toString()}`);
            channel.ack(msg);
        }
    });
}