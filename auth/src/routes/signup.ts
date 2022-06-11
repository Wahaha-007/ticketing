import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

const router = express.Router(); // Special Object that contains Routes

router.post(
  '/api/users/signup',
  [
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
  (req: Request, res: Response) => {
    // 2. validationResult will pull out error msg. from Req.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // return res.status(400).send(errors.array());
      // throw new Error('Invalid email or password');
      throw new RequestValidationError(errors.array());
    }

    // 3. OK, no error, let's continue
    const { email, password } = req.body;

    console.log('Creatinga user...');
    /// throw new Error('Error connecting to database');
    throw new DatabaseConnectionError();

    res.send({});

    // new User ({ email, password })
  }
);

export { router as signupRouter };
