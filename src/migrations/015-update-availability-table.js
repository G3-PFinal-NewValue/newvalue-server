"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // NUEVO: Agregar campos para el sistema de calendario avanzado
    await queryInterface.addColumn("availability", "specific_date", {
      type: Sequelize.DATEONLY, // Campo para fechas específicas (2024-11-07)
      allowNull: false,
      defaultValue: "2024-01-01", // Valor temporal para datos existentes
    });

    await queryInterface.addColumn("availability", "is_available", {
      type: Sequelize.BOOLEAN, // true = disponible, false = no disponible
      allowNull: false,
      defaultValue: true, // Por defecto, todas las disponibilidades son "disponibles"
    });

    await queryInterface.addColumn("availability", "notes", {
      type: Sequelize.TEXT, // Campo opcional para notas adicionales
      allowNull: true,
    });

    // CAMBIO: Hacer weekday opcional para compatibilidad con datos existentes
    await queryInterface.changeColumn("availability", "weekday", {
      type: Sequelize.SMALLINT,
      allowNull: true, // Ahora es opcional
    });
  },

  async down(queryInterface, Sequelize) {
    // ROLLBACK: Remover los nuevos campos si necesitas revertir
    await queryInterface.removeColumn("availability", "specific_date");
    await queryInterface.removeColumn("availability", "is_available");
    await queryInterface.removeColumn("availability", "notes");

    // ROLLBACK: Volver weekday a requerido
    await queryInterface.changeColumn("availability", "weekday", {
      type: Sequelize.SMALLINT,
      allowNull: false,
    });
  },
};
