const Sequelize = require('sequelize');
const sequelize = require("./sequelize");
const admin = sequelize.define("admin",{
    id:{type: Sequelize.INTEGER, autoIncrement: true ,primaryKey: true},
    username:{type: Sequelize.STRING},
    password:{type: Sequelize.STRING}
});

module.exports = admin;

admin.sync();
