export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("user", [
    {
      googleId: "", 
      email: "coramind.newvalue@gmail.com",
      name: "Administrador",
      avatar: null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("user", { email: "coramind.newvalue@gmail.com" });
}
