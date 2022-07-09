import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@mmmtickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import { Order } from '../../../models/order';

const setup = async () => {
  // 1. (BODY) Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // 2. (IN-1) Create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'alskdjf',
    userId: 'alskdjf',
    status: OrderStatus.Created,
    ticket: {
      id: 'alskdfj',
      price: 10,
    },
  };

  // 3. (IN-2) Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('replicates the order info', async () => {
  // 1, 2, 3 (BODY) (IN-1) (IN-2)
  const { listener, data, msg } = await setup();

  // ===> ( RUN ) === call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  // 1, 2, 3 (BODY) (IN-1) (IN-2)
  const { listener, data, msg } = await setup();

  // ===> ( RUN ) === call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
