import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  description: string;
  className: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  attachments?: string[];
  createdBy: string;
}

const AssignmentSchema: Schema = new Schema({
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
  className: {
    type: String,
    required: [true, 'Class name is required'],
    enum: ['A', 'B', 'C']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  completed: {
    type: Boolean,
    default: false
  },
  attachments: [{
    type: String
  }],
  createdBy: {
    type: String,
    required: [true, 'Created by is required']
  }
}, {
  timestamps: true
});

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);