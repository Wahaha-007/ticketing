import mongoose from 'mongoose';
import { OrderStatus } from '@mmmtickets/common';
import { TicketDoc } from './ticket';

export { OrderStatus }; // Re-export
// --------- 1. In the Typescript World ----------
// An interface that describes the properties
// that are required to createa a new user

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// An interface that describes the properties of
// User Document : A single record of data
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number;
}

// An interface that describes the properties of
// User Model : The entire colection of data
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

// ----------- 2. In the mongoose World -------------
// ( We have no need to dive deeper into Mongo DB world)
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus), // enum can also be used here !
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date, // Rmember this mongoose.Schema.Types.XXXX
    },
    ticket: {
      // Our HIGHTLIGHT here
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    // Function to return JSON representation of data
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id; // Mongo store _id which is not typical for other software
        delete ret._id;
      },
    },
  }
);

// Pupose of this function is to allow TypeScript to do type checking
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

// -- 3. When 2 worlds meet, mongoose function + typescript gate ---
// Finally create the model for later use (mostly read)
const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
