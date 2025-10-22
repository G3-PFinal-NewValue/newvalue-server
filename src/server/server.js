const app = require('./app');
const {sequelize} = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 4000;

// sequelize.sync({ alter: true })
sequelize.sync()
  .then(() => {
    console.log('✅ Database connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ Database connection failed:', err));
