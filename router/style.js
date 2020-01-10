var fs = require("fs");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var style = require("../model/style");

var express = require("express");
var router = express.Router();

router.post("/add",function(req,res){
    var body = req.body;
    style.findOrCreate({where:{productId:body.productId,name:body.name},defaults:{img:body.img}})
        .spread(function(st,created){
            if(created){
                res.json({code:1,msg:"添加成功",data:st});
            }else{
                res.json({code:0,msg:"已存在该分类，不要重复添加"});
            }
        });
});

router.post("/find",function(req,res){

    var body = req.body;


    style.findAll({
        where: body,
        order:[['id', 'DESC']]
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

    style.findOne({where:{productId:param.productId,name:param.name}}).then(function(ca){
        if(ca == null){
            style.update(param, {
                where: {
                    id: body.id//查询条件
                }
            }).then(function(){

                res.json({code:1,msg:"修改成功"});
            }).catch(function(e){
                res.json({code:0,msg:e});
            });
        }else{
            res.json({code:0,msg:"已存在该分类"});
        }
    });

});

router.post("/delete",function(req,res){

    var body = req.body;
    var id = parseInt(body.id);

    style.destroy({where: {id:id}})
        .then(function(){
            res.json({code:1,msg:"删除成功"});
        }).catch(function(e){
        res.json({code:0,msg:e});
    });
});

module.exports = router;