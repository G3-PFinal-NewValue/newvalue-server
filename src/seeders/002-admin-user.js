import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export async function up(queryInterface, Sequelize) {
  const plainPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!plainPassword) {
    throw new Error("SEED_ADMIN_PASSWORD no definida en el .env");
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await queryInterface.bulkInsert(
    "user",
    [
      {
        email: "coramind.newvalue@gmail.com",
        password_hash: hashedPassword,
        first_name: "Admin",
        last_name: "Cora Mind",
        phone: "+34 600000000",
        postal_code: "28001",
        province: "Madrid",
        full_address: "Sin dirección aún",
        city: "Madrid",
        country: "España",
        dni_nie_cif: "X0000000X",
        status: "active",
        role_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    { ignoreDuplicates: true }
  );
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("user", { email: "coramind.newvalue@gmail.com" });
}
