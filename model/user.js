const Sequelize = require('sequelize');
const sequelize = require("./sequelize");
const user = sequelize.define("user",{
    id:{type: Sequelize.INTEGER, autoIncrement: true ,primaryKey: true},
    name:{type: Sequelize.STRING},
    openid:{type: Sequelize.STRING}
});

module.exports = user;

user.sync();
