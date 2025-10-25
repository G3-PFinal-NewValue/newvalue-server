import ArticleModel from '../models/ArticleModel.js';
import PsychologistModel from '../models/PsychologistModel.js';
import { CategoryArticleModel } from '../models/associations.js';

export const getAllArticles = async (req, res) => {
  try {
    const { category } = req.query;
    const whereCondition = {};
    if (category) {
      whereCondition['$category.name$'] = category;
    }
    const articles = await ArticleModel.findAll({
      include: [
          { model: PsychologistModel,
          as: 'author',
          attributes: ['user_id', 'name', 'email']},
           { model: CategoryArticleModel, as: 'category', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']],
    });
    res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Error retrieving articles', error });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await ArticleModel.findByPk(id, {
      include: [
        {
          model: PsychologistModel,
          as: 'author',
          attributes: ['user_id', 'name', 'email'],
        },
        {
          model: CategoryArticleModel,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ message: 'Error retrieving article', error });
  }
};

export const createArticle = async (req, res) => {
  try {
    // Validar rol
    if (!req.user || !req.user.isPsychologist) {
      return res.status(403).json({ message: 'Only psychologists can create articles.' });
    }

     if (req.body.category_id) {
      const categoryExists = await CategoryArticleModel.findByPk(req.body.category_id);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
    }

    const newArticle = await ArticleModel.create({
      ...req.body,
      author_id: req.user.user_id,
      published_at: req.body.published ? new Date() : null,
    });

    res.status(201).json(newArticle);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(400).json({ message: 'Error creating article', error });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await ArticleModel.update(
      {
        ...req.body,
        published_at: req.body.published ? new Date() : null,
      },
      { where: { id } }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.status(200).json({ message: 'Article updated successfully' });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(400).json({ message: 'Error updating article', error });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ArticleModel.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ message: 'Error deleting article', error });
  }
};