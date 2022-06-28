import { Publisher, Subjects, TicketCreatedEvent } from '@mmmtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated; // Enum is both value and type !
}
