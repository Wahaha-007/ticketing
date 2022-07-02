import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@mmmtickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName; //  Just make another small standard ref.

  // We just care for msg.ack(), which we must manually call when we [successfully process] Message
  onMessage(data: TicketCreatedEvent['data'], msg: Message) {}
}
