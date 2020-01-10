const Sequelize = require('sequelize');
const sequelize = require("./sequelize");
const style = sequelize.define("style",{
    id:{type: Sequelize.INTEGER, autoIncrement: true ,primaryKey: true},
    productId:{type: Sequelize.INTEGER,field:"product_id"},
    name:{type: Sequelize.STRING},
    img:{type:Sequelize.STRING(500)}
});

module.exports = style;

style.sync();