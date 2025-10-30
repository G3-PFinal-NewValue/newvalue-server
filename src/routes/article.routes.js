import express from 'express';
import * as articleController from '../controllers/article.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const articleRouter = express.Router();

//Público
articleRouter.get('/', articleController.getAllArticles);
articleRouter.get('/:id', articleController.getArticleById);

//Solo admin
articleRouter.post('/', authMiddleware, roleMiddleware("admin"), articleController.createArticle);
articleRouter.put('/:id', authMiddleware, roleMiddleware("admin"), articleController.updateArticle);
articleRouter.delete('/:id', authMiddleware, roleMiddleware("admin"),articleController.deleteArticle);

export default articleRouter;