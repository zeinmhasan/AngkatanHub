import express from 'express';
import { auth, adminOnly } from '../middleware/auth';
import {
  getScheduleByClass,
  createSchedule,
  updateSchedule,
  deleteSchedule
} from '../controllers/scheduleController';

const router = express.Router();

// Anyone can read schedules
router.get('/', getScheduleByClass);

// Only admins can create, update, or delete schedules
router.post('/', adminOnly, createSchedule);
router.put('/:id', adminOnly, updateSchedule);
router.delete('/:id', adminOnly, deleteSchedule);

export default router;