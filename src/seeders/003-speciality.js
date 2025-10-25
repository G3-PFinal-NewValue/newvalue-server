'use strict';

/** @type {import('sequelize-cli').Seeder} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('speciality', [
      { name: 'Terapia Conginitivo - Conductual', created_at: new Date(), updated_at: new Date() },
      { name: 'Ansiedad y Estrés', created_at: new Date(), updated_at: new Date() },
      { name: 'Depresión', created_at: new Date(), updated_at: new Date() },
      { name: 'Terapia de Pareja', created_at: new Date(), updated_at: new Date() },
      { name: 'Mindfulness', created_at: new Date(), updated_at: new Date() },
      { name: 'Duelo', created_at: new Date(), updated_at: new Date() },
      { name: 'Trastornos del Sueño', created_at: new Date(), updated_at: new Date() }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('speciality', null, {});
  }
};
