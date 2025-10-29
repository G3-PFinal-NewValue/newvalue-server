import { sequelize } from '../config/database.js'; // ajusta la ruta según tu estructura
import SpecialityModel from '../models/SpecialityModel.js';

const seedSpecialities = async () => {
  try {
    await sequelize.sync(); // asegúrate de que las tablas existan

    await SpecialityModel.bulkCreate([
      { name: 'Terapia Cognitivo - Conductual' },
      { name: 'Ansiedad y Estrés' },
      { name: 'Depresión' },
      { name: 'Terapia de Pareja' },
      { name: 'Mindfulness' },
      { name: 'Duelo' },
      { name: 'Trastornos del Sueño' },
    ]);

    console.log('✅ Especialidades insertadas correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al insertar especialidades:', error);
    process.exit(1);
  }
};

seedSpecialities();
