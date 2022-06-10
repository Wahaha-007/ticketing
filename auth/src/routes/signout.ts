import express from 'express';

const router = express.Router(); // Special Object that contains Routes

router.post('/api/users/signout', (req, res) => {
  res.send('Hi there !');
});

export { router as signoutRouter };
