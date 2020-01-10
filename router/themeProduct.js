const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var themeProduct = require("../model/themeProduct");
var product = require("../model/product");
themeProduct.belongsTo(product,{constraints: false});


var express = require("express");
var router = express.Router();

router.post("/add", function (req, res) {
    var body = req.body;
    themeProduct.findOrCreate({where:{themeId:body.themeId,productId:body.productId},defaults:body})
        .spread(function(ca,created){
            if(created){
                res.json({code:1,msg:"添加成功"});
            }else{
                res.json({code:0,msg:"已存在该主题商品，不要重复添加"});
            }
        });

});

router.post("/find",function(req,res){
    var body = req.body;
    var where = {};
    if(body.themeId != null){
        where.themeId = body.themeId;
    }


    if(body.pageSize == null){
        body.pageSize = 10;
    }

    themeProduct.findAndCountAll({
        where: where,
        include:[product],
        order:[['id', 'DESC']],
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

    themeProduct.findOne({where:{themeId:param.themeId,productId:param.productId}}).then(function(ca){
        if(ca == null){
            themeProduct.update(param, {
                where: {
                    id: body.id//查询条件
                }
            }).then(function(){

                res.json({code:1,msg:"修改成功"});
            }).catch(function(e){
                res.json({code:0,msg:e});
            });
        }else{
            res.json({code:0,msg:"已存在该主题商品"});
        }
    });
});

router.post("/delete",function(req,res){
    var body = req.body;


    themeProduct.destroy({where: {themeId:body.themeId,productId:body.productId}})
        .then(function(){

            res.json({code:1,msg:"删除成功"});
        }).catch(function(e){
        res.json({code:0,msg:e});
    });
});


module.exports = router;