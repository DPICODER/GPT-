const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define('User',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    role:{
        type:DataTypes.ENUM,
        values:["user","admin","superUser"],
        defaultValue:"User",
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
    }
})

module.exports = User;


