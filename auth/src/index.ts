import express from 'express';
import { json } from 'body-parser';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();

// 1.Middleware
app.use(json()); // bodyParser deprecated already.

// 2.Routers
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// 3. General Code
app.listen(3000, () => {
  console.log('Listening on port 3000!!!!!');
});
