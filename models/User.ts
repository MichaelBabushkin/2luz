import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional if using OAuth later, but needed for simple auth
  partnerCode: string;
  partnerId?: mongoose.Types.ObjectId;
  points: number;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    partnerCode: { type: String, required: true, unique: true },
    partnerId: { type: Schema.Types.ObjectId, ref: 'User' },
    points: { type: Number, default: 0 },
    avatar: { type: String },
  },
  { timestamps: true }
);

// Check if model already exists to prevent overwrite error in dev
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
