'use strict';
import { DataTypes } from 'sequelize';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('session', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'appointment',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    recommendations: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    materials_sent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'session',
    timestamps: true,      
    paranoid: true,    
    underscored: true,  
  });
  // índice útil para consultas por cita
  await queryInterface.addIndex('session', ['appointment_id']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('session');
}
