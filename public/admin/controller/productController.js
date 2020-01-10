define(["layer","pagination"],function(layer,pagination){
    return function(){
        var vm = new Vue({
            el:"#productApp",
            data:{
                product:{

                },
                imgList:[],
                styleList:[],

                query:{

                },
                categoryList:[],
                isUpdate:false,
                productList:[],
                isErr:false,
                errMsg:"",
                pageNum:1,
                pageSize:10,
                page:[]
            },
            methods:{
                toAdd:function(){
                    this.isErr = false;
                    this.isUpdate = false;
                    this.product = {status:1};
                    this.imgList = [];
                    this.styleList = [];

                    $('#myModal').modal();
                },
                toUpdate:function(id){
                    this.isErr = false;
                    this.isUpdate = true;
                    for(var i = 0;i<this.productList.length;i++){
                        var temp = this.productList[i];
                        if(temp.id == id){
                            this.product = Object.assign({}, temp);
                            this.imgList = this.product.img.split(",");
                            this.styleList = this.product.styles;

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

                    var param = Object.assign({},this.product);
                    param.img = this.imgList.toString();
                    param.styles = this.styleList;

                    if(param.name == null || param.name == ""){
                        this.isErr = true;
                        this.errMsg = "请输入名称"
                        return;
                    }
                    if(param.categoryId == null || param.categoryId == ""){
                        this.isErr = true;
                        this.errMsg = "请选择分类"
                        return;
                    }
                    if(param.img == null || param.img == ""){
                        this.isErr = true;
                        this.errMsg = "请上传图片"
                        return;
                    }
                    for(var s of param.styles){
                        if(s.img == "" || s.name == ""){
                            this.isErr = true;
                            this.errMsg = "请检查“型号/款式”是否填写完整";

                            return;
                        }
                    }
                    for(var s of param.sizes){
                        if(s.name == ""){
                            this.isErr = true;
                            this.errMsg = "请检查“尺码”是否填写完整";

                            return;
                        }
                    }
                    if(param.price == null || param.price == ""){
                        this.isErr = true;
                        this.errMsg = "请填写价格"
                        return;
                    }
                    if(param.desc == null || param.desc == ""){
                        this.isErr = true;
                        this.errMsg = "请填写描述"
                        return;
                    }

                    var self = this;


                    layer.load();
                    ajaxJson(
                        "/product/add",
                        param,
                        function(res){
                            layer.closeAll('loading');
                            if(res.code == 1){
                                $('#myModal').modal('hide');
                                self.getProductList(1);
                            }else{

                            }
                            layer.alert(res.msg);
                        }
                    )


                },
                update:function(){
                    this.product.img = this.imgList.toString();
                    this.product.styles = this.styleList;
                    var param = Object.assign({},this.product);



                    if(param.name == null || param.name == ""){
                        this.isErr = true;
                        this.errMsg = "请输入名称"
                        return;
                    }
                    if(param.categoryId == null || param.categoryId == ""){
                        this.isErr = true;
                        this.errMsg = "请选择分类"
                        return;
                    }
                    if(param.img == null || param.img == ""){
                        this.isErr = true;
                        this.errMsg = "请上传图片"
                        return;
                    }
                    for(var s of param.styles){
                        if(s.img == "" || s.name == ""){
                            this.isErr = true;
                            this.errMsg = "请检查“型号/款式”是否填写完整";

                            return;
                        }
                    }
                    for(var s of param.sizes){
                        if(s.name == ""){
                            this.isErr = true;
                            this.errMsg = "请检查“尺码”是否填写完整";

                            return;
                        }
                    }
                    if(param.price == null || param.price == ""){
                        this.isErr = true;
                        this.errMsg = "请填写价格"
                        return;
                    }
                    if(param.desc == null || param.desc == ""){
                        this.isErr = true;
                        this.errMsg = "请填写描述"
                        return;
                    }
                    var self = this;
                    layer.load();
                    ajaxJson(
                        "/product/update",
                        param,
                        function (res) {
                            layer.closeAll('loading');
                            if(res.code == 1){

                                $('#myModal').modal('hide');
                                layer.msg("修改成功");

                                for(var i = 0;i<self.productList.length;i++){
                                    var temp = self.productList[i];
                                    if(temp.id == self.product.id){
                                        for(var c of  self.categoryList){
                                            if(c.id == self.product.categoryId){
                                                self.product.category = c;
                                            }
                                        }
                                        self.$set(self.productList, i, Object.assign({}, self.product))
                                    }
                                }
                            }else{
                                layer.msg(res.msg);
                            }
                        }
                    )


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
                getProductList:function(pageNum){
                    if(typeof pageNum == "string" || pageNum < 1 || pageNum > this.page[this.page.length -1]){
                        return;
                    }

                    this.pageNum = pageNum;
                    var self = this;
                    var param = this.getParam();
                    param.pageNum = pageNum;
                    param.pageSize = this.pageSize;
                    ajaxPost(
                        "/product/find",
                        param,
                        function(res){
                            if(res.code == 1){
                                self.page = pagination.get(self.pageNum, self.pageSize,res.data.count);
                                self.productList = res.data.rows;
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
                            //debugger
                            console.log(res);
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
                                "/product/delete",
                                {id:id},
                                function(res){
                                    layer.msg(res.msg);
                                    if(res.code == 1){
                                        self.getProductList(self.pageNum);
                                    }

                                },"json"
                            );
                        },function(){

                        });

                },
                addStyle:function(){
                    this.styleList.push({img:"",name:""});
                },

                deleteStyle:function(index){
                    this.styleList.splice(index,1);
                },

                changeStyleName:function(index,event){
                    this.styleList[index].name = $.trim(event.target.value);
                },

                addSize:function(){
                    if(this.product.sizes == null){
                        this.$set(this.product,"sizes",[]);
                    }
                    this.product.sizes.push({name:""});

                },
                deleteSize:function(index){
                    this.product.sizes.splice(index,1);
                },
                changeSizeName:function(index,event){
                    this.product.sizes[index].name = $.trim(event.target.value);
                },

                uploadStyleImg:function(index){
                    var self = this;
                    $("#uploadStyleImg").click();
                    $("#uploadStyleImg").off("change");
                    $("#uploadStyleImg").change(function(){
                        var files = document.getElementById("uploadStyleImg").files;
                        for(var i =0;i<files.length;i++){
                            var file = files[i];

                            var fileType = file.name.substring(file.name.lastIndexOf(".")).toUpperCase();
                            if(!(fileType == ".JPG" || fileType == ".PNG" || fileType == ".JPEG")){
                                layer.msg("请选择jpg、png文件");
                                return;
                            }
                        }

                        var $parent = $("#uploadStyleImg").parent();
                        $("#uploadStyleImg").remove();
                        $($parent).append('<input id="uploadStyleImg" type="file" style="display: none;"  />');

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

                                        self.styleList[index].img = data.url;
                                       //self.$set(self.styleList,index,self.styleList[index]);

                                    },
                                    error: function(err) {
                                        console.log(err);
                                    }
                                });
                            }
                        }

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
                                        self.imgList.push(data.url);


                                    },
                                    error: function(err) {
                                        console.log(err);
                                    }
                                });
                            }
                        }




                    });
                }

            }
        });

        vm.getCategoryList();
        vm.getProductList(1);

        $(".menu").removeClass("active");
        $(".menu[data-menu='product']").addClass("active");
    }
});
