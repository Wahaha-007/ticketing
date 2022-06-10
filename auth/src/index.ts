import express from 'express';
import { json } from 'body-parser';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

import { errorHandler } from './middlewares/error-handler';

const app = express();

// 1.Middleware : Data
app.use(json()); // bodyParser deprecated already.

// 2.Middleware : Routers
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// 3. Middleware : Error Handler
app.use(errorHandler);

// 4. General Code
app.listen(3000, () => {
  console.log('Listening on port 3000!!!!!');
});
