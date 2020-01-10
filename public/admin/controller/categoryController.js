define(["layer","pagination"],function(layer,pagination){
    return function(){
        var vm = new Vue({
            el:"#categoryApp",
            data:{
                category:{
                    name:"",
                    status:1
                },
                query:{
                    name:""
                },
                isUpdate:false,
                list:[],
                isErr:false,
                errMsg:"",
                pageNum:1,
                pageSize:10,
                page:[]
            },
            methods:{
                toAdd:function(){
                    this.category = {name:"",status:1};
                    this.isUpdate = false;
                    $('#myModal').modal();
                },
                toUpdate:function(id){

                    for(var i = 0;i<this.list.length;i++){
                        var temp = this.list[i];
                        if(temp.id == id){
                            this.category =  Object.assign({}, temp);
                            //this.category = temp;
                        }
                    }
                    this.isUpdate = true;
                    $('#myModal').modal();
                },
                submit:function(){
                    if( this.isUpdate){
                        this.update();
                    }else{
                        this.add();
                    }


                },
                getList:function(pageNum){

                    if(typeof pageNum == "string" || pageNum < 1 || pageNum > this.page[this.page.length -1]){
                        return;
                    }

                    this.pageNum = pageNum;
                    var self = this;
                    var param = this.getParam();
                    param.pageNum = pageNum;
                    param.pageSize = this.pageSize;
                    ajaxPost(
                        "/category/find",
                        param,
                        function(res){
                            console.log(res);

                            if(res.code == 1){
                                self.page = pagination.get(self.pageNum, self.pageSize,res.data.count);
                                self.list = res.data.rows;
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

                add:function(){
                    if(this.category.name == "" || this.category.name == null){
                        this.isErr = true;
                        this.errMsg = "请输入名称"
                        return;
                    }
                    var self = this;
                    ajaxPost(
                        "/category/add",
                        this.category,
                        function(res){
                            layer.alert(res.msg);
                            $('#myModal').modal('hide');
                            if(res.code == 1){

                                self.getList(1);
                            }else{

                            }


                        },"json"
                    );
                },
                update:function(){
                    if(this.category.name == ""){
                        this.isErr = true;
                        this.errMsg = "请输入名称"
                        return;
                    }
                    var self = this;
                    ajaxPost(
                        "/category/update",
                        this.category,
                        function(res){
                            $('#myModal').modal('hide');
                            layer.msg(res.msg);
                            if(res.code == 1){



                                for(var i = 0;i<self.list.length;i++){
                                    var temp = self.list[i];
                                    if(temp.id == self.category.id){

                                        self.$set(self.list, i, Object.assign({}, self.category))
                                    }
                                }
                            }else{

                            }
                        },"json"
                    );
                },
                del:function(id){
                    var self = this;
                    layer.confirm("您确定删除吗",{icon:7,btn:["确定","取消"]},
                        function(){
                            ajaxPost(
                                "/category/delete",
                                {id:id},
                                function(res){
                                    layer.msg(res.msg);
                                    if(res.code == 1){

                                        self.getList(self.pageNum);
                                    }else{

                                    }
                                },"json"
                            );
                        },function(){

                        });

                }
            }
        });

        vm.getList(1);

        $(".menu").removeClass("active");
        $(".menu[data-menu='category']").addClass("active");
    }
});
