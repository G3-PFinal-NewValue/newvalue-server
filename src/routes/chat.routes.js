import { Router } from 'express';
import { getCometChatToken } from '../controllers/chat.controller.js';
import  authMiddleware  from '../middleware/authMiddleware.js'; 

const router = Router();

router.get('/token', authMiddleware, getCometChatToken);

export default router;