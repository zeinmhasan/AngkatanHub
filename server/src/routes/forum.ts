import express from 'express';
import { auth } from '../middleware/auth';
import {
  getAllPosts,
  createPost,
  getPostById,
  addComment,
  upvotePost,
  updatePost,
  deletePost
} from '../controllers/forumController';

const router = express.Router();

// Anyone can read forum posts
router.get('/posts', getAllPosts);
router.get('/posts/:id', getPostById);
router.post('/posts/:id/comments', auth, addComment); // Authenticated users can comment
router.put('/posts/:id/upvote', upvotePost); // Anyone can upvote

// Authenticated users can create, update, and delete posts
router.post('/posts', auth, createPost);
router.put('/posts/:id', auth, updatePost); // Only the post owner or admin can update
router.delete('/posts/:id', auth, deletePost); // Only the post owner or admin can delete

export default router;