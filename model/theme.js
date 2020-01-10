const Sequelize = require('sequelize');
const sequelize = require("./sequelize");
const theme = sequelize.define("theme",{
    id:{type: Sequelize.INTEGER, autoIncrement: true ,primaryKey: true},
    name:{type: Sequelize.STRING},
    img:{type:Sequelize.STRING(500)}
});

module.exports = theme;

theme.sync();
