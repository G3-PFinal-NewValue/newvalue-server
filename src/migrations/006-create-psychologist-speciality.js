'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('psychologist_specialty', {
      psychologistId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'psychologist',
          key: 'user_id'
        },
        onDelete: 'CASCADE'
      },
      specialtyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'specialty',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Clave primaria compuesta para evitar duplicados
    await queryInterface.addConstraint('psychologist_specialty', {
      fields: ['psychologistId', 'specialtyId'],
      type: 'primary key',
      name: 'pk_psychologist_specialty'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('psychologist_specialty');
  }
};