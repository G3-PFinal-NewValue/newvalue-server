export async function up(queryInterface, Sequelize) {
    const languages = [
        { name: "Español", code: "es" },
        { name: "Inglés", code: "en" },
        { name: "Francés", code: "fr" },
        { name: "Alemán", code: "de" },
        { name: "Portugués", code: "pt" },
        { name: "Italiano", code: "it" },
        { name: "Chino (Mandarín)", code: "zh" },
        { name: "Japonés", code: "ja" },
        { name: "Ruso", code: "ru" },
        { name: "Árabe", code: "ar" },
    ];

    await queryInterface.bulkInsert("language", languages, {});
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("language", null, {});
}
