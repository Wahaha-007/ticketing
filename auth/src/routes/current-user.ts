import express from 'express';
import { currentUser } from '@mmmtickets/common';

const router = express.Router(); // Special Object that contains Routes

router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
