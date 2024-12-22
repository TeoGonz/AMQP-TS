import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { connectRabbitMQ } from './rabbitmq';
import { publishMessage } from './publisher';

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

// Iniciar RabbitMQ y Express
(async () => {
    await connectRabbitMQ();

    app.listen(PORT, () => {
        console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
    });
})();