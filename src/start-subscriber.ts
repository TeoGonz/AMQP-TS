import { connectRabbitMQ } from './rabbitmq';
import { subscribeMessages } from './subscriber';

(async () => {
    await connectRabbitMQ();
    await subscribeMessages();
})();
