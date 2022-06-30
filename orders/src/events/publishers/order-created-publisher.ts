import { Publisher, Subjects, OrderCreatedEvent } from '@mmmtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated; // Enum is both value and type !
}
