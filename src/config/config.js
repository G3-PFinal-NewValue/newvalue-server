import 'dotenv/config';

export default {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    migrationStorageTableName: 'sequelize_meta',
    seederStorageTableName: 'sequelize_data',
    dialectOptions: {
      ssl: process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com') ? {
        require: true,
        rejectUnauthorized: true
      } : false
    }
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    migrationStorageTableName: 'sequelize_meta',
    seederStorageTableName: 'sequelize_data',
    logging: false,
    dialectOptions: { 
      ssl: process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com') ? {
        require: true,
        rejectUnauthorized: true
      } : false
    }
  },
};