import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@mmmtickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName; //  Just make another small standard ref.

  // We just care for msg.ack(), which we must manually call when we [successfully process] Message
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    // const ticket = await Ticket.findById(data.id);
    // const ticket = await Ticket.findOne({
    //   _id: data.id,
    //   version: data.version - 1,
    // });

    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // console.log('Current Version: ', ticket);

    const { title, price, version } = data;
    ticket.set({ title, price, version }); // If we don't provide version, the 'library' will write 'old version+1'

    // console.log('Presave Version: ', ticket);
    await ticket.save(); // Save data into Orders database, 'ticket' collection [ Redundancy ? ]

    msg.ack();
  }
}
