chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {
    setTimeout(function(){
        if(msg && msg.nick){
            var nick = msg.nick;
            console.log(nick);
            $.ajax({
                url: 'http://sem.taobao.com/userinfo.do?callback=userInfoCallback',
                dataType: 'text',
                type: 'get',
                success: function (resp) {
                    var  userInfo = eval(resp.substring(16));
                    console.log(userInfo);
                    var token =  userInfo.result.token;
                   // console.log(token);
                    getShopinfoByToken(token,nick);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.status);
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                }
            });
        }
    },2000);
});

function getShopinfoByToken(token,nick){
    $.ajax({
        url: 'http://sem.taobao.com/customer_find.do?token='+token+'&isAjaxRequest=true&status=SERVICED&pagenumber=1&pagesize=1&searchtype=IM&searchvalue='+nick+'&searchName=客户旺旺',
        dataType: 'json',
        //data:{status:'SERVICED',searchtype:'IM',searchName:'客户旺旺',custscope:'All',pagenumber:1,pagesize:1,searchvalue:'zhangtenyue123'},
        type: 'POST',
        success: function (resp) {
            console.log(resp);
            if(resp.code == 1 && resp.count ==1){
                var custid = resp.result[0].custid;
                var tpcompanyid = resp.result[0].tpcompanyid;
                var tpcompanyname = resp.result[0].tpcompanyname;
                login_subway(custid,tpcompanyid,tpcompanyname,token);
            }else{
                alert("无法找到该店铺，请确认代理账号中有该店铺的授权！");
               // window.location.href="http://sem.taobao.com/logout.do?token="+token;
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
           // window.location.href="http://sem.taobao.com/logout.do?token="+token;
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        }
    });
}


function login_subway(custid,tpcompanyid,tpcompanyname,token){

    document.write("<script>function jsonp9999(resp){if(resp.code=='200'){window.location.href=\"http://subway.simba.taobao.com/\"}else{alert(\"无法登录到直通车，请手动登录！\");}}</script>");
    $.ajax({
        url: 'http://subway.simba.taobao.com/sem_login.htm?custID='+custid+'&semProviderId='+tpcompanyid+'&semProviderName='+tpcompanyname+'&opTypeEnum=WRITE',
        dataType: 'jsonp',
        type: 'get',
        jsonpCallback: 'jsonp9999'
    });
}

