const Sequelize = require('sequelize');
const sequelize = require("./sequelize");
const themeProduct = sequelize.define("theme_product",{
    id:{type: Sequelize.INTEGER, autoIncrement: true ,primaryKey: true},
    themeId:{type: Sequelize.INTEGER,field:"theme_id"},
    productId:{type:Sequelize.INTEGER,field:"product_id"}
});

module.exports = themeProduct;

themeProduct.sync();