import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

// When create the project the design flow is also as below

// --------- 1. In the Typescript World ----------
interface TicketAttrs {
  title: string;
  price: number;
}

// Extra export for Orders
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
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

// Attach function to .staticw  = Attach function to Model ( acces to overall collection )
// Attach function to .methods  = Attach function to Document

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
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
