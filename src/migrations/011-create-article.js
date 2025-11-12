import { DataTypes } from "sequelize";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("article", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "category",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },

    // 🔹 NUEVO: Campo para imagen de Cloudinary
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },

    published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    published_at: {
      type: DataTypes.DATE,
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
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("article");
}