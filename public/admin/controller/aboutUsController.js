define(["layer"],function(layer){
    return function(){
        var vm = new Vue({
            el:"#aboutUsApp",
            data:{
                company:{

                }


            },
            methods:{
                getCompany:function(){
                    var self = this;
                    ajaxPost(
                        "/aboutUs/get",
                        {},
                        function(res){

                            self.company = res;

                        },"json"
                    );
                },
                setCompany:function(){
                    ajaxPost(
                        "/aboutUs/set",
                        this.company,
                        function(res){
                            if(res.code == 1){
                                layer.msg("设置成功");
                            }
                        },"json"
                    );
                }

            }
        });

        vm.getCompany();

        $(".menu").removeClass("active");
        $(".menu[data-menu='aboutUs']").addClass("active");
    }
});
