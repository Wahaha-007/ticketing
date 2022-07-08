import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from '@mmmtickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete; // Enum is both value and type !
}
