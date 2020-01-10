define([],function(){
    return {

        get:function(currentNum,pageSize,total){

            var pagination = [];
            var totalPages = Math.ceil(total /pageSize);
            var range = 3;

            if((currentNum - range) <= 2){
                for(var i = 1;i<currentNum + 1;i++){
                    pagination.push(i);
                }
            }else if((currentNum - range) > 2){
                pagination.push(1);
                pagination.push("..");
                for(var i = 0;i<range;i++){
                    pagination.push((currentNum -range + i));
                }
                pagination.push(currentNum);
            }

            if((totalPages - currentNum) > (range+1)){
                for(var i = 1;i<range + 1;i++){
                    pagination.push((currentNum+i));
                }
                pagination.push("...");
                pagination.push(totalPages);
            }else if((totalPages - currentNum) <= (range+1)){
                for(var i = currentNum + 1;i<=totalPages;i++){
                    pagination.push(i);
                }
            }
            return pagination;

        }
    }
});