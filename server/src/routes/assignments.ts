import express from 'express';
import { adminOnly } from '../middleware/auth';
import {
  getAssignmentsByClass,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  completeAssignment
} from '../controllers/assignmentController';

const router = express.Router();

// Anyone can read assignments
router.get('/', getAssignmentsByClass);

// Only admins can create, update, or delete assignments
router.post('/', adminOnly, createAssignment);
router.put('/:id', adminOnly, updateAssignment);
router.patch('/:id/complete', completeAssignment); // Users can complete their assignments
router.delete('/:id', adminOnly, deleteAssignment);

export default router;