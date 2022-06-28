import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@mmmtickets/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth, // 1. ----- Authenticate -----
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ], // attach err to Req
  validateRequest, // 2. ----- Validate data -----
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save(); // 3. ----- Save data to database -----

    // Data in 'req' may not equal to ticket data in 'database' due to pre/post save function
    // Calling 'get Client()' using 'natsWrapper.client'
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id, // 4. ----- Send out Event -----
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
