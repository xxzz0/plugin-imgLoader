/**
 * @class ImgLoader 图片加载
 * @method load 开始加载
 * @method getImg 获取图片对象
 * @property {string} basePath  基础路径
 * @property {string} crossOrigin 源
 * @property {array} loadList 加载列表['src','src1','img/i1.jpg'……]；名称带 . 或 / 默认当成路径加载；其他值通过data-*获取元素加载，并且data-*不能含有- 和 大写字母
 * @property {number} time 单张图片最大加载时间
 * @property {function} onProgress 加载进度
 * @property {function} onComplete 加载完成
 */
function ImgLoader(){
    this.basePath="";
    this.crossOrigin="";
    this.loadList=['src'];
    this.time=5000;
    this.onProgress=function(){};
    this.onComplete=function(){};
    this._objList={};
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
    if(/\.|\//i.test(str)){
        return true;
    }else{
        return false;
    }
}
ImgLoader.prototype.load=function(){
    var that=this;
    var loadItem=this._createQueue(this.loadList);
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
ImgLoader.prototype._createQueue=function(loadList){
    var that=this;
    var loadItem=[];
    for(var i=0;i<loadList.length;i++){
        if(that.isPath(loadList[i])){
            var img=new Image();
            if(that.crossOrigin){
                img.crossOrigin=that.crossOrigin;
            }
            var path=loadList[i];
            loadItem.push({
                tag:img,
                src:that.isAp(path)?path:that.basePath+path
            });
            that._objList[path]=img;
        }else{
            var datakey=loadList[i];
            var nodeList=document.querySelectorAll("img[data-"+datakey+"]");
            for(var k=0;k<nodeList.length;k++){
                var dom=nodeList[k];
                if(that.crossOrigin){
                    dom.crossOrigin=that.crossOrigin;
                }
                var path=dom.dataset[datakey];
                loadItem.push({
                    tag:dom,
                    src:that.isAp(path)?path:that.basePath+path
                });
                that._objList[path]=dom;
            };
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
    return this._objList[path];
}