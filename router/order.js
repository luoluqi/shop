var wxUtil = require("../util/wxUtil");
var request = require("request");

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var express = require("express");
var router = express.Router();

var order = require("../model/order");
var product = require("../model/product");
var style = require("../model/style");
var size = require("../model/size");
order.belongsTo(product,{constraints: false});
order.belongsTo(style,{constraints: false});
order.belongsTo(size,{constraints: false});

router.post("/add",function(req,res){
    var body = req.body;
    body.createTime = new Date().getTime();
    order.create(body).then(function(){
        res.json({code:1,msg:"添加成功"});
    }).catch(function(e){
        res.json({code:0,msg:e});
    });
});

router.post("/placeOrder",function(req,res){
    var orderList = req.body;
    var tradeNo = new Date().getTime() + wxUtil.getNonceStr();
    var totalFee = 0;
    var newOrderList = [];
    for(var i = 0;i<orderList.length;i++){
        var temp = orderList[i];
        temp.tradeNo = tradeNo;
        temp.createTime = new Date().getTime();

        order.create(temp).then(function(or){
            newOrderList.push(or);
            if(newOrderList.length == orderList.length){
                //微信支付统一下单
                /*
                var ip = wxUtil.getIp(req);
                totalFee += or.price;
                wxUtil.unifyOrder({ body:"购买",
                    out_trade_no:tradeNo,
                    total_fee:totalFee,
                    spbill_create_ip:ip,
                    notify_url:"https://" + req.headers.host + "/wechat/payCallback",
                    openid:or.openid
                    },
                    function(aginSign){

                });*/
                res.json(newOrderList);
            }
        });
    }
});



router.post("/find",function(req,res){

    var body = req.body;
    var where = {};
    if(body.userId != null){
        where.userId = parseInt(body.userId);
    }

    if(body.openid != null){
        where.openid = body.openid;
    }


    if(body.beginTime != null){
        where.createTime = {};
        var obj  = {[Op.gte] :  parseInt(body.beginTime)};

        where.createTime = Object.assign(where.createTime,obj);
    }

    if(body.endTime != null){
        if(where.createTime == null){
            where.createTime = {};
        }
        var obj = {[Op.lte] :  parseInt(body.endTime)};
        where.createTime =  Object.assign(where.createTime,obj);
    }

    if(body.status != null){
        where.status = parseInt(body.status);
    }

    if(body.pageSize == null){
        body.pageSize = 10;
    }

    order.findAndCountAll({
        where: where,
        include: [product,style,size],
        order:[['createTime', body.order == null ? 'ASC' : body.order]],
        offset: (body.pageNum - 1) * body.pageSize,
        limit: parseInt(body.pageSize)
    }).then(function(data){
        res.json({code:1,data:data});
    }).catch(function(e){
        res.json({code:0,msg:e});
    });
});

router.post("/update",function(req,res){

    var body = req.body;

    var param = Object.assign({}, body);

    delete param.id;

    order.update(param, {
        where: {
            id: body.id//查询条件
        }
    }).then(function(){

        res.json({code:1,msg:"修改成功"});
    }).catch(function(e){
        res.json({code:0,msg:e});
    });

});

router.post("/delete",function(req,res){
    var body = req.body;
    var id = parseInt(body.id);

    order.destroy({where: {id:id}})
    .then(function(){

        res.json({code:1,msg:"删除成功"});
    }).catch(function(e){
        res.json({code:0,msg:e});
    });
});




module.exports = router;