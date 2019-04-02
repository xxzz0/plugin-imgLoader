function ImgLoader(){
    this.basePath="";
    this.crossOrigin="";
    this.loadType=['_src'];//自定义路径名['_src','_src1','img/i1.jpg'……], 名称带 . 或 / 默认当成路径
    this.time=5000;//单张图片最大加载时间
    this.onProgress=function(){};
    this.onComplete=function(){};

    this._imgList={};
}
ImgLoader.prototype.isAp=function(path){
    //是否为绝对路径
    if(path.indexOf('//')==-1){
        return false;
    }else{
        return true;
    };
}
ImgLoader.prototype.isPath=function(str){
    //判断是否为路径
    if(/.|\//i.test(str)){
        return false;
    }else{
        return false;
    }
}
ImgLoader.prototype.load=function(){
    var that=this;
    var loadItem=this._createQueue(this.loadType);
    var total=loadItem.length,
        loaded=0,
        isOvertime=false,//是否超时
        timer,
        time=this.time;//单张图片最大加载时间
    if(total==0){
        that.onComplete();
    }else{
        timer=setTimeout(function(){
            isOvertime=true;
            that.onComplete();
        },time*total);
        for(var i=0;i<total;i++){
            this._loadOnce(loadItem[i],loading);
        };
    }
    function loading(){
        loaded++;
        var plan=Math.ceil(loaded/total * 100);
        that.onProgress(plan);
        if(plan==100&&!isOvertime) {
            clearTimeout(timer);
            that.onComplete();
        }
    }
}
ImgLoader.prototype._createQueue=function(loadType){
    var that=this;
    var loadItem=[];
    for(var i=0;i<loadType.length;i++){
        if(that.isPath(loadType[i])){
            var img=new Image();
            if(that.crossOrigin){
                img.crossOrigin=that.crossOrigin;
            }
            var path=loadType[i];
            loadItem.push({
                tag:img,
                src:that.isAp(path)?path:that.basePath+path
            });
            that._imgList[path]=img;
        }else{
            var $aImg=$('img['+loadType[i]+']');
            $aImg.each(function(index,dom){
                if(that.crossOrigin){
                    dom.crossOrigin=that.crossOrigin;
                }
                var path=$(dom).attr(loadType[i]);
                loadItem.push({
                    tag:dom,
                    src:that.isAp(path)?path:that.basePath+path
                });
                that._imgList[path]=dom;
            });
        }
    };
    return loadItem;
}
ImgLoader.prototype._loadOnce=function(item,callback){
    var tag=item.tag;
    tag.src=item.src;
    if (tag.complete) {
        callback();
    } else {
        tag.onload = function(){
            tag.onload=null;
            callback();
        };
        tag.onerror =function(){
            tag.onerror=null;
            callback();
        }
    }
}
ImgLoader.prototype.getImg=function(path){
    //获取图片对象
    return this._imgList[path];
}
//###################
// //调用方法一
// var imgLoader=new ImgLoader();
// imgLoader.basePath="";
// imgLoader.crossOrigin="anonymous";
// imgLoader.loadType=['_src'];
// //加载中
// imgLoader.onProgress=function(plan){
//      console.log(plan);
// }
// //加载完成
// imgLoader.onComplete=function(){
//     setTimeout(function () {
//         $('#page_loading').moveOut();
//     }, 400);
// }
// //开始加载
// imgLoader.load();

// //调用方法二 (图片延迟加载)
// var imgLoader2=new ImgLoader();
// imgLoader2.basePath="";
// imgLoader2.loadType=['_src0'];
// imgLoader2.load();