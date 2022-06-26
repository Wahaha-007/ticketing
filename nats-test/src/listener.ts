import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    // Graceful Shutdown - Follow up
    console.log('NATS connection closed!');
    process.exit();
  });

  const options = stan
    .subscriptionOptions() //
    .setManualAckMode(true) // We will set acknowledge by ourself
    .setDeliverAllAvailable() // Resend all stored message when servcie re-online
    .setDurableName('accounting-service');

  const subscription = stan.subscribe(
    'ticket:created',
    'orders-service-queue-group',
    options
  );

  subscription.on('message', (msg: Message) => {
    // console.log('Message received');

    const data = msg.getData();

    //if (typeof data === 'string') {
    console.log(`Receiveed event #${msg.getSequence()}, wit data: ${data}`);
    //}

    msg.ack();
  });
});

// Graceful Shutdown - Formally 'Close' connection
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
