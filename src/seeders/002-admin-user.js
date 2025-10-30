import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export async function up(queryInterface, Sequelize) {
  const plainPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!plainPassword) {
    throw new Error("SEED_ADMIN_PASSWORD no definida en el .env");
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await queryInterface.bulkInsert("user", [
    {
      email: "coramind.newvalue@gmail.com",
      password_hash: hashedPassword,
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