var https = require("https");
var express = require("express")
//var swig = require("swig");
var multer = require('multer');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var accessToken = require("./accessToken");


global.imgFolder = "../image";
global.tokens = {};
var options = {
    key:fs.readFileSync("./214891281530857.key"),
    cert:fs.readFileSync("./214891281530857.pem")
}

var app = express();
app.use(express.static("./public"));
app.use("/image",express.static(global.imgFolder));
app.use(cookieParser());


/*app.engine("html",swig.renderFile);
app.set("views","./public");
app.set("view engine","html");
swig.setDefaults({cache:false});*/


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(multer({dest:global.imgFolder}).any());
fs.exists(global.imgFolder, function(exists) {
   if(!exists){
       fs.mkdir(global.imgFolder);
   }
});



// app.use(function(req,res,next){
//     var token = req.cookies.token;
//     if(global.tokens[token] == null){
//         res.json({code:10,msg:"请退出重新登录"});
//     }else{
//         next();
//     }
// });
app.use("/login",require("./router/login"));
app.use("/test",require("./router/test"));
app.use("/same",require("./router/sameImg"));
app.use("/similar",require("./router/similarImg"));
app.use("/file",require("./router/file"));
app.use("/category",require("./router/category"));
app.use("/product",require("./router/product"));
app.use("/style",require("./router/style"));
app.use("/order",require("./router/order"));
app.use("/user",require("./router/user"));
app.use("/address",require("./router/address"));
app.use("/theme",require("./router/theme"));
app.use("/themeProduct",require("./router/themeProduct"));
app.use("/lead",require("./router/lead"));
app.use("/wechat",require("./router/wechat"));
app.use("/aboutUs",require("./router/aboutUs"));

app.use("/bookCate",require("./router/book/category"));
app.use("/book",require("./router/book/book"));
app.use("/chapter",require("./router/book/chapter"));
app.use("/suggest",require("./router/book/suggest"));


app.listen(80);
https.createServer(options,app).listen(443);
accessToken.getAccessToken();