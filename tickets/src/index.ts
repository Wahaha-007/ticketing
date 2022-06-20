import mongoose from 'mongoose';
import { app } from './app';

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
  } catch (err) {
    console.log(err);
  }

  // 100. General Code
  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!');
  });
};

start();
