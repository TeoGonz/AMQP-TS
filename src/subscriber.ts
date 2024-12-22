import { getChannel } from './rabbitmq';
import { setCache } from './redis';

const queue = 'scraping_queue';

export async function subscribeMessages(): Promise<void> {
    const channel = getChannel();
    await channel.assertQueue('mi_cola', { durable: true });
    console.log(`Esperando mensajes en la cola: ${'mi_cola'}`);
    channel.consume('mi_cola', (msg) => {
        if (msg) {
            console.log(`Mensaje recibido: ${msg.content.toString()}`);
            channel.ack(msg);
        }
    });
}
// startScrapingWorker : Funcion que simula el flujo de trabajo del scraping
export async function startScrapingWorker() {
    const channel = getChannel();
    await channel.assertQueue(queue, { durable: true });
    console.log('Esperando tareas de scraping...');
    channel.consume(queue, async (msg) => {
        if (msg) {
            const taskId = msg.content.toString();
            console.log(`Procesando tarea: ${taskId}`);

            let progress = 0;
            for (let i = 1; i <= 5; i++) {
                progress = i * 20;
                console.log(`Actualizando el progreso en Redis: ${taskId} - ${progress}%`);
                await setCache(`scraping:${taskId}`, `${progress}% completado`, 3600);
                console.log(`Progreso de ${taskId}: ${progress}%`);
                await new Promise(resolve => setTimeout(resolve, 5000)); // Simula el trabajo
            }

            console.log(`Finalizando tarea y marcando como completada: ${taskId}`);
            await setCache(`scraping:${taskId}`, 'Completado', 3600); // Marcar como completado en Redis
            channel.ack(msg); // Confirmamos que hemos procesado la tarea
            console.log(`Tarea ${taskId} completada`);
        }
    });
}
