import express from 'express';
import { getDailyAffirmation } from '../controllers/affirmationController';

const router = express.Router();

router.get('/daily', getDailyAffirmation);

export default router;