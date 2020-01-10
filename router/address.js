const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var address = require("../model/address");
var user = require("../model/user");
address.belongsTo(user,{foreignKey: 'openid',targetKey:"openid",constraints: false});


var express = require("express");
var router = express.Router();

router.post("/add", function (req, res) {
    var body = req.body;

    address.create(body).then(function(){
        res.json({code:1,msg:"添加成功"});
    }).catch(function(){
        res.json({code:0,msg:"添加失败"});
    });

});

router.post("/find",function(req,res){
    var body = req.body;
    var where = {};
    if(body.openid != null){
        where.openid = body.openid;
    }
    if(body.name != null){
        where.name = {[Op.like]: '%'+body.name+'%'};
    }
    if(body.phone != null){
        where.phone = {[Op.like]: '%'+body.phone+'%'};
    }

    if(body.pageSize == null){
        body.pageSize = 10;
    }

    address.findAndCountAll({
        where: where,
        include:[user],
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

    address.update(param, {
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

    address.destroy({where: {id:id}})
        .then(function(){

            res.json({code:1,msg:"删除成功"});
        }).catch(function(e){
        res.json({code:0,msg:e});
    });
});


module.exports = router;