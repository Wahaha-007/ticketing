import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { Password } from '../services/password';
import { User } from '../models/user';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router(); // Special Object that contains Routes

router.post(
  '/api/users/signin',
  [
    // 1. Data input verification
    body('email')
      .isEmail()
      // 1.1 Add error msg. to Req. Object
      .withMessage('Email must be valid.'),
    body('password')
      .trim()
      .notEmpty()
      // 1.2 Add error msg. to Req. Object
      .withMessage('You must supply a password'),
  ],
  // 2. validationResult will pull out error msg. from Req.
  validateRequest,
  // 3. OK, no invalid input, let's continue Auth Service Workflow
  async (req: Request, res: Response) => {
    // 3.1 Check if Email exists
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email }); // { 'email': email }

    if (!existingUser) {
      throw new BadRequestError('Invalid Credentials');
    }

    // 3.2 Check password
    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordMatch) {
      throw new BadRequestError('Invalid Credentials');
    }

    // 3.3 Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // 3.4 Store JWT on the session object
    // req.session.jwt = userJwt; => Will give and error
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
