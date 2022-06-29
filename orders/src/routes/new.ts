import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@mmmtickets/common';
// import { Ticket } from '../models/ticket';
// import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/orders',
  requireAuth, // 1. ----- Authenticate -----
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId is required'),
  ],
  validateRequest, // 2. ----- Validate data -----
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // const ticket = Ticket.build({
    //   title,
    //   price,
    //   userId: req.currentUser!.id,
    // });
    // await ticket.save(); // 3. ----- Save data to database -----

    // // Data in 'req' may not equal to ticket data in 'database' due to pre/post save function
    // // Calling 'get Client()' using 'natsWrapper.client'
    // await new TicketCreatedPublisher(natsWrapper.client).publish({
    //   id: ticket.id, // 4. ----- Send out Event -----
    //   title: ticket.title,
    //   price: ticket.price,
    //   userId: ticket.userId,
    // });

    res.send({ ticketId });
  }
);

export { router as newOrderRouter };
