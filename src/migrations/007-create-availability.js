import { DataTypes } from "sequelize";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("availability", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    psychologist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "psychologist",
        key: "user_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    weekday: {
      type: DataTypes.SMALLINT,
      allowNull: true, // ahora opcional según el modelo
    },

    specific_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("available", "booked", "unavailable"),
      allowNull: false,
      defaultValue: "available",
    },

    is_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("availability");
}
