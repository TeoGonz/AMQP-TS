import { getChannel } from './rabbitmq';
import { setCache } from './redis';

const queue = 'scraping_queue';

export async function publishMessage(message: string): Promise<void> {
    const channel = getChannel();
    await channel.assertQueue('mi_cola', { durable: true });
    channel.sendToQueue('mi_cola', Buffer.from(message), { persistent: true });
    console.log(`Mensaje publicado: ${message}`);
}

export async function publishScrapingTask(taskId: string): Promise<void> {
    const channel = getChannel();
    // Guardar el progreso inicial en Redis
    await setCache(`scraping:${taskId}`, 'Iniciado', 3600);
    // Enviar la tarea a RabbitMQ
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(taskId), { persistent: true });
    console.log(`Tarea de scraping publicada: ${taskId}`);
}