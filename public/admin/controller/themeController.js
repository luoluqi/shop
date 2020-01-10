define(["layer","pagination"],function(layer,pagination){
    return function(){
        var vm = new Vue({
            el:"#themeApp",
            data:{
                theme:{

                },
                themeList:[],
                imgList:[],

                query:{

                },
                categoryList:[],
                product:{},
                productList:[],
                isUpdate:false,

                isErr:false,
                errMsg:"",
                themePageNum:1,
                themePage:[],
                productPageNum:1,
                productPage:[],
                pageSize:10
            },
            methods:{
                toAdd:function(){
                    this.isErr = false;
                    this.isUpdate = false;
                    this.theme = {};
                    this.imgList = [];

                    $('#myModal').modal();
                },
                toUpdate:function(id){
                    this.isErr = false;
                    this.isUpdate = true;
                    for(var i = 0;i<this.themeList.length;i++){
                        var temp = this.themeList[i];
                        if(temp.id == id){
                            this.theme = Object.assign({}, temp);
                            this.imgList = this.theme.img.split(",");

                        }
                    }

                    $('#myModal').modal();
                },
                submit:function(){
                    if( this.isUpdate){
                        this.update();
                    }else{
                        this.add();
                    }
                },
                add:function(){

                    var param = Object.assign({},this.theme);
                    param.img = this.imgList.toString();


                    if(param.name == null || param.name == ""){
                        this.isErr = true;
                        this.errMsg = "请输入名称"
                        return;
                    }

                    if(param.img == null || param.img == ""){
                        this.isErr = true;
                        this.errMsg = "请上传图片"
                        return;
                    }


                    var self = this;
                    layer.load();
                    ajaxPost(
                        "/theme/add",
                        param,
                        function(res){
                            layer.closeAll('loading');
                            if(res.code == 1){
                                $('#myModal').modal('hide');
                                self.getThemeList(1);
                            }else{

                            }

                            layer.alert(res.msg);

                        },"json"
                    );
                },
                update:function(){
                    this.theme.img = this.imgList.toString();
                    var param = Object.assign({},this.theme);



                    if(param.name == null || param.name == ""){
                        this.isErr = true;
                        this.errMsg = "请输入名称"
                        return;
                    }

                    if(param.img == null || param.img == ""){
                        this.isErr = true;
                        this.errMsg = "请上传图片"
                        return;
                    }

                    var self = this;
                    layer.load();
                    ajaxPost(
                        "/theme/update",
                        param,
                        function(res){
                            layer.closeAll('loading');
                            if(res.code == 1){

                                $('#myModal').modal('hide');
                                layer.msg("修改成功");

                                for(var i = 0;i<self.themeList.length;i++){
                                    var temp = self.themeList[i];
                                    if(temp.id == self.theme.id){

                                        self.$set(self.themeList, i, Object.assign({}, self.theme));
                                    }
                                }
                            }else{
                                layer.msg(res.msg);
                            }
                        },"json"
                    );


                },
                getParam:function(){

                    var param = Object.assign({}, this.query);
                    for(var key in param){
                        if(param[key] == ""){
                            delete param[key];
                        }
                    }

                    return param;
                },
                getThemeList:function(pageNum){
                    if(typeof pageNum == "string" || pageNum < 1 || pageNum > this.themePage[this.themePage.length -1]){
                        return;
                    }

                    this.themePageNum = pageNum;
                    var self = this;
                    var param = this.getParam();
                    param.pageNum = pageNum;
                    param.pageSize = this.pageSize;
                    ajaxPost(
                        "/theme/find",
                        param,
                        function(res){
                            if(res.code == 1){
                                self.themePage = pagination.get(self.themePageNum, self.pageSize,res.data.count);
                                self.themeList = res.data.rows;
                            }else{
                                layer.msg(res.msg);
                            }

                        },"json"
                    );
                },

                getCategoryList:function(){
                    var self = this;
                    ajaxPost(
                        "/category/find",
                        {pageNum:1,pageSize:100},
                        function(res){
                            if(res.code == 1){
                                self.categoryList = res.data.rows;
                            }else{
                                layer.msg(res.msg);
                            }

                        }
                    );
                },

                deleteImg:function(url){
                    for(var i = 0;i<this.imgList.length;i++){
                        if(this.imgList[i] == url){
                            this.imgList.splice(i,1);
                        }
                    }
                    if(this.isUpdate == false){
                        ajaxPost(
                            "/file/delete",
                            {url:url},
                            function(){

                            },"json"
                        );
                    }
                },

                del:function(id){
                    var self = this;
                    layer.confirm("您确定删除吗",{icon:7,btn:["确定","取消"]},
                        function(){
                            ajaxPost(
                                "/theme/delete",
                                {id:id},
                                function(res){
                                    layer.msg(res.msg);
                                    if(res.code == 1){
                                        self.getThemeList(self.themePageNum);
                                    }

                                },"json"
                            );

                            for(var i = 0;i<self.themeList.length;i++){
                                var temp = self.themeList[i];
                                if(temp.id == id){
                                    ajaxPost(
                                        "/file/delete",
                                        {url:temp.img},
                                        function(){

                                        },"json"
                                    );
                                }
                            }

                        },function(){

                        });
                },

                uploadImg:function(){

                    var self = this;
                    $("#uploadImg").click();

                    $("#uploadImg").off("change");
                    $("#uploadImg").change(function(){

                        var files = document.getElementById("uploadImg").files;
                        for(var i =0;i<files.length;i++){
                            var file = files[i];

                            var fileType = file.name.substring(file.name.lastIndexOf(".")).toUpperCase();
                            if(!(fileType == ".JPG" || fileType == ".PNG" || fileType == ".JPEG")){
                                layer.msg("请选择jpg、png文件");
                                return;
                            }
                        }

                        var $parent = $("#uploadImg").parent();
                        $("#uploadImg").remove();
                        $($parent).append('<input id="uploadImg" data-n="1" multiple="multiple" type="file" style="display: none;"  />');

                        for(var i = 0;i<files.length;i++){
                            var file = files[i];
                            var formData = new FormData();
                            formData.append("uploadfile",file);
                            if(file){

                                $.ajax({
                                    url: "/file/upload",
                                    type: "POST",
                                    async: true,
                                    cache: false,
                                    processData: false,// 告诉jQuery不要去处理发送的数据
                                    contentType: false,// 告诉jQuery不要去设置Content-Type请求头
                                    data: formData,
                                    success: function(data){
                                        //self.imgList[0] = data.url;

                                        self.$set(self.imgList, 0, data.url);
                                    },
                                    error: function(err) {
                                        console.log(err);
                                    }
                                });
                            }
                        }




                    });
                },
                getProductList:function(pageNum){
                    if(typeof pageNum == "string" || pageNum < 1 || pageNum > this.productPage[this.productPage.length -1]){
                        return;
                    }

                    this.productPageNum = pageNum;
                    var self = this;
                    var param = Object.assign({},this.product);
                    for(var key in param){
                        if(param[key] == ""){
                            delete param[key];
                        }
                    }
                    param.pageNum = pageNum;
                    param.pageSize = this.pageSize;
                    ajaxPost(
                        "/product/find",
                        param,
                        function(res){
                            if(res.code == 1){
                                self.productPage = pagination.get(self.productPageNum, self.pageSize,res.data.count);
                                var productList = res.data.rows;

                                for(var p of productList){
                                    p.isHave = false;
                                }
                                for(var p of productList){
                                    for(var t of self.theme.themeProducts){
                                        if(p.id == t.productId){
                                            p.isHave = true;
                                        }
                                    }
                                }
                                self.productList = productList;
                            }else{
                                layer.msg(res.msg);
                            }

                        },"json"
                    );
                },

                toAddProduct:function(id){
                    $('#addProduct').modal();
                    for(var i = 0;i<this.themeList.length;i++){
                        var temp = this.themeList[i];
                        if(temp.id == id){
                            this.theme = Object.assign({}, temp);
                        }
                    }
                    this.getProductList(1);
                },
                addProduct:function(productId){
                    var self = this;
                    var param = {themeId:this.theme.id,productId:productId};

                    ajaxPost(
                        "/themeProduct/add",
                        param,
                        function(res){
                            layer.msg(res.msg);
                            if(res.code == 1){
                                for(var p of self.productList){
                                    if(p.id == productId){
                                        p.isHave = true;
                                        for(var t of self.themeList){
                                            if(t.id == self.theme.id){
                                                t.themeProducts.push({themeId:t.id,productId:p.id,product:p});
                                            }

                                        }
                                    }
                                }
                            }
                        },"json"
                    );
                },
                toLookProduct:function(id){

                    for(var i = 0;i<this.themeList.length;i++){
                        var temp = this.themeList[i];
                        if(temp.id == id){
                            this.theme = Object.assign({}, temp);
                        }
                    }
                    $('#lookProduct').modal();
                },
                delProduct:function(themeId,productId){
                    var self = this;
                    layer.confirm("您确定从《"+this.theme.name+"》移除该商品吗?",{icon:7,btn:["确定","取消"]},
                        function(){
                            ajaxPost(
                                "/themeProduct/delete",
                                {themeId:themeId,productId:productId},
                                function(res){
                                    layer.msg(res.msg);
                                    if(res.code == 1){
                                        for(var i = 0;i<self.theme.themeProducts.length;i++){
                                            var temp = self.theme.themeProducts[i];
                                            if(productId == temp.productId){
                                                self.theme.themeProducts.splice(i,1);
                                            }
                                        }
                                    }
                                },"json"
                            );
                        },function(){

                        });

                }

            }
        });
        vm.getThemeList(1);
        vm.getCategoryList();


        $(".menu").removeClass("active");
        $(".menu[data-menu='theme']").addClass("active");
    }
});
