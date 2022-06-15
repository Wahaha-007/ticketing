import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router(); // Special Object that contains Routes

router.post(
  '/api/users/signup',
  [
    // 1. Data input verification
    body('email')
      .isEmail()
      // 1.1 Add error msg. to Req. Object
      .withMessage('Email must be valid.'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      // 1.2 Add error msg. to Req. Object
      .withMessage('Password must be between 4 and 20 characters.'),
  ],
  // 2. validationResult will pull out error msg. from Req.
  validateRequest, // Just function definition (name) here not run function
  // 3. OK, no invalid input, let's continue Auth Service Workflow
  async (req: Request, res: Response) => {
    // 3.1 Check if Email already been used
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email }); // { 'email': email }

    if (existingUser) {
      // console.log('Email in use');
      // return res.send({});
      throw new BadRequestError('Email in use');
    }

    // 3.2 Save to database
    const user = User.build({ email, password });
    await user.save(); // Really save to the database

    // 3.3 Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // 3.4 Store JWT on the session object
    // req.session.jwt = userJwt; => Will give and error
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
