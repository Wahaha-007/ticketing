import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.set('trust proxy', true); // Tell express that we have ingress as a proxy,just trust it !

// 1.Middleware : Data
app.use(json()); // bodyParser deprecated already.
app.use(
  cookieSession({
    signed: false, // No cookie encryption,
    secure: true, // only use cookie in  HTTPS connection
  })
);

// 2.Middleware : Routers
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res, next) => {
  // next(new NotFoundError());
  throw new NotFoundError();
  // Can use throw in Async because using 'express-async-errors''s help
});

// 3. Middleware : Error Handler
app.use(errorHandler);

// 4. Real Working Function

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    //  4.1 Connect to database
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
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
