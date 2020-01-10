var request = require('request');
var crypto=require('crypto');
const xml2js = require('xml2js')
const parser = new xml2js.Parser({explicitArray: false, ignoreAttrs: true});
const builder = new xml2js.Builder({
    rootName:'xml',
    xmldec:null})


var wxUtil = {

    appid : "wxfdcde34159243b08",
    appSecret : "9c91824f125e28b6288f3789c04be9b3",

    mch_id:"bbbbb",
    key:"192006250b4c09247ec02edce69f6a2d",
    unifyOrderUrl : 'https://api.mch.weixin.qq.com/pay/unifiedorder',
    queryOrderUrl : 'https://api.mch.weixin.qq.com/pay/orderquery',
    unifyOrder:function(option,callback){
        var self = this;
        var xmlParam = this.getUnifyOrderParam(option);
        request({
            url: this.unifyOrderUrl,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/xml",
            },
            body: xmlParam
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var aginSign = self.aginSign(body);
                callback(aginSign);
            }
        });

    },
    getSign:function(param){
        var arr = [];
        for(var key in param){
            arr.push(key + "=" + param[key]);
        }
        arr.sort();
        var str = arr.join("&");
        var md5=crypto.createHash("md5");
        md5.update(str +"&key="+this.key);
        var sign = md5.digest('hex').toUpperCase();
        return sign;

    },
    getNonceStr:function(){
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        var nonceStr = '';
        for (i = 0; i < 16; i++) {
            nonceStr += $chars.charAt(Math.floor(Math.random() * $chars.length));
        }

        return nonceStr;
    },
    getUnifyOrderParam:function(option){
        var nonce_str = this.getNonceStr();
        var param = {
            appid:this.appid,
            mch_id:this.mch_id,
            nonce_str:nonce_str,
            trade_type:"JSAPI",

            body:option.body,
            out_trade_no:option.out_trade_no,
            total_fee:option.total_fee,
            spbill_create_ip:option.spbill_create_ip,
            notify_url:option.notify_url,
            openid:option.openid

        }
        var sign = this.getSign(param);
        param.sign = sign;



        return builder.buildObject(param);

    },
    aginSign:function(xml){
        var self = this;
        var obj = {};
        parser.parseString(xml, function(err,res){

            var prepay_id =  res.xml.prepay_id;
            var nonce_str = self.getNonceStr();
            var param = {
                appId:self.appid,
                timeStamp:Math.floor(new Date().getTime() / 1000),
                nonce_str:nonce_str,
                package:"prepay_id=" + prepay_id,
                signType:"MD5"

            }
            var paySign = self.getSign(param);
            param.paySign = paySign;
            obj = param;
        })
        return obj;
    },
    checkSignByObj:function(param){
        var aa = Object.assign({},param);
        delete aa.sign;
        var sign = this.getSign(aa);
        return sign == param.sign;
    },
    checkSignByXml:function(xml){
        var flag = false;
        var self = this;
        parser.parseString(xml, function(err,res){
            var obj = res.xml;
            flag = self.checkSignByObj(obj);

        });

        return flag;
    },
    getIp:function(req){
         var ip =  req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
            req.connection.remoteAddress || // 判断 connection 的远程 IP
            req.socket.remoteAddress || // 判断后端的 socket 的 IP
            req.connection.socket.remoteAddress;
         return ip.replace("::ffff:","");
    }
}
module.exports = wxUtil;


