export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('user', 'avatar', {
    type: Sequelize.STRING,
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('user', 'avatar');
}