define(["layer","pagination"],function(layer,pagination){
    return function(){
        var vm = new Vue({
            el:"#leadApp",
            data:{
                lead:{

                },
                leadList:[],
                imgList:[],

                categoryList:[],
                product:{},
                productList:[],
                isUpdate:false,

                isErr:false,
                errMsg:"",
                productPageNum:1,
                productPage:[],
                pageSize:10
            },
            methods:{
                toAdd:function(){
                    this.isErr = false;
                    this.isUpdate = false;
                    this.lead = {};
                    this.imgList = [];

                    $('#myModal').modal();
                },
                toUpdate:function(id){
                    this.isErr = false;
                    this.isUpdate = true;
                    for(var i = 0;i<this.leadList.length;i++){
                        var temp = this.leadList[i];
                        if(temp.id == id){
                            this.lead = Object.assign({}, temp);
                            this.imgList = this.lead.img.split(",");

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

                    var param = Object.assign({},this.lead);
                    param.img = this.imgList.toString();

                    if(param.img == null || param.img == ""){
                        this.isErr = true;
                        this.errMsg = "请上传图片"
                        return;
                    }
                    if(param.productId == null){
                        this.isErr = true;
                        this.errMsg = "请选择商品"
                        return;
                    }




                    var self = this;
                    layer.load();
                    ajaxPost(
                        "/lead/add",
                        param,
                        function(res){
                            layer.closeAll('loading');
                            if(res.code == 1){
                                $('#myModal').modal('hide');
                                self.getLeadList();
                            }else{

                            }

                            layer.alert(res.msg);

                        },"json"
                    );
                },
                update:function(){
                    this.lead.img = this.imgList.toString();
                    var param = Object.assign({},this.lead);

                    if(param.img == null || param.img == ""){
                        this.isErr = true;
                        this.errMsg = "请上传图片"
                        return;
                    }

                    if(param.productId == null){
                        this.isErr = true;
                        this.errMsg = "请选择商品"
                        return;
                    }



                    var self = this;
                    layer.load();
                    ajaxPost(
                        "/lead/update",
                        param,
                        function(res){
                            layer.closeAll('loading');
                            if(res.code == 1){

                                $('#myModal').modal('hide');
                                layer.msg("修改成功");

                                self.getLeadList();
                            }else{
                                layer.msg(res.msg);
                            }
                        },"json"
                    );


                },
                getLeadList:function(){
                    var self = this;
                    ajaxPost(
                        "/lead/find",
                        {},
                        function(res){
                            if(res.code == 1){
                                self.leadList = res.data;
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
                                "/lead/delete",
                                {id:id},
                                function(res){
                                    layer.msg(res.msg);
                                    if(res.code == 1){
                                        self.getLeadList();
                                    }

                                },"json"
                            );

                            for(var i = 0;i<self.leadList.length;i++){
                                var temp = self.leadList[i];
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


                                self.productList = productList;
                            }else{
                                layer.msg(res.msg);
                            }

                        },"json"
                    );
                },

                toAddProduct:function(){
                    $('#addProduct').modal();
                    this.getProductList(1);
                },

                addProduct:function(productId){
                    for(var p of this.productList){
                        if(p.id == productId){
                            this.lead.productId = productId;
                            //this.lead.product = Object.assign({},p);
                            this.$set(this.lead,"product",Object.assign({},p))
                        }
                    }

                    $('#addProduct').modal('hide');

                }

            }
        });

        vm.getLeadList();
        vm.getCategoryList();

        $(".menu").removeClass("active");
        $(".menu[data-menu='lead']").addClass("active");
    }
});
