import { sequelize } from './config/database.js'; 
import { afterAll, afterEach, beforeAll } from '@jest/globals'; 


// Hook 1: Conectar antes de todos los tests
beforeAll(async () => {
  try {
    // Usamos sequelize.authenticate() para conectar a la base de datos 'test'
    await sequelize.authenticate();
    
    // Forzamos la sincronización para crear todas las tablas en la base de datos 'test'
    // Esto es crucial porque tu código de inicio lo salta si NODE_ENV='test'.
    await sequelize.sync(); 
    console.log(`\n\n🟢 Conexión de prueba a la base de datos [${process.env.DB_NAME}] establecida y sincronizada.`);
  } catch (error) {
    console.error(`\n\n🔴 Falló la conexión a la base de datos de prueba [${process.env.DB_NAME}]:`, error);
    process.exit(1);
  }
});


// Hook 2: Limpiar después de CADA test (Aislamiento de Pruebas)
afterEach(async () => {
  const models = sequelize.models;
  const promises = [];
  
  // Vaciar todas las tablas para que el siguiente test empiece limpio
  for (const modelName in models) {
    if (models[modelName].tableName) { 
        // Usar TRUNCATE con CASCADE es la forma más segura para MySQL/TiDB
        promises.push(models[modelName].destroy({ truncate: { cascade: true } }));
    }
  }
  await Promise.all(promises);
});


// Hook 3: Desconectar después de todos los tests
afterAll(async () => {
  await sequelize.close();
  console.log('✅ Conexión de base de datos de prueba cerrada.');
});