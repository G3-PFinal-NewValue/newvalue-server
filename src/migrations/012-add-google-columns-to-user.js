export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('user', 'google_id', {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('user', 'google_id');
}