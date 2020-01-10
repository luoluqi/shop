var fs = require("fs");
var style = require("../model/style");

var styleService = {
    createMany:function(styles,productId){
        for(var i = 0; i<styles.length; i++){
            styles[i].productId = productId;
            style.create(styles[i]).then();
        }
    },
    deleteMany:function(productId){
        //删除款式
        style.findAll({where: {productId:productId}}).then(function(styleList){
            //先删除图片
            for(var i = 0;i<styleList.length;i++){
                var exists = fs.existsSync(global.imgFolder + "/"+styleList[i].img);
                if(exists){
                    fs.unlinkSync(global.imgFolder + "/"+styleList[i].img);
                }
            }
            //再删除数据
            style.destroy({where: {productId:productId}}).then();
        });
    },
    updateMany:function(styles,productId){
        //删除款式
        style.findAll({where: {productId:productId}}).then(function(styleList){
            //先删除图片

           /* for(var i = 0;i<styleList.length;i++){
                var exists = fs.existsSync(global.imgFolder + "/"+styleList[i].img);
                if(exists){
                    fs.unlinkSync(global.imgFolder + "/"+styleList[i].img);
                }
            }*/
            //再删除数据
            style.destroy({where: {productId:productId}}).then(function(){
                for(var i = 0; i<styles.length; i++){
                    styles[i].productId = productId;
                    style.create(styles[i]).then();
                }
            });
        });
    }
}

module.exports = styleService;
