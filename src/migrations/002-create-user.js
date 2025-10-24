import { DataTypes } from 'sequelize';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('NOW()')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('NOW()')
    }
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
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('user_role');
  await queryInterface.dropTable('user');
}
