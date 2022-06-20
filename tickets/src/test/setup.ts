import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
  var signin: () => Promise<string[]>; // Async function, return promise which resolve to string[]
}

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

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
