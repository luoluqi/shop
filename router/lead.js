var lead = require("../model/lead");
var product = require("../model/product");
lead.belongsTo(product,{constraints: false});

var express = require("express");


var router = express.Router();

router.post("/add", function (req, res) {
    var body = req.body;
    lead.create(body).then(function(){
        res.json({code:1,msg:"添加成功"});
    }).catch(function(e){
        res.json({code:0,msg:e});
    });

});

router.post("/find",function(req,res){
    var body = req.body;
    lead.findAll({
        include:[product],
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

    lead.update(param, {
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

    lead.destroy({where: {id:id}})
        .then(function(){

            res.json({code:1,msg:"删除成功"});
        }).catch(function(e){
        res.json({code:0,msg:e});
    });
});

module.exports = router;