var fs = require("fs");

var express = require("express");
var router = express.Router();

router.post("/get", function (req, res) {

    var exists = fs.existsSync("./aboutUs.json");
    if(exists){
        var text = fs.readFileSync('./aboutUs.json','utf-8');
        res.send(text);
    }else{
        res.json({});
    }


});

router.post("/set",function(req,res){
    var body = req.body;

    fs.writeFile('./aboutUs.json',JSON.stringify(body),function(){
        res.json({code:1,msg:"ok"});
    });


});


module.exports = router;