var request = require("request");

global.apiKey = "7UrcizOhp3vcNqRwmURSaE6W";
global.secretKey = "AfXPOKaW7enY6LwlrTN61Ng0toVmoPak";
var accessToken = {
    getAccessToken:function(){
        request.post(
            {
                url:'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id='+global.apiKey+'&client_secret='+global.secretKey,
                form:{}
            },
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                    body = JSON.parse(body);
                    global.accessToken = body.access_token;
                    console.log( global.accessToken);


                    setTimeout(function(){
                        accessToken.getAccessToken();
                    },259200 * 1000);

                }
        })
    }
};

module.exports = accessToken;


