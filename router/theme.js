const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var theme = require("../model/theme");
var themeProduct = require("../model/themeProduct");
var product = require("../model/product");
var category = require("../model/category");
theme.hasMany(themeProduct,{ as: 'themeProducts' });
themeProduct.belongsTo(product,{constraints: false});
product.belongsTo(category,{constraints: false});


var express = require("express");
var router = express.Router();

router.post("/add", function (req, res) {
    var body = req.body;
    theme.findOrCreate({where:{name:body.name},defaults:body})
        .spread(function(ca,created){
            if(created){
                res.json({code:1,msg:"添加成功"});
            }else{
                res.json({code:0,msg:"已存在该主题，不要重复添加"});
            }
        });

});

router.post("/find",function(req,res){
    var body = req.body;
    var where = {};
    if(body.name != null){
        where.name = {[Op.like]: '%'+body.name+'%'};
    }


    if(body.pageSize == null){
        body.pageSize = 10;
    }

    theme.count({where: where}).then(function(c){
        theme.findAll({
            where: where,
            include:[
                {model:themeProduct,as:'themeProducts',include:[
                        {model:product,include:[category]}
                    ]}
            ],
            order:[['id', 'DESC']],
            offset: (body.pageNum - 1) * body.pageSize,
            limit: parseInt(body.pageSize)
        }).then(function(data){
            res.json({code:1,data:{count:c,rows:data}});
        }).catch(function(e){
            res.json({code:0,msg:e});
        });
    });

});

router.post("/update",function(req,res){
    var body = req.body;

    var param = Object.assign({}, body);

    delete param.id;

    theme.update(param, {
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

    theme.destroy({where: {id:id}})
        .then(function(){

            res.json({code:1,msg:"删除成功"});
        }).catch(function(e){
        res.json({code:0,msg:e});
    });
});


module.exports = router;