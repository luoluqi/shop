
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var book = require("../../model/book/book");
var category = require("../../model/book/category");
book.belongsTo(category,{constraints: false});

var express = require("express");
var router = express.Router();



router.post("/find",function(req,res){
    var body = req.body;
    var where = {};
    if(body.categoryId != null){
        where.categoryId = parseInt(body.categoryId);
    }
    if(body.name != null){
        where.name = {[Op.like]: '%'+body.name+'%'};
    }

    if(body.pageSize == null){
        body.pageSize = 10;
    }
    book.count({where: where}).then(function(c) {
        book.findAll({
            where: where,
            include: [category],
            order:[['order', 'ASC']],
            offset: (body.pageNum - 1) * body.pageSize,
            limit: parseInt(body.pageSize)
        }).then(function(data){
            res.json({code:1,data:{count:c,rows:data}});
        }).catch(function(e){
            res.json({code:0,msg:e});
        });

    })
});

router.post("/findById",function(req,res){
    var id = req.body.id;
    book.findOne({
        where:{id:id},
        include: [category]
    }).then(function(p){
        res.json({code:1,data:p});
    });
});



module.exports = router;