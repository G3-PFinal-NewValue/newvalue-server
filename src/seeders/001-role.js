export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert(
    "role",
    [
      { id: 1, name: "admin" },
      { id: 2, name: "psychologist" },
      { id: 3, name: "patient" },
      { id: 4, name: "pending" },
    ],
    { ignoreDuplicates: true }
  );
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("role", null, {});
}
