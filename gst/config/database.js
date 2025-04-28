require('dotenv').config();
const {Sequelize} = require('sequelize');

const sequelize = new Sequelize({
    host:process.env.DB_HOST,
    username:process.env.DB_USER_NAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    dialect:"mysql",
    logging:false
});


sequelize.authenticate()
.then(()=>{
    sequelize.sync()
    .then(()=>{
        console.log("DB connected and Synced Successfully");
    })
    .catch(err=>console.error("Error Establishing connection to Database !!!!",err));
}).catch(err=>console.error("Error Establishing connection to Database !!!!",err));


module.exports = sequelize;