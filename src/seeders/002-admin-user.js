export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert("user", [
    {
      // googleId: "", 
      email: "coramind.newvalue@gmail.com",
      first_name: "Admin",
      last_name: "Cora Mind",
      avatar: "https://res.cloudinary.com/dkm0ahny1/image/upload/v1761208562/coramind_logo_wndauq.svg",
      status: "active",
      role_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("user", { email: "coramind.newvalue@gmail.com" });
}
