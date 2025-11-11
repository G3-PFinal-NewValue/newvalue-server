export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('speciality', [
    { name: 'Terapia Cognitivo - Conductual', deleted_at:null },
    {  name: 'Ansiedad y Estrés', deleted_at:null },
    {  name: 'Depresión', deleted_at:null },
    {  name: 'Terapia de Pareja', deleted_at:null },
    {  name: 'Mindfulness', deleted_at:null},
    { name: 'Duelo', deleted_at:null },
    { name: 'Trastornos del Sueño', deleted_at:null },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('speciality', null, {});
}
