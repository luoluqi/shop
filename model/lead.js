const Sequelize = require('sequelize');
const sequelize = require("./sequelize");
const lead = sequelize.define("lead",{
    id:{type: Sequelize.INTEGER, autoIncrement: true ,primaryKey: true},
    productId:{type: Sequelize.INTEGER,field:"product_id"},
    img:{type:Sequelize.STRING}

});

module.exports = lead;

lead.sync();
