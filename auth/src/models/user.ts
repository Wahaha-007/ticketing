import mongoose from 'mongoose';
import { Password } from '../services/password';

// --------- 1. In the Typescript World ----------
// An interface that describes the properties
// that are required to createa a new user

interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties of
// User Model : The entire colection of data
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties of
// User Document : A single record of data
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// ----------- 2. In the mongoose World -------------
// ( We have no need to dive deeper into Mongo DB world)
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // Function to return JSON representation of data
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id; // Mongo store _id which is not typical for other software
        delete ret._id;
        delete ret.password; // Normal Js to delete object property
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    // will also 'true' for the 1st calling
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

// Pupose of this function is to allow TypeScript to do type checking
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// -- 3. When 2 worlds meet, mongoose function + typescript gate ---
// Finally create the model for later use (mostly read)
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
