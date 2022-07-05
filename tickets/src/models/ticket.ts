import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'; // 3.1 For OCC via version control

// When create the project the design flow is also as below

// --------- 1. In the Typescript World ----------
interface TicketAttrs {
  // Use for 1st time creattion (Build)
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number; // 3.3 Add the interface for version control
  orderId?: string; // Will be null for 1st time creation, not required
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
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String, // Will be null for 1st time creation, not required
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

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

// -- 3. When 2 worlds meet, mongoose function + typescript gate ---

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
