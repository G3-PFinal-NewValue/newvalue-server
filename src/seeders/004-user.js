export async function up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user', [
        {
            first_name: 'Paciente',
            last_name: 'Prueba',
            email: 'paciente@prueba.com',
            phone: '123456789',
            postal_code: '12345',
            province: 'Prueba',
            full_address: 'Prueba',
            city: 'Prueba',
            country: 'Prueba',
            dni_nie_cif: '12345678A',
            
            role_id: 3,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            first_name: 'Psicologo',
            last_name: 'Prueba',
            email: 'psicologo@prueba.com',
            phone: '123456789',
            postal_code: '12345',
            province: 'Prueba',
            full_address: 'Prueba',
            city: 'Prueba',
            country: 'Prueba',
            dni_nie_cif: '12345678A',
            role_id: 2,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            first_name: 'Admin',
            last_name: 'Prueba',
            email: 'admin@prueba.com',
            phone: '123456789',
            postal_code: '12345',
            province: 'Prueba',
            full_address: 'Prueba',
            city: 'Prueba',
            country: 'Prueba',
            dni_nie_cif: '12345678A',
            role_id: 1,
            created_at: new Date(),
            updated_at: new Date(),
        },
    ]);
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
}
