const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Constants = sequelize.define('Constants', {
    key_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    c_value_1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    c_value_2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    c_value_3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    c_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    }
  }, {
    tableName: 'constants', // The name of the table in the database
    timestamps: false, // Disable timestamps if your table doesn't have `createdAt` and `updatedAt`
  });

module.exports = {Constants};