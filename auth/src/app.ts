import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

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
    // secure: true, // only use cookie in  HTTPS connection
    secure: process.env.NODE_ENV !== 'test',
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

export { app };
