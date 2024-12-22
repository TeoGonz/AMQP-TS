import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { connectRabbitMQ } from './rabbitmq';
import { publishMessage, publishScrapingTask } from './publisher';
import { checkProgress, connectRedis } from './redis';
import { startScrapingWorker } from './subscriber';

const app: express.Application = express();
const PORT = 3000;

app.use(bodyParser.json());

// Ruta para publicar un mensaje
app.post('/publish', async (req: Request, res: Response): Promise<void> => {
    const { message } = req.body;
    if (!message) {
        res.status(400).json({ error: 'Falta el mensaje en el cuerpo de la solicitud' });
        return;
    }
    try {
        await publishMessage(message);
        res.status(200).json({ success: true, message: 'Mensaje publicado' });
    } catch (error) {
        res.status(500).json({ error: 'Error publicando el mensaje' });
    }
});

app.post('/publishScrapingTask', async (req: Request, res: Response): Promise<void> => {
    const { taskId } = req.body;
    if (!taskId) {
        res.status(400).json({ error: 'Falta el taskId en el cuerpo de la solicitud' });
        return
    }
    try {
        await publishScrapingTask(taskId);
        res.status(200).json({ success: true, message: 'Tarea de scraping publicada' });
    } catch (error) {
        res.status(500).json({ error: 'Error publicando la tarea de scraping' });
    }
});

app.get('/publishScrapingTask', async (req: Request, res: Response): Promise<void> => {
    const { taskId } = req.query;
    if (!taskId) {
        res.status(400).json({ error: 'Falta el taskId en la consulta' });
        return;
    }
    // Llamar a la función para verificar el progreso
    const progress = await checkProgress(taskId as string);
    res.status(200).json({ progress });
});

// Iniciar RabbitMQ y Express
(async () => {
    await connectRabbitMQ();
    await connectRedis();
    startScrapingWorker()

    app.listen(PORT, () => {
        console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
    });
})();