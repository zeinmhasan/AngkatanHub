import mongoose, { Schema, Document } from 'mongoose';

export interface ISchedule extends Document {
  className: string;
  course: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  lecturer: string;
  notes?: string;
  createdBy: string;
}

const ScheduleSchema: Schema = new Schema({
  className: {
    type: String,
    required: [true, 'Class name is required'],
    enum: ['A', 'B', 'C']
  },
  course: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true
  },
  day: {
    type: String,
    required: [true, 'Day is required'],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  room: {
    type: String,
    required: [true, 'Room is required'],
    trim: true
  },
  lecturer: {
    type: String,
    required: [true, 'Lecturer name is required'],
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: String,
    required: [true, 'Creator ID is required']
  }
}, {
  timestamps: true
});

export default mongoose.model<ISchedule>('Schedule', ScheduleSchema);