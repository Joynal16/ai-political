import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  emailOrPhone: string;
  passwordHash: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

const schema = new Schema<IUser>({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  emailOrPhone: { type: String, required: true, unique: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model<IUser>('User', schema);
