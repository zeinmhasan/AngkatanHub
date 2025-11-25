import express from 'express';
import { adminOnly } from '../middleware/auth';
import {
  getAllActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  registerForActivity
} from '../controllers/activityController';

const router = express.Router();

// Anyone can read activities
router.get('/', getAllActivities);

// Only admins can create, update, or delete activities
router.post('/', adminOnly, createActivity);
router.put('/:id', adminOnly, updateActivity);
router.delete('/:id', adminOnly, deleteActivity);
router.post('/:id/register', registerForActivity); // Anyone can register for activities

export default router;