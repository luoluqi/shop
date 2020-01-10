var size = require("../model/size");

var sizeService = {
    createMany:function(sizes,productId){
        for(var i = 0; i<sizes.length; i++){
            sizes[i].productId = productId;
            size.create(sizes[i]).then();
        }
    },
    deleteMany:function(productId){
        size.destroy({where: {productId:productId}}).then();
    },
    updateMany:function(sizes,productId){
        size.destroy({where: {productId:productId}}).then(function(){
            for(var i = 0; i<sizes.length; i++){
                sizes[i].productId = productId;
                size.create(sizes[i]).then();
            }
        });
    }
}

module.exports = sizeService;
