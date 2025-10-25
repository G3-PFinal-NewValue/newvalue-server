import express from 'express';
import * as articleController from '../controllers/article.controller.js';

const articleRouter = express.Router();

articleRouter.get('/', articleController.getAllArticles);
articleRouter.get('/:id', articleController.getArticleById);
articleRouter.post('/', articleController.createArticle);
articleRouter.put('/:id', articleController.updateArticle);
articleRouter.delete('/:id', articleController.deleteArticle);

export default articleRouter;