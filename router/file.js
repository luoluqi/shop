var fs = require("fs");

var express = require("express");
var router = express.Router();

router.use("/image", function (req, res) {
    fs.exists(global.imgFolder + req.url, function(exists) {
        if(exists && fs.statSync(global.imgFolder + req.url).isFile()){
            var readable=fs.createReadStream(global.imgFolder + req.url,{
                highWaterMark:6
            });
            readable.pipe(res);
        }else{
            res.send("1111");
        }
    });

});

router.post("/upload",function(req,res){


    var file = req.files[0];
    var fileName = file.originalname;

    fs.renameSync(file.path, file.path + "." + fileName.split(".")[1]);

   res.json({code:1,url:file.filename + "." + fileName.split(".")[1]});
});

router.post("/delete",function(req,res){
    var url = req.body.url;
    var exists = fs.existsSync(global.imgFolder + "/" + url);
    if(exists){
        fs.unlinkSync(global.imgFolder + "/" + url);
    }
    res.json({code:1,msg:"已删除文件"});
});

module.exports = router;