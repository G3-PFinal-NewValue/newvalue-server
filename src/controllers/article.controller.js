import ArticleModel from '../models/ArticleModel.js';
import { CategoryArticleModel, UserModel, RoleModel } from '../models/associations.js';

export const getAllArticles = async (req, res) => {
  try {
    const { category } = req.query;
    const whereCondition = {};
    if (category) {
      whereCondition['$category.name$'] = category;
    }
    const articles = await ArticleModel.findAll({
      where: whereCondition,
      include: [
        {
          model: UserModel,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name', 'email', 'role_id'],
        },
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
          model: UserModel,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name', 'email', 'role_id'],
        },
        {
          model: CategoryArticleModel,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });
    if (!article) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }
    res.status(200).json(article);
  } catch (error) {
    console.error('Error al buscar artículo:', error);
    res.status(500).json({ message: 'Error retrieving article', error });
  }
};

export const createArticle = async (req, res) => {
  try {
    const VerifyRole = req.user.role;
    if (!req.user.id || VerifyRole !== 'admin') {
      return res.status(403).json({ message: 'Solo admin puede crear un artículo' });
    }

    if (req.body.category_id) {
      const categoryExists = await CategoryArticleModel.findByPk(req.body.category_id);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
    }

    const imageUrl = req.file ? req.file.path : null;

    const newArticle = await ArticleModel.create({
      ...req.body,
      author_id: req.user.id,
      image: imageUrl, // 👈 Añadir URL de Cloudinary
      published_at: req.body.published ? new Date() : null,
    });

    res.status(201).json(newArticle);
  } catch (error) {
    console.error('Error al crear artículo:', error);
    res.status(400).json({ message: 'Error al crear artículo', error });
  }
};

export const updateArticle = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo admin puede actualizar artículos.' });
    }

    const { id } = req.params;

    const currentArticle = await ArticleModel.findByPk(id);
    if (!currentArticle) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }


    const imageUrl = req.file ? req.file.path : currentArticle.image;

    const [updated] = await ArticleModel.update(
      {
        ...req.body,
        image: imageUrl, 
        published_at: req.body.published ? new Date() : null,
      },
      { where: { id } }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    res.status(200).json({ message: 'Artículo actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar artículo:', error);
    res.status(400).json({ message: 'Error al actualizar artículo', error });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo admin puede eliminar el artículo.' });
    }

    const { id } = req.params;
    const deleted = await ArticleModel.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    res.status(200).json({ message: 'Artículo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar artículo:', error);
    res.status(500).json({ message: 'Error al eliminar artículo', error });
  }
};