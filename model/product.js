const Sequelize = require('sequelize');
const sequelize = require("./sequelize");
const product = sequelize.define("product",{
    id:{type: Sequelize.INTEGER, autoIncrement: true ,primaryKey: true},
    categoryId:{type: Sequelize.INTEGER,field:"category_id"},
    name:{type: Sequelize.STRING},
    img:{type:Sequelize.STRING(500)},
    price:{type:Sequelize.FLOAT(10,2)},
    desc:{type:Sequelize.STRING(20000)},
    status:{type:Sequelize.INTEGER}
});

module.exports = product;

product.sync();
