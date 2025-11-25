import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  participants: string[];
  maxParticipants?: number;
  type: 'kumpul' | 'suporteran' | 'lainnya';
  createdBy: string;
}

const ActivitySchema: Schema = new Schema({
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
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  organizer: {
    type: String,
    required: [true, 'Organizer is required'],
    trim: true
  },
  participants: [{
    type: String
  }],
  maxParticipants: {
    type: Number
  },
  type: {
    type: String,
    required: [true, 'Activity type is required'],
    enum: ['kumpul', 'suporteran', 'lainnya']
  },
  createdBy: {
    type: String,
    required: [true, 'Creator ID is required']
  }
}, {
  timestamps: true
});

export default mongoose.model<IActivity>('Activity', ActivitySchema);