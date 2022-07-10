import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  var signin: (id?: string) => string[]; // Async function, return promise which resolve to string[]
}

jest.mock('../nats-wrapper'); // Tell jest the target fake import file

let mongo: any;

beforeAll(async () => {
  // We have no pod here ,must define ENV manually for test
  // Not the best place but will work for the time being
  process.env.JWT_KEY = 'asdf';

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
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({}); // Delete all documents in collection
  }
});

afterAll(async () => {
  await mongoose.connection.close(); // We should close mongoose before closing mongo
  await mongo.stop();
});

global.signin = (id?: string) => {
  // 1.Build a JWT payload.  { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(), // Remember pattern
    email: 'test@test.com',
  };

  // 2.Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // 3.Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // 4.Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // 5.Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // 6.Return a string thats the cookie with the encoded data
  // SuperTest needs cookie in array format
  return [`session=${base64}`];
};
