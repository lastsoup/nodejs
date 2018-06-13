/*PhoneGap Plugin by cqy*/

if (isPhoneApp) {
    document.addEventListener("deviceready", onDeviceReady, false);
};


//phonegap设备加载完毕
function onDeviceReady() {
    setTimeout(function () { navigator.splashscreen.hide(); }, 2000);
    //获取设备信息
    var devicePlatform = device.platform.toLowerCase();
    if (devicePlatform == "ios") {
        //ios系统
        phonedevice.ios = true;

    }

    if (devicePlatform == "android") {
        //android系统
        phonedevice.android = true;
        // 注册回退按钮事件监听器
        document.addEventListener("backbutton", onBackKeyDown, false);
        //android系统自动检测更新
        AndroidUpdate();
    }
    //检测网络连接
    if (navigator.network.connection.type == "none") {
        showAlert("当前设备没有网络连接，请检查网络设置！", null, true);
        return;
    }
    //创建下载目录
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, function () { showAlert("获取文件系统失败"); });
}


//android手机回退事件
function onBackKeyDown() {
    var currentid = x$('#main').find(".currentpage").attr("id").toString();
    if (currentid == "home_page" || currentid == "login_page") {
        showConfirm("确定退出应用程序", function () { navigator.app.exitApp(); });
    } else if (currentid == "account_page") {
        LoginIn();
    }
    else {
        x$('#main').pre({});
    }
}



//ios plugin
var IOSPlugin = {
    isexit: function (success, fail, str) { cordova.exec(success, fail, "FilePlugin", "isexit", [str]); },
    preview: function (success, fail, str) { cordova.exec(success, fail, "FilePlugin", "preview", [str]); },
    openWith: function (success, fail, str) { cordova.exec(success, fail, "FilePlugin", "openWith", [str]); },
    getserverdata:function (success, fail, str) { cordova.exec(success, fail, "FilePlugin", "getserverdata", [str]); }
};

//android plugin
var AndroidPlugin = {
    openWith: function (url, failureCallback) { cordova.exec(null, failureCallback, "FileOpener", "openFile", [url]); },
    isexit: function (successCallback, failureCallback, url) { cordova.exec(successCallback, failureCallback, "FileOpener", "checkFile", [url]); },
    getversion: function (successCallback, failureCallback, url) { cordova.exec(successCallback, failureCallback, "FileOpener", "getversion", [url]); },
    getserverdata: function (successCallback, failureCallback, url) { cordova.exec(successCallback, failureCallback, "FileOpener", "getserverdata", [url]); }
};



//下载检测网络
function DownloadNetwork(funok) {
    if (navigator.network.connection.type == "none") {
        showAlert("当前设备没有网络连接，请检查网络设置！", null, true);
        return;
    }

    if (navigator.network.connection.type != "wifi") {
        showConfirm("当前网络会产生网络流量,是否确定下载", funok, "下载提示");
    } else {
        funok();
    }
}

//创建目录
function gotFS(fileSystem) {
    window.fileSystem = fileSystem;
    fileSystem.root.getDirectory(window.appRootDirName, {
        create: true,
        exclusive: false
    }, function (entry) { window.appRootDir = entry; }, function () { showAlert("获取文件系统失败"); });
}

//android系统文件下载打开
function AndroidDownload(url,Name) {
    var uri = encodeURI(url);
    var fileName = uri.substr(uri.lastIndexOf("/"));
    var filePath = window.appRootDir.fullPath + fileName;
    var successCallback = function (res) {
        if (res == "true") {
            //存在
            AndroidPlugin.openWith(filePath, function (e) { showAlert(e); });
        }
        else if (res == "false") {//不存在开始下载文件
            var downloadsuccess = function () {
                //弹出对话框
                var fileTransfer = new FileTransfer();
                x$().showDiv("divDownload");
                x$("#divDialog").find(".onlyloading_2").setStyle("width", '0');
                FastTap("divDownloadClose", function (e) { x$().closeDiv(); fileTransfer.abort(); });
                var titleDom = x$("#divDialog").find(".tip_loading01")[0];
                titleDom.innerHTML = Name;
                //文件下载进度 
                fileTransfer.onprogress = function (result) {
                    var statusDom = x$("#divDialog").find(".baifenbi")[0];
                    var sizeDom = x$("#divDialog").find(".tip_loading02")[0];
                    if (result.lengthComputable) {
                        var percent = (result.loaded / 2) / result.total * 100;
                        percent = parseInt(percent);
                        x$("#divDialog").find(".onlyloading_2").setStyle("width", percent + '%');
                        sizeDom.innerHTML = GetFileSize(result.loaded / 2) + "/" + GetFileSize(result.total);
                        statusDom.innerHTML = percent + '%';
                    }
                };
                //文件下载
                fileTransfer.download(uri,filePath,function (entry) {
                 //此处调用打开文件方法
                 x$("#divDialog").find(".onlyloading_2").setStyle("width", '100%');
                 AndroidPlugin.openWith(entry.fullPath, function (e) { showAlert(e); });
                 x$().closeDiv();}, null);
            }
               DownloadNetwork(downloadsuccess);

        } else {
            showAlert("错误:" + res);
        }
    }
    //判断文件是否存在
    AndroidPlugin.isexit(successCallback, function (e) { showAlert(e); }, appRootDirName + fileName);
}

function iosFileOpen(filePath)
{
  var openSuccessCallback=function(res){
    if(!res){
      showAlert("请安装应用打开");
    }
  }

  IOSPlugin.preview(openSuccessCallback, function (e) { showAlert(e); }, filePath);
}


//ios文件下载打开
function IOSDownload(url,Name){
  var uri = encodeURI(url);
  var fileName = uri.substr(uri.lastIndexOf("/"));
  var filePath = window.appRootDir.fullPath + fileName;
  var successCallback = function (res) {
      if (res) {
          iosFileOpen(filePath);
          return;
      }

      var downloadsuccess = function () {
          var fileTransfer = new FileTransfer();
          x$().showDiv("divDownload");
          x$("#divDialog").find(".onlyloading_2").setStyle("width", '0');
          FastTap("divDownloadClose", function (e) { x$().closeDiv(); fileTransfer.abort(); });
          var titleDom = x$("#divDialog").find(".tip_loading01")[0];
          titleDom.innerHTML = Name;
          //文件下载进度 
          fileTransfer.onprogress = function (result) {
              var statusDom = x$("#divDialog").find(".baifenbi")[0];
              var sizeDom = x$("#divDialog").find(".tip_loading02")[0];
              if (result.lengthComputable) {
                  var percent = result.loaded / result.total * 100;
                  percent = parseInt(percent);
                  x$("#divDialog").find(".onlyloading_2").setStyle("width", percent + '%');
                  sizeDom.innerHTML = GetFileSize(result.loaded) + "/" + GetFileSize(result.total);
                  statusDom.innerHTML = percent + '%';
              }
          };
          //文件下载
          fileTransfer.download(uri, filePath, function (entry) {
              x$("#divDialog").find(".onlyloading_2").setStyle("width", '100%');
              iosFileOpen(entry.fullPath);
              x$().closeDiv();
          }, null);
      }

      DownloadNetwork(downloadsuccess);
  }
   IOSPlugin.isexit(successCallback, function (e) { showAlert(e); }, filePath);
}


function downloadFile(url, Name) {
    if (!isPhoneApp) {
        //var myurl = phoneIronman3.domains.fsUrl + "/File/DownFile?filePath=" + url.replace(phoneIronman3.domains.fsUrl, "") + "&fileName=" + Name;
        window.location.href = url;
        return;
    }
    //ios文件下载
    if (phonedevice.ios) {
        IOSDownload(url, Name);
    }
    //android文件下载
    if(phonedevice.android){
        AndroidDownload(url, Name);
    }

}



function AndroidUpdate() {
    var servers = JSON.parse(window.localStorage.getItem("servers"));
    var serverindex = window.localStorage.getItem("CurrentServer");
    if (servers != null && servers.length > 0) {
        var domains = GetTrueServerUrl(servers[serverindex]);
        var appsuccessCallback = function (res) {
            var version = res.split(';');
            var serverVersion = JSON.parse(version[0]);
            var localVersion = JSON.parse(version[1]);
            var apkName = serverVersion.ApkName; 

            var serverVersionName = serverVersion.VersionName;
            var serverVersionCode = serverVersion.VersionCode;
            var localVersionName = localVersion.versionName;
            var localVersionCode = localVersion.versionCode;
            if (serverVersionCode != localVersionCode) {
                var tipInfo = "当前版本" + localVersionName + ",检测到新的版本" + serverVersionName + "是否更新?";
                showConfirm(tipInfo, function () {
                    AndroidUpdateDownload(domains.mobileUrl + "/android/" + apkName, apkName);
                },"更新提示");
            }
        };
        AndroidPlugin.getversion(appsuccessCallback, function (e) { showAlert(e); }, domains.mobileUrl + "/android/version.json");
    }
}


function AndroidUpdateDownload(url, Name) {
    var uri = encodeURI(url);
    var fileName = uri.substr(uri.lastIndexOf("/"));
    var filePath = window.appRootDir.fullPath + fileName;
    //弹出对话框
    var downloadsuccess = function () {
        var fileTransfer = new FileTransfer();
        x$().showDiv("divDownload");
        x$("#divDialog").find(".onlyloading_2").setStyle("width", '0');
        FastTap("divDownloadClose", function (e) { x$().closeDiv(); fileTransfer.abort(); });
        var titleDom = x$("#divDialog").find(".tip_loading01")[0];
        titleDom.innerHTML = Name;
        //文件下载进度 
        fileTransfer.onprogress = function (result) {
            var statusDom = x$("#divDialog").find(".baifenbi")[0];
            var sizeDom = x$("#divDialog").find(".tip_loading02")[0];
            if (result.lengthComputable) {
                var percent = (result.loaded / 2) / result.total * 100;
                percent = parseInt(percent);
                x$("#divDialog").find(".onlyloading_2").setStyle("width", percent + '%');
                sizeDom.innerHTML = GetFileSize(result.loaded / 2) + "/" + GetFileSize(result.total);
                statusDom.innerHTML = percent + '%';
            }
        };
        //文件下载
        fileTransfer.download(
        uri,
        filePath,
        function (entry) {
            //此处调用打开文件方法
            x$("#divDialog").find(".onlyloading_2").setStyle("width", '100%');
            AndroidPlugin.openWith(entry.fullPath, function (e) { showAlert(e); });
            x$().closeDiv();
        }, null);
    }
    DownloadNetwork(downloadsuccess);
 }

 //ios获取服务器页面
 function IOSGetDetail(url) {
    var appsuccessCallback = function (res) {
         x$('#detail_info').html(res);
     }
     IOSPlugin.getserverdata(appsuccessCallback, null,url);
 }

 //android获取服务器页面
 function AndroidGetDetail(url) {
     var appsuccessCallback = function (res) {
         x$('#detail_info').html(res);
     }
     AndroidPlugin.getserverdata(appsuccessCallback,null,url);
 }