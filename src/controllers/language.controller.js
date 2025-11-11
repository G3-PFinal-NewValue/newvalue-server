export const getAllLanguages = async (req, res) => {
    try {
        const languages = await LanguageModel.findAll({
            attributes: ['id', 'name', 'code'],
            order: [['name', 'ASC']]
        });
        res.status(200).json(languages);
    } catch (error) {
        console.error('Error al obtener idiomas:', error);
        res.status(500).json({ message: 'Error al obtener idiomas' });
    }
};