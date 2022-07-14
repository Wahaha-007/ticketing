import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

// 1.2.3 Was moved to app.ts as the part of refactoring for 'Test' preparation
// 4. Real Working Function

const start = async () => {
  console.log('Starting...');

  // -------- ENV Preparing section -------- //
  // ( Must do this for every ENV var to supress Typescript error)

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  // -------- Real running base section -------- //
  try {
    // 4.2 Connect to NATS
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      // post close message
      console.log('NATS connection closed!');
      process.exit();
    });

    // Graceful Shutdown - Formally 'Close' connection
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.log(err);
  }
};

start();
