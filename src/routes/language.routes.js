import { Router } from 'express';
import { getAllLanguages } from '../controllers/languageController.js';

const router = Router();

router.get('/languages', getAllLanguages);

export default router;