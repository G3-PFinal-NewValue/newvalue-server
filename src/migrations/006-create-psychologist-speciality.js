import { DataTypes } from "sequelize";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("psychologist_speciality", {
    psychologist_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'psychologist',
        key: 'user_id'
      },
      onDelete: 'CASCADE'
    },

    specialty_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'speciality',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("psychologist_speciality");
}