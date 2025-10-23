import express from 'express';
import * as articleController from '../controllers/article.controller.js';

const router = express.Router();

router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);
router.post('/', articleController.createArticle);
router.put('/:id', articleController.updateArticle);
router.delete('/:id', articleController.deleteArticle);

export default router;