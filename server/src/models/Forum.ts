import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  content: string;
  author: string; // User ID
  createdAt: Date;
}

export interface IForumPost extends Document {
  title: string;
  content: string;
  author: string; // User ID
  className: string;
  tags: string[];
  createdAt: Date;
  comments: IComment[];
  upvotes: number;
}

const CommentSchema: Schema = new Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author ID is required']
  }
}, {
  timestamps: true
});

const ForumPostSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author ID is required']
  },
  className: {
    type: String,
    required: [true, 'Class name is required'],
    enum: ['A', 'B', 'C']
  },
  tags: [{
    type: String,
    trim: true
  }],
  comments: [CommentSchema],
  upvotes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model<IForumPost>('ForumPost', ForumPostSchema);