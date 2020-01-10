var admin = require("../model/admin");
var express = require("express");
var crypto = require("crypto");

var router = express.Router();

router.post("/", function (req, res) {


    var body = req.body;

    admin.findOne({where:body}).then(function(ad){
        if(ad == null){
            res.json({code:0,msg:"用户名或密码错误"});
        }else{
            var sha1 = crypto.createHash('sha1');
            sha1.update(ad.username + ad.password);
            var token = sha1.digest('hex');
            global.tokens[token] = 1;
            res.cookie('token', token, { path: '/',maxAge: 3600 * 1000 * 24 * 3 });

            res.json({code:1,msg:"登录成功"});
        }
    });

});

module.exports = router;