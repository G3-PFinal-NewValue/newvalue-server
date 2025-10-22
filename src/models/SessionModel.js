const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SessionModel = sequelize.define('session', {
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

}, {
    tableName: 'session',
    timestamps: true,
    underscored: true, // Use snake_case for automatically added attributes
});

module.exports = SessionModel;