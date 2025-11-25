import express from 'express';
import { adminOnly } from '../middleware/auth';
import {
  getExternalInfoByCategory,
  createExternalInfo,
  updateExternalInfo,
  deleteExternalInfo
} from '../controllers/externalInfoController';

const router = express.Router();

// Anyone can read external info
router.get('/', getExternalInfoByCategory);

// Only admins can create, update, or delete external info
router.post('/', adminOnly, createExternalInfo);
router.put('/:id', adminOnly, updateExternalInfo);
router.delete('/:id', adminOnly, deleteExternalInfo);

export default router;