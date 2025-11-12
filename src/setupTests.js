import { sequelize } from './config/database.js'; 
import { afterAll, afterEach, beforeAll } from '@jest/globals'; 

const NODE_ENV = process.env.NODE_ENV || 'development';
const DB_NAME = NODE_ENV === 'test' ? process.env.DB_TEST_NAME : process.env.DB_DEV_NAME;

// Hook 1: Conectar antes de todos los tests
beforeAll(async () => {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    
    // 🔧 DESACTIVAR foreign keys temporalmente
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Forzar sincronización (elimina y recrea tablas)
    await sequelize.sync({ force: true }); 
    
    // 🔧 REACTIVAR foreign keys
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log(`\n🟢 Conexión de prueba a la base de datos [${DB_NAME}] establecida y sincronizada.`);
  } catch (error) {
    console.error(`\n🔴 Falló la conexión a la base de datos de prueba [${DB_NAME}]:`, error);
    process.exit(1);
  }
}, 30000); // Timeout de 30 segundos


// Hook 2: Limpiar después de CADA test (Aislamiento de Pruebas)
afterEach(async () => {
  try {
    // Desactivar foreign keys para limpieza
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    const models = Object.values(sequelize.models);
    
    // Limpiar todas las tablas
    for (const model of models) {
      if (model.tableName) {
        await model.destroy({ 
          where: {},
          truncate: true,
          force: true 
        });
      }
    }
    
    // Reactivar foreign keys
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  } catch (error) {
    console.error('⚠️ Error limpiando base de datos:', error);
  }
});


// Hook 3: Desconectar después de todos los tests
afterAll(async () => {
  try {
    await sequelize.close();
    console.log('✅ Conexión de base de datos de prueba cerrada.\n');
  } catch (error) {
    console.error('⚠️ Error cerrando conexión:', error);
  }
});