var fs = require("fs");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var product = require("../model/product");
var category = require("../model/category");
var style = require("../model/style");
var size = require("../model/size");

product.belongsTo(category,{constraints: false});
product.hasMany(style);
product.hasMany(size);

var styleService = require("../service/styleService");
var sizeService = require("../service/sizeService");

var express = require("express");
var router = express.Router();

router.post("/add",function(req,res){
    var body = req.body;
    product.findOrCreate({where:{name:body.name},defaults:body})
        .spread(function(ca,created){
            if(created){
                styleService.createMany(body.styles,ca.id);
                sizeService.createMany(body.sizes,ca.id);
                res.json({code:1,msg:"添加成功"});
            }else{
                res.json({code:0,msg:"已存在该商品，不要重复添加"});
            }
        });

});

router.post("/find",function(req,res){
    var body = req.body;
    var where = {};
    if(body.categoryId != null){
        where.categoryId = parseInt(body.categoryId);
    }
    if(body.name != null){
        where.name = {[Op.like]: '%'+body.name+'%'};
    }
    if(body.status != null){
        where.status = parseInt(body.status);
    }

    if(body.pageSize == null){
        body.pageSize = 10;
    }
    product.count({where: where}).then(function(c) {
         product.findAll({
            where: where,
            include: [category,style,size],
            order:[['id', 'DESC']],
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
    product.findOne({
        where:{id:id},
        include: [category,style,size]
    }).then(function(p){
        res.json({code:1,data:p});
    });
});

router.post("/update",function(req,res){
    var body = req.body;
    var id = parseInt(body.id);




    //修改款式
    styleService.updateMany(body.styles,id);
    //修改尺码
    sizeService.updateMany(body.sizes,id);


    product.findById(parseInt(body.id)).then(function(p){
        //清理垃圾图片
        var oldImgList = p.img.split(",");
        var newImgList = body.img.split(",");
        for(var o of oldImgList){
            var flag = false;
            for(var n of newImgList){
                if(o == n){
                    flag = true;
                }
            }
            if(!flag){
                var exists = fs.existsSync(global.imgFolder + "/" + o);
                if(exists){
                    fs.unlinkSync(global.imgFolder + "/" + o);
                }
            }
        }




        //修改数据
        var param = Object.assign({}, body);
        delete param.id;

        product.update(param, {
            where: {
                id: body.id
            }
        }).then(function(){


            res.json({code:1,msg:"修改成功"});
        }).catch(function(e){
            res.json({code:0,msg:e});
        });
    });


});

router.post("/delete",function(req,res){
    var body = req.body;
    var id = parseInt(body.id);

    //删除款式
    styleService.deleteMany(id);
    //删除尺码
    sizeService.deleteMany(id);


    product.findById(id).then(function(p){
        //删除垃圾图片
        var imgList = p.img.split(",");
        for(var i = 0;i<imgList.length;i++){
            var exists = fs.existsSync(global.imgFolder + "/"+imgList[i]);
            if(exists){
                fs.unlinkSync(global.imgFolder + "/"+imgList[i]);
            }
        }
        //删除数据
        product.destroy({where: {id:id}}).then(function(data){
            res.json({code:1,msg:"删除成功"});
        }).catch(function(e){
            res.json({code:0,msg:e});
        });
    }).catch(function(e){
        res.json({code:0,msg:e});
    });


});

module.exports = router;