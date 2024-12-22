import { createClient } from 'redis';

const redisClient = createClient({
    url: 'redis://localhost:6379',
    password: 'astrosecurepassword',  // Aquí se añade la contraseña
});

redisClient.on('error', (err) => {
    console.error('Error conectándose a Redis:', err);
});

export async function connectRedis() {
    try {
        await redisClient.connect();
        console.log('Conectado a Redis');
    } catch (error) {
        console.error('Error conectando a Redis:', error);
    }
}

export async function setCache(key: string, value: string, ttl: number) {
    await redisClient.set(key, value, { EX: ttl }); // Guardar con un TTL
}

export async function getCache(key: string): Promise<string | null> {
    return redisClient.get(key); // Recuperar valor
}

// Llamar a la función para verificar el progreso
export async function checkProgress(taskId: string) {
    let retries = 0;
    let progress = await getCache(`scraping:${taskId}`);
    while (progress === 'Iniciado' && retries < 5) {
        console.log(`Reintento de obtener el progreso de ${taskId}...`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos antes de reintentar
        progress = await getCache(`scraping:${taskId}`);
        retries++;
    }
    console.log(`Progreso de ${taskId}: ${progress}`);
    return progress;
}

export default redisClient;
