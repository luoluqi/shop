

var express = require("express");
var router = express.Router();

router.post("/",function(req,res){

    var wxUtil = require("../util/wxUtil")
   console.log(wxUtil.getIp(req));
    console.log(req.headers.host);
    console.log(req.originalUrl);


    res.json({code:1,msg:"ok",data:req.body});

});

module.exports = router;