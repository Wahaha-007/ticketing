import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

// 1.2.3 Was moved to app.ts as the part of refactoring for 'Test' preparation
// 4. Real Working Function

const start = async () => {
  // Must do this so that Typescript will not complain
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  // Must do this so that Typescript will not complain
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    //  4.1 Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // 4.2 Connect to NATS
    await natsWrapper.connect('ticketing', 'wahahaha', 'http://nats-srv:4222');
    natsWrapper.client.on('close', () => {
      // post close message
      console.log('NATS connection closed!');
      process.exit();
    });

    // Graceful Shutdown - Formally 'Close' connection
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
  } catch (err) {
    console.log(err);
  }

  // 100. General Code
  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!');
  });
};

start();
