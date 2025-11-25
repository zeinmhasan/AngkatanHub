import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  className: 'A' | 'B' | 'C';
  role: 'admin' | 'class_rep' | 'user';
  avatar?: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  className: {
    type: String,
    required: [true, 'Class is required'],
    enum: ['A', 'B', 'C']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['admin', 'class_rep', 'user'],
    default: 'user'
  },
  avatar: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);