const { Sequelize } = require('sequelize');

const sequelizeInstance = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
});

module.exports = sequelizeInstance;