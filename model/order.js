const Sequelize = require('sequelize');
const sequelize = require("./sequelize");
const order = sequelize.define("order",{
    id:{type: Sequelize.INTEGER, autoIncrement: true ,primaryKey: true},
    userId:{type: Sequelize.INTEGER,field:"user_id"},
    openid:{type: Sequelize.STRING},
    productId:{type: Sequelize.INTEGER,field:"product_id"},
    styleId:{type: Sequelize.INTEGER,field:"style_id"},
    sizeId:{type: Sequelize.INTEGER,field:"size_id"},
    num:{type: Sequelize.INTEGER},
    desc:{type: Sequelize.STRING},
    status:{type:Sequelize.INTEGER},
    tradeNo:{type: Sequelize.STRING,field:"trade_no"},
    price:{type:Sequelize.FLOAT(10,2)},
    createTime:{type:Sequelize.BIGINT,field:"create_time"}
});

module.exports = order;

order.sync();