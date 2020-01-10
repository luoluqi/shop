const Sequelize = require('sequelize');
const sequelize = require("./sequelize");
const category = sequelize.define("category",{
    id:{type: Sequelize.INTEGER, autoIncrement: true ,primaryKey: true},
    name:{type: Sequelize.STRING},
    order:{type: Sequelize.INTEGER}

});

module.exports = category;

category.sync();
