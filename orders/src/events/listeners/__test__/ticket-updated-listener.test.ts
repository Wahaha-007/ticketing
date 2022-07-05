import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@mmmtickets/common';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // 1. (BODY) Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // 2. (PRE-BODY-DATA) Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // 3. (IN-1) Create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 999,
    userId: 'ablskdjf',
  };

  // 4. (IN-2)  Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { msg, data, ticket, listener };
};

it('finds, updates, and saves a ticket', async () => {
  // 1, 2, 3 (IN-2) (IN-1) (PRE-OUT) (BODY)
  const { msg, data, ticket, listener } = await setup();

  // ===> ( RUN ) === call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // 4. (OUT) Write assertions to make sure a ticket was updated!
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  // 1, 2, 3 (IN-2) (IN-1) (BODY)
  const { msg, data, listener } = await setup();

  // ===> ( RUN ) === call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // 4. (OUT) Write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version', async () => {
  // 1, 2, 3 (IN-2) (IN-1) (PRE-OUT) (BODY)
  const { msg, data, ticket, listener } = await setup();

  data.version = 10;

  try {
    // ===> ( RUN ) === call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
  } catch (err) {
    // Just let 'catch' here to don't let error appear as test result
  }

  // 4. (OUT) Write assertions to make sure ack function is called
  expect(msg.ack).not.toHaveBeenCalled();
});
