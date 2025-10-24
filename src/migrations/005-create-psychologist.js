import { DataTypes } from "sequelize";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("psychologist", {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "user", 
        key: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },

    license_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },

    speciality: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    professional_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    photo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },

    validated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active"
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
  await queryInterface.dropTable("psychologist");
}