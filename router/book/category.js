const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var category = require("../../model/book/category");


var express = require("express");
var router = express.Router();


router.post("/find",function(req,res){
    var body = req.body;
    var where = {};
    if(body.name != null){
        where.name = {[Op.like]: '%'+body.name+'%'};
    }

    if(body.pageSize == null){
        body.pageSize = 10;
    }

    category.findAndCountAll({
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