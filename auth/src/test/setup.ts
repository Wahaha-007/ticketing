import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf'; // Not the best place but will work for the time being

  // this no longer works
  // mongo = new MongoMemoryServer();
  // const mongoUri = await mongo.getUri();

  // it is now
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
  // https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options
  // useNewUrlParser: true, // <-- no longer necessary
  // useUnifiedTopology: true // <-- no longer necessary
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({}); // Delete all documents in collection
  }
});

afterAll(async () => {
  await mongoose.connection.close(); // We should close mongoose before closing mongo
  await mongo.stop();
});
