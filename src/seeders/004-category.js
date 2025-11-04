import { sequelize } from '../config/database.js';
import CategoryModel from '../models/CategoryArticleModel.js';

const categories = [
  { name: 'Mindfulness', description: 'Categoría de mindfulness' },
  { name: 'Estrés', description: 'Categoría de manejo de estrés' },
  { name: 'Terapia', description: 'Categoría de terapia' },
  { name: 'Salud Mental', description: 'Categoría de salud mental' },
  { name: 'Bienestar', description: 'Categoría de bienestar' },
  { name: 'Ansiedad', description: 'Categoría de ansiedad' },
  { name: 'Comunicación', description: 'Categoría de comunicación' },
];

async function seedCategories() {
  console.log("🚀 Ejecutando seed de categorías...");

  try {
    console.log("🔌 Probando conexión...");
    await sequelize.authenticate();
    console.log("✅ Conexión establecida correctamente");

    const [results] = await sequelize.query("SELECT database() AS db;");
    console.log("📂 Base de datos actual:", results[0].db);

    // Forzar sincronización (solo si estás en desarrollo)
    // await sequelize.sync({ force: false });

    console.log("📝 Insertando categorías...");
    const created = await CategoryModel.bulkCreate(categories, {
      ignoreDuplicates: true,
      validate: true,
    });

    console.log(`✅ ${created.length} categorías insertadas correctamente`);
  } catch (err) {
    console.error("❌ Error al insertar categorías:", err);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

seedCategories();
