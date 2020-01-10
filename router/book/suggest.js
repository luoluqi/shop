const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var suggest = require("../../model/book/suggest");


var express = require("express");
var router = express.Router();

router.post("/add", function (req, res) {
    var body = req.body;

    var now = new Date();
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();


    body.createTime = now.getTime();
    body.time = year + "-"+month+"-"+date+" "+h+":"+m+":" + s;
    suggest.create(body).then(function(su){
        res.json({code:1,msg:"添加成功"});
    });

});

router.post("/find",function(req,res){
    var body = req.body;
    var where = {};


    if(body.pageSize == null){
        body.pageSize = 10;
    }

    suggest.findAndCountAll({
        where: where,
        order:[['id', 'ASC']],
        offset: (body.pageNum - 1) * body.pageSize,
        limit: parseInt(body.pageSize)
    }).then(function(data){
        res.json({code:1,data:data});
    }).catch(function(e){
        res.json({code:0,msg:e});
    });
});



module.exports = router;