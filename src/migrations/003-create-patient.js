export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('patient', {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    birth_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    therapy_goals: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    medical_history: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    photo: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    status: {
      type: Sequelize.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('patient');
}
