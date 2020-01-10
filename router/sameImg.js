var fs = require("fs");

var request = require('request');

var express = require("express");
var router = express.Router();

router.post("/find", function (req, res) {

    var file = req.files[0];
    var filePath = file.destination +"/" + file.filename;
    var data = "";
    var readable=fs.createReadStream(filePath,{
        highWaterMark:6
    });
    readable.on('data',function(chunk){
        data += chunk.toString("base64");
    });
    readable.on('end',function(){
        console.log('读取文件结束');
        console.log(data);
        fs.unlink(filePath,function(){});
        request.post(
            {
                url:'https://aip.baidubce.com/rest/2.0/realtime_search/same_hq/search?access_token='+global.accessToken,
                form:{image:data}
            },
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                    body = JSON.parse(body);
                    res.json(body);
                }
            })

    });

});

module.exports = router;