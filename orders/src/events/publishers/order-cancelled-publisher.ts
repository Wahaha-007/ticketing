import { Publisher, Subjects, OrderCancelledEvent } from '@mmmtickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled; // Enum is both value and type !
}
