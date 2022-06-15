import express from 'express';

const router = express.Router(); // Special Object that contains Routes

router.post('/api/users/signout', (req, res) => {
  req.session = null;

  res.send({});
});

export { router as signoutRouter };
