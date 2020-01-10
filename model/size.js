const Sequelize = require('sequelize');
const sequelize = require("./sequelize");
const size = sequelize.define("size",{
    id:{type: Sequelize.INTEGER, autoIncrement: true ,primaryKey: true},
    productId:{type: Sequelize.INTEGER,field:"product_id"},
    name:{type: Sequelize.STRING}
});

module.exports = size;

size.sync();