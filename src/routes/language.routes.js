import { Router } from 'express';
import { getAllLanguages } from '../controllers/language.controller.js';

const languageRouter = Router();

languageRouter.get('/languages', getAllLanguages);

export default languageRouter;