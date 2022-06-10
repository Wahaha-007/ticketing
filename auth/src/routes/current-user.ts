import express from 'express';

const router = express.Router(); // Special Object that contains Routes

router.get('/api/users/currentuser', (req, res) => {
  res.send('Hi there !');
});

export { router as currentUserRouter };
