import { Publisher, Subjects, TicketUpdatedEvent } from '@mmmtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated; // Enum is both value and type !
}
