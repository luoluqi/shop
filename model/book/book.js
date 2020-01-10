const Sequelize = require('sequelize');
const sequelize = require("./sequelize");
const book = sequelize.define("book",{
    id:{type: Sequelize.INTEGER, autoIncrement: true ,primaryKey: true},
    categoryId:{type:Sequelize.INTEGER,field:"category_id"},
    name:{type: Sequelize.STRING},
    author:{type: Sequelize.STRING},
    desc:{type: Sequelize.STRING(2550)},
    order:{type: Sequelize.INTEGER}

});

module.exports = book;

book.sync();
