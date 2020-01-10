
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var chapter = require("../../model/book/chapter");


var express = require("express");
var router = express.Router();



router.post("/find",function(req,res){
    var body = req.body;
    var where = {};
    if(body.bookId != null){
        where.bookId = parseInt(body.bookId);
    }
    if(body.name != null){
        where.name = {[Op.like]: '%'+body.name+'%'};
    }

    if(body.pageSize == null){
        body.pageSize = 10;
    }
    chapter.count({where: where}).then(function(c) {
        chapter.findAll({
            where: where,
            attributes:["id","name"],
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
    chapter.findOne({
        where:{id:id}

    }).then(function(p){
        res.json({code:1,data:p});
    });
});



module.exports = router;