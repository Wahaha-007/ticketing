import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'; // 3.1 For OCC via version control

// When create the project the design flow is also as below

// --------- 1. In the Typescript World ----------
interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

// Extra export for Orders
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number; // 3.3 Add the interface for version control
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  // function to update ticket based on OCC (Version check) concept
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

// ----------- 2. In the mongoose World -------------
const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// --  3.2 Add OCC version control ---- //
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

// Attach function to .staticw  = Attach function to Model ( acces to overall collection )
// Attach function to .methods  = Attach function to Document

// Original Version in Tickets Service :

// ticketSchema.statics.build = (attrs: TicketAttrs) => {
//   return new Ticket(attrs);
// };

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
    // Not so good yb listing one-by-one properties here
    // If the source Ticket model change in the future, we need to manually change it  here too.
    // ==> Technical debt
  });
};

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

// Need function keyword here, NOT arrow function
ticketSchema.methods.isReserved = async function () {
  // this === the ticket document that we just called 'isReserved' on
  // Run query to look at all orders, find [order with THIS ticket]  and [order status != cancelled]
  // Need to re-read basic mongo DB again
  const existingOrder = await Order.findOne({
    //ticket: this,
    ticket: this as any,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  return !!existingOrder;
};

// -- 3. When 2 worlds meet, mongoose function + typescript gate ---

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
