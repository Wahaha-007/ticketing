import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from '@mmmtickets/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // 1. (BODY) Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // 2. (PRE-BODY-DATA) Create and save a ticket
  const orderId = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'asdf',
  });

  ticket.set({ orderId }); //Make a ticket and suppose that it is already reserved

  await ticket.save();

  // 3. (IN-1) Create the fake data event
  const data: OrderCancelledEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // 4. (IN-2) Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg, orderId };
};

// Test everything is just one test to save time / effort
it('updates the ticket, publishes an event, and acks the message', async () => {
  // 1, 2, 3,4 (BODY) (PRE-BODY-DATA) (IN-1) (IN-2) (OPTION)
  const { listener, ticket, data, msg, orderId } = await setup();

  // ===> ( RUN ) === call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // 5. (OUT) Write assertions to make sure a ticket's orderId is deleted (to be undefine)
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
