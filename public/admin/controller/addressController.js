define(["layer","pagination"],function(layer,pagination){
    return function(){
        var vm = new Vue({
            el:"#addressApp",
            data:{
                query:{

                },

                list:[],

                pageNum:1,
                pageSize:10,
                page:[]
            },
            methods:{
                getParam:function(){
                    var param = Object.assign({}, this.query);
                    for(var key in param){
                        if(param[key] == ""){
                            delete param[key];
                        }
                    }

                    return param;
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
                        "/address/find",
                        param,
                        function(res){

                            if(res.code == 1){
                                self.page = pagination.get(self.pageNum, self.pageSize,res.data.count);
                                self.list = res.data.rows;
                            }else{
                                layer.msg(res.msg);
                            }

                        },"json"
                    );
                },
                del:function(id){
                    var self = this;
                    layer.confirm("您确定删除吗",{icon:7,btn:["确定","取消"]},
                        function(){
                            ajaxPost(
                                "/address/delete",
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
        $(".menu[data-menu='address']").addClass("active");
    }
});
