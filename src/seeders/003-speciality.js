import SpecialityModel from '../models/SpecialityModel.js';

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('speciality', [
    { name: 'Terapia Cognitivo - Conductual' },
    { name: 'Ansiedad y Estrés' },
    { name: 'Depresión' },
    { name: 'Terapia de Pareja' },
    { name: 'Mindfulness' },
    { name: 'Duelo' },
    { name: 'Trastornos del Sueño' },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('speciality', null, {});
}
