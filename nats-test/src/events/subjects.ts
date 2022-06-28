// Here 'subject' = 'channel name'
export enum Subjects {
  TicketCreated = 'ticket:created',
  TicketUpdated = 'ticket:updated',
}

// Example of how to use Enum

// 1. First, define function
// const printSubject = (subject: Subjects) => {}; // Use Enum to limit function INPUT

// 2. Then, use that function
// printSubject(Subjects.TicketCreated); // Activate functino with limited (Predefined) INPUT
