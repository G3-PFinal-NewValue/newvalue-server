export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('appointment', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    patient_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    psychologist_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'user', 
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    date: {
      type: Sequelize.DATE,
      allowNull: false,
    },

    duration_minutes: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 50,
    },

    status: {
      type: Sequelize.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },

    notes: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    session_link: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },

    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },

    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  });

  // índices recomendados (para consultas por fecha o relaciones)
  await queryInterface.addIndex('appointment', ['psychologist_id', 'date']);
  await queryInterface.addIndex('appointment', ['patient_id', 'date']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('appointment');
}
