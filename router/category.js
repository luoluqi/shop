const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var category = require("../model/category");


var express = require("express");
var router = express.Router();

router.post("/add", function (req, res) {
    var body = req.body;
    category.findOrCreate({where:{name:body.name},defaults:body})
        .spread(function(ca,created){
            if(created){
                res.json({code:1,msg:"添加成功"});
            }else{
                res.json({code:0,msg:"已存在该分类，不要重复添加"});
            }
        });

});

router.post("/find",function(req,res){
    var body = req.body;
    var where = {};
    if(body.name != null){
        where.name = {[Op.like]: '%'+body.name+'%'};
    }
    if(body.status != null){
        where.status = body.status;
    }

    if(body.pageSize == null){
        body.pageSize = 10;
    }

    category.findAndCountAll({
        where: where,
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

    category.findOne({where:{name:param.name}}).then(function(ca){
        if(ca == null){
            category.update(param, {
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

    category.destroy({where: {id:id}})
    .then(function(){

        res.json({code:1,msg:"删除成功"});
    }).catch(function(e){
         res.json({code:0,msg:e});
    });
});


module.exports = router;