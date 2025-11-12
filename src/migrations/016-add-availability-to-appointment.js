"use strict";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("appointment", "availability_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "availability",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("appointment", "availability_id");
  },
};
