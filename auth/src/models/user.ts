import mongoose from 'mongoose';

// --------- 1. In the Typescript World ----------
// An interface that describes the properties
// that are required to createa a new user

interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// ----------- 2. In the mongoose Wrold -------------
// ( We have no need to dive deeper into Mongo DB world)
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// -- 3. When 2 worlds meet, mongoose function + typescript gate ---
// 3.1 Writer
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// 3.2 Reader
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
