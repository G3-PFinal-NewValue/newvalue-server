export async function up(queryInterface, Sequelize) {
  console.log("🚀 Ejecutando seed de categorías...");

  const categories = [
    { name: 'Mindfulness', description: 'Categoría de mindfulness' },
    { name: 'Estrés', description: 'Categoría de manejo de estrés' },
    { name: 'Terapia', description: 'Categoría de terapia' },
    { name: 'Salud Mental', description: 'Categoría de salud mental' },
    { name: 'Bienestar', description: 'Categoría de bienestar' },
    { name: 'Ansiedad', description: 'Categoría de ansiedad' },
    { name: 'Comunicación', description: 'Categoría de comunicación' },
  ];

  await queryInterface.bulkInsert('category', categories);
}

export async function down(queryInterface, Sequelize) {
  console.log('🧹 Revirtiendo seed de categorías...');
  await queryInterface.bulkDelete('category', null, {});
}
