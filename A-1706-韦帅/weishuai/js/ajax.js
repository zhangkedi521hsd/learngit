/*
调用示例：
ajax({
    url:"http://......",
    data:{
        
    },
    success:function(result){
        console.log(result);
    },
    error:function(result){
    	
    }
})
*/
function ajax(option) {
    option = option || {};
    option.method = (option.method || 'POST').toUpperCase();
    option.url = option.url || '';
    option.dataType = option.dataType || "JSON";//跨域时修改为JSONP
    option.async = option.async || true;
    option.data = option.data || null;
    option.success = option.success || function () { };
    option.error = option.error || function (xhr, sta) {
        console.log("err:xhr->", xhr, sta);
    };
    if (!XMLHttpRequest) {
        console.log("浏览器不支持XMLHttpRequest对象.");
    }
    var xhr = new XMLHttpRequest();
    //请求默认超时事件,单位毫秒
    xhr.timeout = 10000;
    //浏览器不支持XMLHttpRequest对象,IE6-8(ActiveXObject)对象,移动端不考虑
    if (typeof (xhr) == 'undefined' || xhr == null) {
        console.log("XMLHttpRequest对象创建失败！！");
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    var json = JSON.parse(xhr.responseText || xhr.response);
                    option.success(json);
                } catch (e) {
                    console.log("catch->xhr.responseText", e.message);
                    option.success(xhr.responseText);
                }
            } else {
                option.error(xhr, xhr.status);
            }
        }
    };

    var params = [];
    for (var key in option.data) {
        if (option.data.hasOwnProperty(key)) {
            params.push(key + '=' + option.data[key]);
        };
    }
    try {
        var postData = params.join('&');
        if (option.method.toUpperCase() === 'POST') {
            xhr.open(option.method, option.url, option.async);
            if (!option.dataType || option.dataType.toLowerCase() == "json") {
                xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
                postData = JSON.stringify(option.data);
            } else {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
            }
            xhr.send(postData);
        }
        else if (option.method.toUpperCase() === 'GET') {
            xhr.open(option.method, option.url + '?' + postData, option.async);
            xhr.send(null);
        }
    } catch (e) {
        console.log(e);
    }
}