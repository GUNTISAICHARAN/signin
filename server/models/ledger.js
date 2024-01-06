// models/ledgerData.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const LedgerData = sequelize.define('LedgerData', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  group: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = LedgerData;
