import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router(); // Special Object that contains Routes

router.get('/api/users/currentuser', (req, res) => {
  // 1. No cookie at all
  if (!req.session?.jwt) {
    // equivalent to (!req.session || !req.session.jwt)
    return res.send({ currentUser: null });
  }

  // 2. Use standard library to verify JWT
  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    return res.send({ currentUser: payload });
  } catch (err) {
    return res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };
