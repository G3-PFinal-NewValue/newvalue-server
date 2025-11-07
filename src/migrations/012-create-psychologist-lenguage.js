"use strict";

export async function up(queryInterface, Sequelize) {
    // Crear tabla "language"
    await queryInterface.createTable("language", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true,
        },
        code: {
            type: Sequelize.STRING(5),
            allowNull: true,
            unique: true,
        },
    });

    // Crear tabla intermedia "psychologist_language"
    await queryInterface.createTable("psychologist_language", {
        psychologist_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "psychologist",
                key: "user_id", // clave primaria del psicólogo
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        language_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "language",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
    });
}

export async function down(queryInterface) {
    await queryInterface.dropTable("psychologist_language");
    await queryInterface.dropTable("language");
}
