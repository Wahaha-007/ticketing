import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@mmmtickets/common';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth, // 1. ----- Authenticate -----
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
  ],
  validateRequest, // 2. ----- Validate data -----
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    // Add new business Logic
    if (ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket');
    }
    // ---------------------

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      // Not use build HERE
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save(); // 3. ----- Save data to database -----
    // await new TicketUpdatedPublisher(natsWrapper.client).publish({
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id, // 4. ----- Send out Event -----
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
