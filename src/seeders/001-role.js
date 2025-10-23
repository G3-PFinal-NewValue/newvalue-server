export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("role", [
    { id: 1, name: "admin" },
    { id: 2, name: "editor" },
    { id: 3, name: "viewer" }
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("role", null, {});
}
