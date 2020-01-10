var version = "v=20009";
require.config({

   // urlArgs: version,
    paths: {
        "csstool":"http://cdn.bootcss.com/require-css/0.1.10/css.min",
        "jquery":"http://cdn.bootcss.com/jquery/1.12.4/jquery.min",
        "jquery.cookie":"https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie",
        "layer":"http://cdn.bootcss.com/layer/3.1.0/layer",
        "bootstrap":"http://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min",
        "pagination":"js/pagination",
        "dateFilter":"js/dateFilter"



    },
    shim: {

        "layer":["csstool!http://cdn.bootcss.com/layer/3.1.0/theme/default/layer.css"],
        "bootstrap":["jquery"],
        "jquery.cookie":["jquery"]

    }
});

require(["bootstrap","jquery.cookie"],function(){



var router = {
        "/":{
            template:"template/category.html",
            controller:"controller/categoryController.js"
        },

        "/product":{
            template:"template/product.html",
            controller:"controller/productController.js"
        },
        "/order":{
            template:"template/order.html",
            controller:"controller/orderController.js"
        },
        "/user":{
            template:"template/user.html",
            controller:"controller/userController.js"
        },
        "/address":{
            template:"template/address.html",
            controller:"controller/addressController.js"
        },
        "/theme":{
            template:"template/theme.html",
            controller:"controller/themeController.js"
        },
        "/lead":{
            template:"template/lead.html",
            controller:"controller/leadController.js"
        },
        "/aboutUs":{
            template:"template/aboutUs.html",
            controller:"controller/aboutUsController.js"
        },
        templates:{},
        load:function(){
            var hash = location.hash.split("#")[1];

            if(router[hash] == null){
                hash = "/"
            }

            if(router.templates[router[hash].template] == null){
                $.get(
                    router[hash].template,
                    {},
                    function(res){
                        router.templates[router[hash].template] = res;
                        $("[ui-view]").html(res);

                        var a = router[hash].controller;
                        if(router[hash].controller){
                            require([router[hash].controller],function(controller){
                                controller();
                            });

                        }

                    },"text"
                );
            }else{
                $("[ui-view]").html(router.templates[router[hash].template]);

                var a = router[hash].controller;
                if(router[hash].controller){
                    require([router[hash].controller],function(controller){
                        controller();
                    });

                }
            }



        }
    }
    router.load();
    window.onpopstate = function (event) {

        // console.log('location: ' + document.location);
        // console.log('state: ' + JSON.stringify(event.state))

        router.load();
        //history.replaceState({hash: hash}, null, location.hash);
    }

    window.ajaxPost = function(url,param,callback,dataType){
        $.post(
            url,
            param,
            function(res){
                if($.cookie("token") == null){
                    location.href = "/admin/login.html";
                }
                callback.call(this,res);


            },dataType
        );
    }
    window.ajaxJson = function(url,param,callback){
        $.ajax({
            type: "POST",
            url: url,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(param),
            dataType: "json",
            success: function (res) {
                if($.cookie("token") == null){
                    location.href = "/admin/login.html";
                }
                callback.call(this,res);

            },
            error: function (message) {

            }
        });
    }

    window.imgUrl = "/image";


    $(".menu").click(function(){
        $(".menu").removeClass("active");
        $(this).addClass("active");
    });

    if($.cookie("token") == null){
        location.href = "/admin/login.html";
    }
});

