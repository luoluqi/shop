var request = require("request");
var wxUtil = require("../util/wxUtil");
var express = require("express");
var router = express.Router();

router.post("/login", function (req, res) {
    var body = req.body;
    var code = body.code;

    request("https://api.weixin.qq.com/sns/jscode2session?appid="+wxUtil.appid+"&secret="+wxUtil.appSecret+"&js_code="+code+"&grant_type=authorization_code",
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
               res.send(body);
            }
    });

});



router.post("/payCallback",function(req,res){
   var xml = "";
   req.on("data",function(chunk){
       xml += chunk;
   });
   req.on("end",function(){
      if(wxUtil.checkSignByXml(xml)){
        console.log("支付结果通知，检查sign通过");
        //执行逻辑操作
      }else{
          console.log("支付结果通知，检查sign不通过");
      }
      var str = "<xml>\n" +
          "  <return_code><![CDATA[SUCCESS]]></return_code>\n" +
          "  <return_msg><![CDATA[OK]]></return_msg>\n" +
          "</xml>";

       res.send(str);
   })

});


module.exports = router;