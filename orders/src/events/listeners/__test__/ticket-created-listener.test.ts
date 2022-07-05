import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@mmmtickets/common';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // 1. (BODY) Create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // 2. (IN-1) Create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // 3. (IN-2) Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(), // Mock function
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  // 1, 2, 3 (BODY) (IN-1) (IN-2)
  const { listener, data, msg } = await setup();

  // ===> ( RUN ) === call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // 4. (OUT) Write assertions to make sure a ticket was created!
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  // 1, 2, 3 (BODY) (IN) (IN)
  const { listener, data, msg } = await setup();

  // ===> ( RUN ) ===  call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // 4. (OUT) Write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
