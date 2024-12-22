import { getChannel } from './rabbitmq';

const queue = 'mi_cola';

export async function publishMessage(message: string): Promise<void> {
    const channel = getChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    console.log(`Mensaje publicado: ${message}`);
}