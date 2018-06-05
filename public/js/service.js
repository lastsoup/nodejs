(function () {
    //初始化页面布局
    //动态添加页面
    var Main=function(id) {
        this.el=x$(id);
        this.tabBar=x$("#js-tabbar");
        this.main=x$("#main");
        this.mode=configure.window.mode;
        this._init();
    }

    Main.prototype = {
      _init:function(){
        //先动态添加tab样式
        this._addTab();
        //设置页面的模式是动态还是静态的
        this._initPage();
        //添加切换tab的事件
        this._initEvent();
      },
      _initEvent:function(){
          var m=this;
          if(this.mode=="link") {
              as(".tab-item").Click(function () {
                  var tabid = this.getAttribute("tab-id");
                  window.location.href = "index.html?tab=" + tabid;
              });
          }else
          {
              as(".tab-item").Click(function () {
                  var tabid = this.getAttribute("tab-id");
                  var selectedid=x$(".tab-selected").attr("tab-id");
                  var tab = configure.tabBar.list[tabid];
                  if(tabid!=selectedid) {
                      m._setSelectTab(tabid);
                      m.main.next('#' + tabid, { html: tab.pagePath, callback: tab.pageInit});
                  }else
                  {
                      //重新加载当前页面
                      if (typeof (tab.refresh) == 'function') {
                          tab.refresh()
                      }
                  }
              });
          }
      },
      _setLinkPage:function(){
          var tabid=x$().GetQueryString("tab");
          tabid=tabid?tabid:configure.tabBar.default;
          this._setSelectTab(tabid);
          var tab=configure.tabBar.list[tabid];
          this.main.next('#'+tabid, { html: tab.pagePath,callback: tab.pageInit});
      },
      _setOnePage:function(){
          var tabid=configure.tabBar.default;
          var els=x$(".tab-item");
          for(var i=0;i<els.length;i++)
          {
              var el = els[i];
              var id=x$(el).attr("tab-id");
              var tab=configure.tabBar.list[id];
              this.main.storenext('#'+id, { html:tab.pagePath, callback: function () {} });
              if(id==tabid) {
                  this._setSelectTab(id);
                  this.main.next('#' + id, { html: tab.pagePath, callback: tab.pageInit});
              }
          }
      },
      _initPage:function(){
        if(this.mode=="link")
         this._setLinkPage();
        else
         this._setOnePage();
      },
      _setSelectTab:function(id){
         //删除选中的样式
         var selectedtag=x$(".tab-selected .icon")[0].tagName.toLowerCase();
         var selectedid=x$(".tab-selected").attr("tab-id");
         var currenttag= x$("#js-btn-tab-"+id+" .icon")[0].tagName.toLowerCase();
         var oldicon=configure.tabBar.list[selectedid].Icon;
         var currentIcon=configure.tabBar.list[id].selectedIcon;
         if(selectedtag=="svg")
            x$(".tab-selected use").attr("xlink:href", "#"+oldicon);
         if(currenttag=="svg")
            x$("#js-btn-tab-"+id+" use").attr("xlink:href", "#"+currentIcon);
          if(selectedtag=="img")
              x$(".tab-selected img").attr("src", oldicon);
          if(currenttag=="img")
              x$("#js-btn-tab-"+id+" img").attr("src",currentIcon);
         x$(".tab-selected").removeClass("tab-selected");
         x$("#js-btn-tab-"+id).addClass("tab-selected");
      },
      _addTab:function(){
         if(!configure.window.tabBar)
         {
             this.main.css({bottom:"0"});
             this.tabBar.html('remove');
             return;
         }
         //设置底部菜单的高度
         this.main.css({bottom:configure.tabBar.height});
         this.tabBar.css({height:configure.tabBar.height});
         //设置底部菜单的模式
         this.tabBar.addClass(configure.tabBar.css);
      }
    }

    var Header=function(id) {this.el=x$(id);}
    Header.prototype = {}

    function init()
    {
        new Main("#main");
    }

    init();

})();
