const Sequelize = require('sequelize');
const sequelize = require("./sequelize");
const suggest = sequelize.define("suggest",{
    id:{type: Sequelize.INTEGER, autoIncrement: true ,primaryKey: true},
    desc:{type: Sequelize.STRING(1000)},
    time:{type: Sequelize.STRING},
    createTime:{type:Sequelize.BIGINT,field:"create_time"}


});

module.exports = suggest;

suggest.sync();
