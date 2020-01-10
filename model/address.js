const Sequelize = require('sequelize');
const sequelize = require("./sequelize");
const address = sequelize.define("address",{
    id:{type: Sequelize.INTEGER, autoIncrement: true ,primaryKey: true},
    userId:{type: Sequelize.INTEGER,field:"user_id"},
    openid:{type:Sequelize.STRING},
    name:{type:Sequelize.STRING},
    phone:{type:Sequelize.STRING},
    addr:{type:Sequelize.STRING}
});

module.exports = address;

address.sync();
