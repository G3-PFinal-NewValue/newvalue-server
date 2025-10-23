import { DataTypes } from 'sequelize';

export async function up(queryInterface, Sequelize) {
  // Crear tabla Users
  await queryInterface.createTable('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Campos de autenticación
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: true, // null si el usuario usa login con Google
    },

    // Campos personales
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    // Google login
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Estado y fecha
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      allowNull: false,
      defaultValue: 'active',
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },

    // Marcas de tiempo opcionales
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    },
  });

  // Crear tabla intermedia user_roles
  await queryInterface.createTable('user_role', {
    user_id: {
      type: DataTypes.INTEGER,
      references: { model: 'user', key: 'id' },
      onDelete: 'CASCADE'
    },
    role_id: {
      type: DataTypes.INTEGER,
      references: { model: 'role', key: 'id' },
      onDelete: 'CASCADE'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('NOW()')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('NOW()')
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('user_role');
  await queryInterface.dropTable('user');
}
