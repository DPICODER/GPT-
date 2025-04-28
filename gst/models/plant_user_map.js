const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const plantUser = sequelize.define('plantUser', {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    plant_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    plant_name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    user_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    assigned_on:{
        type:DataTypes.DATEONLY,
        allowNull:false,
    },
    revoked_on:{
        type:DataTypes.DATEONLY,
        allowNull:true,
    }
  }, {
    tableName: 'plantUser', // The name of the table in the database
    timestamps: false, // Disable timestamps if your table doesn't have `createdAt` and `updatedAt`
  });

module.exports = {plantUser};