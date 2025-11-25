import { Request, Response } from 'express';
import ForumPost from '../models/Forum';
import mongoose from 'mongoose';
import User from '../models/User';

// Get all forum posts
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { class: className } = req.query;

    let filter = {};
    if (className && className !== 'all') {
      filter = { className };
    }

    // Get posts with author populated, but not comments
    const posts = await ForumPost.find(filter)
      .populate({
        path: 'author',
        select: 'name className'
      })
      .sort({ createdAt: -1 });

    // Create a transformed response with populated comment authors
    const transformedPosts = await Promise.all(posts.map(async (post) => {
      const transformedComments = await Promise.all(post.comments.map(async (comment) => {
        const user = await User.findById(comment.author).select('name className');
        return {
          ...comment.toObject(),
          author: user ? {
            _id: user._id,
            name: user.name,
            className: user.className
          } : {
            _id: comment.author,
            name: 'Unknown User',
            className: 'N/A'
          }
        };
      }));

      return {
        ...post.toObject(),
        comments: transformedComments
      };
    }));

    res.status(200).json(transformedPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific forum post by ID
export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    let post = await ForumPost.findById(id)
      .populate({
        path: 'author',
        select: 'name className'
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Transform comments to include populated author information
    const transformedComments = await Promise.all(post.comments.map(async (comment) => {
      const user = await User.findById(comment.author).select('name className');
      return {
        ...comment.toObject(),
        author: user ? {
          _id: user._id,
          name: user.name,
          className: user.className
        } : {
          _id: comment.author,
          name: 'Unknown User',
          className: 'N/A'
        }
      };
    }));

    const transformedPost = {
      ...post.toObject(),
      comments: transformedComments
    };

    res.status(200).json(transformedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new forum post
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, className, tags } = req.body;
    const authorId = (req as any).userId; // Get user ID from auth middleware

    const newPost = new ForumPost({
      title,
      content,
      author: authorId,
      className,
      tags: tags || [],
      upvotes: 0
    });

    await newPost.save();

    // Populate the author info before returning
    const populatedPost = await ForumPost.findById(newPost._id)
      .populate('author', 'name className');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a comment to a forum post
export const addComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const authorId = (req as any).userId; // Get user ID from auth middleware

    // Validate that we have a valid authorId
    if (!authorId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID found' });
    }

    // Add the comment directly using $push and then fetch the updated post
    const updatedPost = await ForumPost.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            content,
            author: authorId,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    ).populate({
      path: 'author',
      select: 'name className'
    });

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Transform comments to include populated author information
    const transformedComments = await Promise.all(updatedPost.comments.map(async (comment) => {
      const user = await User.findById(comment.author).select('name className');
      return {
        ...comment.toObject(),
        author: user ? {
          _id: user._id,
          name: user.name,
          className: user.className
        } : {
          _id: comment.author,
          name: 'Unknown User',
          className: 'N/A'
        }
      };
    }));

    const transformedPost = {
      ...updatedPost.toObject(),
      comments: transformedComments
    };

    res.status(200).json(transformedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing forum post
export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, className, tags } = req.body;
    const userId = (req as any).userId;
    const userRole = (req as any).role;

    // Get the post to check ownership
    const post = await ForumPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is authorized to update (owner or admin)
    if (post.author.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You can only update your own posts.' });
    }

    let updatedPost = await ForumPost.findByIdAndUpdate(
      id,
      { title, content, className, tags },
      { new: true }
    )
    .populate({
      path: 'author',
      select: 'name className'
    });

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Transform comments to include populated author information
    const transformedComments = await Promise.all(updatedPost.comments.map(async (comment) => {
      const user = await User.findById(comment.author).select('name className');
      return {
        ...comment.toObject(),
        author: user ? {
          _id: user._id,
          name: user.name,
          className: user.className
        } : {
          _id: comment.author,
          name: 'Unknown User',
          className: 'N/A'
        }
      };
    }));

    const transformedPost = {
      ...updatedPost.toObject(),
      comments: transformedComments
    };

    res.status(200).json(transformedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a forum post
export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const userRole = (req as any).role;

    // Get the post to check ownership
    const post = await ForumPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is authorized to delete (owner or admin)
    if (post.author.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You can only delete your own posts.' });
    }

    const deletedPost = await ForumPost.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upvote a forum post
export const upvotePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    let updatedPost = await ForumPost.findByIdAndUpdate(
      id,
      { $inc: { upvotes: 1 } },
      { new: true }
    )
    .populate({
      path: 'author',
      select: 'name className'
    });

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Transform comments to include populated author information
    const transformedComments = await Promise.all(updatedPost.comments.map(async (comment) => {
      const user = await User.findById(comment.author).select('name className');
      return {
        ...comment.toObject(),
        author: user ? {
          _id: user._id,
          name: user.name,
          className: user.className
        } : {
          _id: comment.author,
          name: 'Unknown User',
          className: 'N/A'
        }
      };
    }));

    const transformedPost = {
      ...updatedPost.toObject(),
      comments: transformedComments
    };

    res.status(200).json(transformedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};