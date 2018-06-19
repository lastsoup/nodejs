/*----------------------------------------
* Copyright (c) 2014 菠萝工作室
* 网站：http://www.0non0.com
* Date: 2014-11-28
* Creater:Cqy
----------------------------------------*/

/*------通用的方法库 by:cqy 2015-2-28------*/

(function () {
    /*------ananas.调用方法和属性-----------*/
    window.ananas = {};
    ananas.VAR = {};
    ananas.CONST = {
        domains: { host: "" }
    };
    /*---ajax封装-------
    例：ananas.ajaxHandler("file/GetImageLists", { type: "TxImage" }).done(function (data) {}).fail(function (res) { });
    ---------------*/
    ananas.ajaxHandler = function (url, param) {
        var _host = ananas.host();
        return $.post(_host + url + "?time=" + (new Date()).getTime(), param).then(function (data) {
            if (data.IsSuccess) {
                return data.BaseData;
            } else {
                return $.Deferred().reject(data);
            }
        }, function (err) {
            // 失败回调
            console.log(err.status); // 打印状态码
        });
    };

    /*------as()调用方法和属性-----------*/
    /*------使用as()调用方法，处理传递参数比较少的控件*/
    window.as = function (q) {
        return new _ananas(q);
    };

    //_ananas对象
    var _ananas = function (q) {
       /* var firstWord= q.substr(0, 1);
        var nq= q.substring(1);
        switch(firstWord)
        {
            case "#":
            this.el = document.getElementById(nq);
                break;
            case ".":
            this.el=document.getElementsByClassName(nq);
                break;
            default:
                this.el = document.getElementById(q);
        }*/
        this.el=x$(q);
    };

    /*---封装start-------*/
    _ananas.prototype.FastTap= function (onTap) {
        for(var i=0;i<this.el.length;i++) {
            var element = this.el[i];
            element.index=i;
            Hammer(element).on("tap", onTap);
        }
    };

    _ananas.prototype.Click= function (onTap) {
        for(var i=0;i<this.el.length;i++) {
            var element = this.el[i];
            element.index=i;
            element.addEventListener('click',onTap,false);

        }
    };

    _ananas.prototype.SearchBox= function () {
        for(var i=0;i<this.el.length;i++) {
            var element = this.el[i];
            element.addEventListener('click', function () {
                this.parentElement.parentElement.className = "searchbar searchbar-active";
            }, false);
            element.addEventListener('focus', function () {
                this.parentElement.parentElement.className = "searchbar searchbar-active";
            }, false);
            element.addEventListener('blur', function () {
                this.parentElement.parentElement.className = "searchbar";
            }, false);
        }
    };

    _ananas.prototype.TabBox= function () {
        for(var i=0;i<this.el.length;i++) {
            var element = this.el[i];
            var tabel=x$(element).find(".swiper-tabs");
            var tablink=x$(element).find(".widget-tab-link");
            var tabsSwiper = new Swiper(tabel, {
                centeredSlides: true,
                onSlideChangeStart : function() {
                    tablink.removeClass('active');
                    x$(tablink[tabsSwiper.activeIndex]).addClass('active');
                }
            });
            as(tablink).FastTap(function () {
                tablink.removeClass('active');
                x$(this).addClass('active');
                tabsSwiper.slideTo(this.index,0);
            });
        }
    };

    _ananas.prototype.InitIscroll= function (iscroll) {
        var wrapper=this.el[0];
        if(typeof(configure.scroll[iscroll])=="undefined")
            return;
        if (configure.scroll[iscroll] != null) {
            configure.scroll[iscroll].destroy();
            configure.scroll[iscroll] =  new iScroll(wrapper);
        } else{
            configure.scroll[iscroll] =  new iScroll(wrapper);
        }
    };

    _ananas.prototype.showAlert= function (alertinfo, alertok, isSystem, title) {
        alertinfo = alertinfo == null ? "数据不存在" : alertinfo.toString();
        title = typeof (title) == "undefined" ? '提示' : title;
        if (typeof (isSystem) != "undefined" && isSystem) {
            if (isPhoneApp) {
                navigator.notification.alert(
                    alertinfo.toString(),  // 显示信息
                    null,// 警告被忽视的回调函数
                    title,// 标题
                    '确定'// 按钮名称
                );
            } else {
                alert(alertinfo);
            }
            return;
        }

        if (typeof (alertok) == "undefined") {
            setTimeout(function () { x$().closeDiv(); }, 1000);
        } else {
            setTimeout(function () { x$().closeDiv(); alertok(); }, 1000);
        }
        x$().showDiv("divAlert", { background: "rgba(0,0,0,0.5)" });
        x$("#divDialog").find("[name=alertText]").html(alertinfo);
    };

    //随机生成GUID
    _ananas.prototype.guidGenerator=function(){
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };

    //字符串时间格式转化处理
    _ananas.prototype.formatDateString=function(value,flag, showtime) {
        if(typeof (value)=="undefined")
            return "";
        value=value.replace(/-/g, '/').replace('T', ' ');
        var index=value.lastIndexOf('.')
        if (index > -1) {
            value = value.substring(0,index);
        }
        var mydate = new Date(value);
        if (!isNaN(mydate.getTime()))
            var newDate = as().formatDate(mydate, flag, showtime);
        return newDate;
    }

    //时间格式转化处理
    _ananas.prototype.formatDate=function(mydate, flag, showtime) {
        var year = mydate.getFullYear();
        var month = (mydate.getMonth() + 1) < 10 ? ("0" + (mydate.getMonth() + 1)) : (mydate.getMonth() + 1);
        var day = mydate.getDate() < 10 ? ("0" + mydate.getDate()) : mydate.getDate();
        var time = "";
        if (typeof (showtime) != "undefined" && showtime == true) {
            var hours = mydate.getHours() < 10 ? "0" + mydate.getHours() : mydate.getHours();
            var minutes = mydate.getMinutes() < 10 ? "0" + mydate.getMinutes() : mydate.getMinutes();
            var seconds = mydate.getSeconds() < 10 ? "0" + mydate.getSeconds() : mydate.getSeconds();
            time = "  " + hours + ":" + minutes + ":" + seconds;
        }
        value = year + flag + month + flag + day+time;
        return value;

    }

    //千分位处理
    _ananas.prototype.formatThousands=function(val) {
        val = Number(val).toFixed(2);
        return (val + "").replace(/(\d{1,3})(?=(\d{3})+(?:$|\D))/g, "$1,");
    }

    //获取文件大小
    _ananas.prototype.GetFileSize=function(filesize) {
        if (filesize < 1000) {
            filesize = filesize + "字节";
        }
        else {
            filesize = filesize / 1024;
            if (filesize < 1000) {
                filesize = filesize.toFixed(0) + "K";
            } else if (filesize < 1000000) {
                filesize = (filesize / 1024).toFixed(2) + "M";
            } else {
                filesize = (filesize / 1048576).toFixed(2) + "G";
            }
        }
        return filesize;
    }


    /*------ListScroll的实现-----------*/
    window.ListScroll=function(id,options) {
        this.el=x$(id);
        this.id=id;
        this.listName="listScroll";
        this.options=options;
        this.url=options.url;
        this.data=options.data;
        this.dataextend=typeof(options.dataextend)=="undefined"?"":options.dataextend;
        this.ajax=options.ajax;
        this.skin=options.skin;
        this.CreateDetail=options.CreateDetail;
        this.pageCount=15;
        this._init();
    }

    _ananas.prototype.iscroll={
        _iscroll_RefreshTip:function(tip){
            this.wrapper.find(".scroller").css({ "-webkit-transform": "translate(0px, 0px) scale(1) translateZ(0px)" });
            var pullDownEl = this.wrapper.find(".pullDown")[0];
            pullDownEl.setAttribute("name", '');
            pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
            pullDownEl.childNodes[0].className = "iconfont pullDownIcon_xia";
            as().showAlert(tip);
        },
        _iscroll_MoreTip:function(tip){
            var pullUpEl = this.wrapper.find(".pullUp")[0];
            pullUpEl.setAttribute("name", '');
            pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载';
            pullUpEl.childNodes[0].className = "iconfont pullUpIcon_shang";
            as().showAlert(tip);
        },
        _iscroll_jsoncallback:function(rows,total){
            this.container.html('');
            //没有数据
            if (total == 0||rows.length==0) {
                x$( this.container[0].parentNode).find(".listmask").remove();
                x$( this.container[0].parentNode).bottom('<div class="listmask" style="height:' + (window.document.body.clientHeight - 47) + 'px"> <i class="iconfont icon-zanwushuju1"></i></div>');
            } else {
                x$( this.container[0].parentNode).find(".listmask").remove();
                this.lscroll._createListData(rows);
            }
            configure.scroll[this.lscroll.listName].refresh();
        },
        _iscroll_jsoncallbackMore:function(rows,total){
            if (total == 0||rows.length==0) {
                this.container.html('');
                x$( this.container[0].parentNode).find(".listmask").remove();
                x$( this.container[0].parentNode).bottom('<div class="listmask" style="height:' + (window.document.body.clientHeight - 47) + 'px"> <i class="iconfont icon-zanwushuju1"></i></div>');
            } else {
                x$( this.container[0].parentNode).find(".listmask").remove();
                //加载数据
                var childcount=this.container.find("li").length;
                var lastcount = childcount % this.lscroll.pageCount;
                if (childcount > 0 && lastcount == rows.length) {
                    as().showAlert("已经是最后一页");
                }
                this.lscroll._createListData(rows);
            }
            configure.scroll[this.lscroll.listName].refresh();
        },
        _getPage:function(){
            var pageCount = this.lscroll.pageCount;
            var count = this.container.find("li").length;
            var page = Math.floor(count / pageCount);
            return page;
        },
        _iscroll_pullDownAction:function(myScroll)
        {
            //上拉重新刷新数据
            var owner=this;
            configure.scroll[owner.lscroll.listName] = myScroll
            var url=owner.lscroll.url;
            if(owner.lscroll.ajax) {
                $.ajax({
                    type : "post",
                    async:false,
                    url : url,
                    data: owner.lscroll.data,
                    success : function(data){
                        if(data.success) {
                            owner._iscroll_jsoncallback(data.obj.rows,data.obj.total);
                        }else
                        {
                            as().showAlert(data.msg);
                        }
                    },
                    timeout:function(){
                        owner._iscroll_RefreshTip("连接超时，请重试！");
                    },
                    error:function(){
                        owner._iscroll_RefreshTip("连接无法获取,请检查网络后重试！");
                    }
                });
            }else {
                //加载数据
                x$().xhrjsonp(url + "&page=1", { callback: function (data) {
                    data.State = 0;
                    if (data.State != 0) {
                        as().showAlert(data.Message);
                        return;
                    }
                    owner._iscroll_jsoncallback(data.BizObject.rows, data.BizObject.total);

                }, timeout: function () {
                    owner._iscroll_RefreshTip("连接超时，请重试！");
                }, error: function () {
                    owner._iscroll_RefreshTip("连接无法获取,请检查网络后重试！");
                }
                });
            }
        },
        _iscroll_pullUpAction:function(myScroll, wrapper,container)
        {
            //加载更多
            var owner=this;
            configure.scroll[owner.lscroll.listName] = myScroll
            var url=owner.lscroll.url;
            //加载数据
            {
                //地址处理
                var pageCount = owner.lscroll.pageCount;
                var count = owner.container.find("li").length;
                var page = Math.floor(count / pageCount) + 1;

            }
            if(owner.lscroll.ajax) {
                $.ajax({
                    type : "post",
                    async:false,
                    url : url,
                    data: {"PageRequestData":'{"Token":"123456789",'+owner.lscroll.dataextend+'Page:"'+(owner._getPage()+1)+'",Rows:"15",IsValid:"1",Obj:""}'},
                    success : function(data){
                        if(data.success)
                            owner._iscroll_jsoncallbackMore(data.obj.rows,data.obj.total);
                        else
                            as().showAlert(data.msg);
                    },
                    timeout:function(){
                        owner._iscroll_RefreshTip("连接超时，请重试！");
                    },
                    error:function(){
                        owner._iscroll_RefreshTip("连接无法获取,请检查网络后重试！");
                    }
                });
            }else {
                url = url + "&page=" + owner._getPage()+1;
                x$().xhrjsonp(url, { callback: function (data) {
                    if (data.State != 0) {
                        as().showAlert(data.Message);
                        return;
                    }
                    owner._iscroll_jsoncallbackMore(data.BizObject.rows, data.BizObject.total);
                }, timeout: function () {
                    owner._iscroll_MoreTip("连接超时，请重试！");
                }, error: function () {
                    owner._iscroll_MoreTip("连接无法获取,请检查网络后重试！");
                }
                });
            }
        },
        lscroll:null,
        wrapper:null,
        container:null,
        init:function(obj){
            this.lscroll=obj;
            var owner=this;
            x$("#" + obj.id + "_wrapper").iscroll({
                pullDownAction: function (myScroll, wrapper,container) {
                    owner.wrapper=wrapper;
                    owner.container=container;
                    owner._iscroll_pullDownAction(myScroll);
                },
                pullUpAction: function (myScroll, wrapper,container) {
                    owner.wrapper=wrapper;
                    owner.container=container;
                    owner._iscroll_pullUpAction(myScroll);
                }
            });
        }
    }

    ListScroll.prototype = {
        wrapper:null,
        container:null,
        _init: function () {
            var lscroll=this;
            x$("#" + this.id + "_wrapper").html("");
            x$("#" + this.id + "_wrapper").list({
                skin:lscroll.skin,
                beforePullAction: function (wrapper,container) {
                    lscroll.wrapper=wrapper;
                    lscroll.container=container;
                    lscroll._ibeforePullAction();
                }
            });
        },
        _ibeforePullAction:function()
        {
            //初始化加载数据
            var lscroll=this;
            if(!this.url)
            {
                 this._showtip("地址不存在！");
                 return;
            }
            if(this.ajax) {
                $.ajax({
                    type : "post",
                    async:false,
                    url : this.url,
                    data: this.data,
                    success : function(data){
                        if(data.success) {
                            lscroll._jsonpCallback(data.obj.rows,data.obj.total);
                        }else
                        {
                            as().showAlert(data.msg);
                        }
                    },
                    timeout:function(){
                        lscroll._itimeout();
                    },
                    error:function(){
                        lscroll._ierror();
                    }
                });
            }
            else
            {
                x$().xhrjsonp(this.url + "&page=1", { callback: function (data) {
                    lscroll._jsonpCallback(data.BizObject.rows,data.BizObject.total);
                }, error: function () {
                    lscroll._ierror()
                }, timeout: function () {
                    lscroll._itimeout()
                }
                });
            }
        },
        _shownodata:function()
        {
            var nodataicon='<i class="iconfont icon-zanwushuju2"></i>';
            x$(this.container[0].parentNode).bottom('<div class="listmask">'+nodataicon+'</div>');
        },
        _showtip:function(tip)
        {
            as().showAlert(tip);
            this._shownodata();
            x$().hideloading();
            as().iscroll.init(this);
        },
        _createListData:function(rows){
            var lastcount = (this.container.find("li").length) % this.pageCount;
            this._ListDetail(lastcount,rows);
        },
        _ListDetail:function(lastcount, objectdata){
                //var guid = as().guidGenerator();
                if(typeof (this.CreateDetail)!="undefined") {
                    for (var i = lastcount; i < objectdata.length; i++) {
                    var rowdata=this.CreateDetail(objectdata[i]);
                    this.container.bottom(rowdata)
                }
                }else {
                    this._showtip("没有CreateDetail！");
                }
        },
        _jsonpCallback:function(rows,total){
            try {
                if (total == 0||rows.length==0) {
                    this._shownodata();
                }else {
                    this._createListData(rows);
                }
                //结束进度条
                x$().hideloading();
                as().iscroll.init(this);
                //this._iscroll(this);
            }
            catch (e) {

            }
        },
        _ierror:function()
        {
            this._showtip("连接无法获取,请检查网络后重试！");
           /* as().showAlert("连接无法获取,请检查网络后重试！");
            this._shownodata();
             x$().hideloading();*/
        },
        _itimeout:function()
        {
            this._showtip("连接超时，请重试！");
           /* as().showAlert("连接超时，请重试！");
            this._shownodata();
             x$().hideloading();*/
        }
    }

} ());




