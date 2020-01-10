const Sequelize = require('sequelize');
const sequelize = require("./sequelize");
const chapter = sequelize.define("chapter",{
    id:{type: Sequelize.INTEGER, autoIncrement: true ,primaryKey: true},
    bookId:{type:Sequelize.INTEGER,field:"book_id"},
    name:{type: Sequelize.STRING},
    original:{type: Sequelize.TEXT('medium')},
    translation:{type: Sequelize.TEXT('medium')},
    order:{type:Sequelize.INTEGER}
});

module.exports = chapter;

chapter.sync();