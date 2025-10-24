export async function up(queryInterface, Sequelize) {
  // Obtener el ID del usuario recién insertado
  const [users] = await queryInterface.sequelize.query(
    "SELECT id FROM `user` WHERE email = 'coramind.newvalue@gmail.com';"
  );

  if (users.length > 0) {
    const userId = users[0].id;

    await queryInterface.bulkInsert("user_role", [
      {
        user_id: userId,
        role_id: 1
      }
    ]);
  }
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("user_role", null, {});
}