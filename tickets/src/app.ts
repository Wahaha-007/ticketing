import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@mmmtickets/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import { updateTicketRouter } from './routes/update';

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

app.use(currentUser);

// 2.Middleware : Routers

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all('*', async (req, res, next) => {
  // next(new NotFoundError());
  throw new NotFoundError();
  // Can use throw in Async because using 'express-async-errors''s help
});

// 3. Middleware : Error Handler
app.use(errorHandler);

export { app };
