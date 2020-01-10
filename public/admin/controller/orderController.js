define(["pagination","layer","dateFilter"],function(pagination,layer){
    return function(){
        var vm = new Vue({
            el:"#orderApp",
            data:{
                order:{},
                query:{

                },
                orderList:[],
                pageNum:1,
                pageSize:10,
                page:[]
            },
            methods:{
                getParam:function(){

                    var _query = Object.assign({},this.query);
                   if(_query.beginTime != null){
                       _query.beginTime = new Date(_query.beginTime);
                       _query.beginTime.setHours(0);
                       _query.beginTime.setMinutes(0);
                       _query.beginTime.setSeconds(0);
                       _query.beginTime = _query.beginTime.getTime();

                   }
                   if(_query.endTime != null){

                       _query.endTime = new Date(_query.endTime);
                       _query.endTime.setHours(0);
                       _query.endTime.setMinutes(0);
                       _query.endTime.setSeconds(0);
                       _query.endTime = _query.endTime.getTime() + 3600 * 1000 *24;
                   }



                    var param = _query;
                    for(var key in param){
                        if(param[key] == "" ||  isNaN(param[key])){
                            delete param[key];
                        }
                    }

                    return param;
                },
                getOrderList:function(pageNum){

                    if(typeof pageNum == "string" || pageNum < 1 || pageNum > this.page[this.page.length -1]){
                        return;
                    }

                    this.pageNum = pageNum;
                    var self = this;
                    var param = this.getParam();
                    param.pageNum = pageNum;
                    param.pageSize = this.pageSize;
                    ajaxPost(
                        "/order/find",
                        param,
                        function(res){
                            if(res.code == 1){
                                self.page = pagination.get(self.pageNum, self.pageSize,res.data.count);

                                var list = res.data.rows;
                                for(var i = list.length - 1;i>=0;i--){
                                    if(list[i].product == null){
                                        list.splice(i,1);
                                    }
                                }

                                for(var i = 0;i<list.length;i++){
                                    list[i].product.cover = list[i].product.img.split(",")[0];
                                    if(list[i].style){
                                        list[i].style.cover = list[i].style.img.split(",")[0];
                                    }


                                }
                                self.orderList = list;
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
                                "/order/delete",
                                {id:id},
                                function(res){
                                    layer.msg(res.msg);
                                    if(res.code == 1){
                                        self.getOrderList(self.pageNum);
                                    }

                                },"json"
                            );
                        },function(){

                        });

                }
            }
        });

        vm.getOrderList(1);

        $(".menu").removeClass("active");
        $(".menu[data-menu='order']").addClass("active");
    }
});
