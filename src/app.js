window.configure={
    "pages": [
        "page/hot.html",
        "page/community.html",
        "page/discover.html",
        "page/profile.html"
    ],
    //全局的iscroll
    "scroll":{
        "listScroll": null,
        "hotScroll": null,
        "profileScroll": null
    },
    "window":{
        "Header":false,
        "mode":"",
        "tabBar":true
    },
    "tabBar":{
        "height":"52px",
        "css":"mybar",//设置底部菜单普通和选中样式
        "default":"hot",
        "list": {
            "hot":{
                "pagePath": "public/page/hot.html",
                "Icon":"public/1.png",
                "selectedIcon":"public/2.png",
                "pageInit":function(){
                    as("#js-tabs2").TabBox();
                    var swiper = new Swiper('#slidepreview', {
                        pagination: '.swiper-pagination',
                        paginationClickable: true,
                        centeredSlides: true,
                        nested:true,
                        autoplay: 2500,
                        autoplayDisableOnInteraction: false
                    });
                    as("#search").SearchBox();
                    as('#hot_wrapper').InitIscroll("hotScroll");
                }
            },
            "community":{
                "pagePath": "public/page/community.html",
                "Icon":"icon-tab-2",
                "selectedIcon":"icon-tab-2-selected",
                "pageInit":function(){
                    as("#js-tabs").TabBox();
                }
            },
            "discover":{
                "pagePath": "public/page/discover.html",
                "Icon":"icon-tab-3",
                "selectedIcon":"icon-tab-3-selected",
                "refresh":function(){
                    new ListScroll("discover",{
                        url:"http://app.mis.hy-nj.com/Message/GetMessageList?rp=15&sortname=SendTime&sortorder=desc&query=syj"
                    });
                },
                "pageInit":function(){
                    new ListScroll("discover",{
                        url:"http://app.mis.hy-nj.com/Message/GetMessageList?rp=15&sortname=SendTime&sortorder=desc&query=syj",
                        CreateDetail:function(item)
                        {
                            var ww=as().formatThousands(12323);
                            var li="<p>"+ww+"</p>";
                            return li;
                        }
                    });
                }
            },
            "profile":{
                "pagePath": "public/page/profile.html",
                "Icon":"icon-tab-4",
                "selectedIcon":"icon-tab-4-selected",
                "pageInit":function(){
                    as('#profile_wrapper').InitIscroll("profileScroll");
                }
            }
        }
    },
    "networkTimeout": {
        "request": 10000
    }
}