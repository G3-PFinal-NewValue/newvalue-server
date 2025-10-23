import { DataTypes } from "sequelize";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('session', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    appointment_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'appointment',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    summary: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    recommendations: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    materials_sent: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },

    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },

    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  });

 await queryInterface.addIndex('session', ['appointment_id']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('session');
}