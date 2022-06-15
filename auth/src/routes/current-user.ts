import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router(); // Special Object that contains Routes

router.get('/api/users/currentuser', (req, res) => {
  if (!req.session?.jwt) {
    // equivalent to (!req.session || !req.session.jwt)
    return res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };
