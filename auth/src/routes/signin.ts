import express from 'express';

const router = express.Router(); // Special Object that contains Routes

router.post('/api/users/signin', (req, res) => {
  res.send('Hi there !');
});

export { router as signinRouter };
