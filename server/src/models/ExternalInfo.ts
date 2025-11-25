import mongoose, { Schema, Document } from 'mongoose';

export interface IExternalInfo extends Document {
  title: string;
  description: string;
  category: 'oprec' | 'lomba' | 'seminar' | 'beasiswa' | 'lainnya';
  deadline?: Date;
  organizer: string;
  link: string;
  postedBy: string; // User ID
  createdAt: Date;
}

const ExternalInfoSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['oprec', 'lomba', 'seminar', 'beasiswa', 'lainnya']
  },
  deadline: {
    type: Date
  },
  organizer: {
    type: String,
    required: [true, 'Organizer is required'],
    trim: true
  },
  link: {
    type: String,
    required: [true, 'Link is required'],
    trim: true,
    match: [/^https?:\/\/.+/, 'Link must be a valid URL']
  },
  postedBy: {
    type: String,
    required: [true, 'Posted by user ID is required']
  }
}, {
  timestamps: true
});

export default mongoose.model<IExternalInfo>('ExternalInfo', ExternalInfoSchema);