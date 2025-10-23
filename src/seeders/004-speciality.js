'use strict';

/** @type {import('sequelize-cli').Seeder} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('specialty', [
      { name: 'Terapia Conginitivo - Conductual', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ansiedad y Estrés', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Depresión', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Terapia de Pareja', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Mindfulness', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Duelo', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Trastornos del Sueño', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('specialty', null, {});
  }
};
