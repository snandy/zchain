/*
 dapeigou
*/
(function() {
    var dpg = document.getElementById('nav-dapeigou');
    if ( dpg ) {
        dpg.innerHTML = '<a href="http://channel.jd.com/chaoshi.html">京东超市</a>';
    }
})();

/*
 getDomain
*/
if (typeof pageConfig.FN_getDomain === 'undefined') {
    pageConfig.FN_getDomain = function() {
        var hn = location.hostname;

        return (/360buy.com/.test(hn)) ? "360buy.com" : "jd.com";
    };
}

/*
  global links
*/
(function(){
    var obj=$("#service-2013 a[href='http://en.360buy.com/']");
    if(obj.length){
        obj.attr("href","http://help.en.360buy.com/help/question-2.html");
    }
})();
(function(){
    var obj=$("#footer-2013 a[href='http://about.58.com/fqz/index.html']");
    if(obj.length){
        obj.attr("href","http://www.bj.cyberpolice.cn/index.do");
    }
})();

/*
    global nav
*/
/*(function() {
    var minitiao = document.getElementById('nav-minitiao');

    if ( !!minitiao ) {
        minitiao.innerHTML = '<a href="http://dapeigou.jd.com/" target="_blank">搭配购</a>';
        minitiao.setAttribute('id', 'nav-dapeigou');
    }
})();*/

/*
    remove JDXX
*/
/*(function() {
    var service = document.getElementById('service'),
        div = null, i = 0;

    if (!!service) {
        div = service.getElementsByTagName('dl')[4].getElementsByTagName('div');

        while(i<div.length) {
            if ( /\u5bb6\u7535\u4e0b\u4e61/.test(div[i].innerHTML) ) {
                div[i].parentNode.removeChild(div[i]);
                return false;
            }

            i++;
        }
    }
})();*/

/*
    CopyRight2013
*/
/*(function(){function a(a,c){if(c=c||document,c.getElementsByClassName)return c.getElementsByClassName(a);for(var d=c.getElementsByTagName("*"),e=[],f=0;d.length>f;f++)b(a,d[f])&&e.push(d[f]);return e}function b(a,b){for(var c=b.className.split(/\s+/),d=0;c.length>d;d++)if(c[d]==a)return!0;return!1}if(document.getElementById("footer")){var c=a("copyright",document.getElementById("footer"))[0];c.innerHTML='\u5317\u4eac\u5e02\u516c\u5b89\u5c40\u671d\u9633\u5206\u5c40\u5907\u6848\u7f16\u53f7110105014669&nbsp;&nbsp;|&nbsp;&nbsp;\u4eacICP\u8bc1070359\u53f7&nbsp;&nbsp;|&nbsp;&nbsp;<a target="_blank" href="http://help.jd.com/help/question-310.html">\u4e92\u8054\u7f51\u836f\u54c1\u4fe1\u606f\u670d\u52a1\u8d44\u683c\u8bc1\u7f16\u53f7(\u4eac)-\u975e\u7ecf\u8425\u6027-2011-0034</a><br><a target="_blank" href="http://misc.360buyimg.com/skin/df/i/com/f_music.jpg" rel="nofollow">\u97f3\u50cf\u5236\u54c1\u7ecf\u8425\u8bb8\u53ef\u8bc1\u82cf\u5bbf\u6279005\u53f7</a>&nbsp;&nbsp;|&nbsp;&nbsp;\u51fa\u7248\u7269\u7ecf\u8425\u8bb8\u53ef\u8bc1\u7f16\u53f7\u65b0\u51fa\u53d1(\u82cf)\u6279\u5b57\u7b2cN-012\u53f7&nbsp;&nbsp;|&nbsp;&nbsp;\u4e92\u8054\u7f51\u51fa\u7248\u8bb8\u53ef\u8bc1\u7f16\u53f7\u65b0\u51fa\u7f51\u8bc1(\u4eac)\u5b57150\u53f7<br>Copyright&copy;2004-2013&nbsp;&nbsp;360buy\u4eac\u4e1c\u5546\u57ce&nbsp;\u7248\u6743\u6240\u6709'}})();*/

/*
    JSON
    ref: https://github.com/douglascrockford/JSON-js/edit/master/json2.js
*/
if(typeof JSON!=="object"){JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==="string"){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());

/*
    livequery
*/
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(4($){$.R($.7,{3:4(c,b,d){9 e=2,q;5($.O(c))d=b,b=c,c=z;$.h($.3.j,4(i,a){5(e.8==a.8&&e.g==a.g&&c==a.m&&(!b||b.$6==a.7.$6)&&(!d||d.$6==a.o.$6))l(q=a)&&v});q=q||Y $.3(2.8,2.g,c,b,d);q.u=v;$.3.s(q.F);l 2},T:4(c,b,d){9 e=2;5($.O(c))d=b,b=c,c=z;$.h($.3.j,4(i,a){5(e.8==a.8&&e.g==a.g&&(!c||c==a.m)&&(!b||b.$6==a.7.$6)&&(!d||d.$6==a.o.$6)&&!2.u)$.3.y(a.F)});l 2}});$.3=4(e,c,a,b,d){2.8=e;2.g=c||S;2.m=a;2.7=b;2.o=d;2.t=[];2.u=v;2.F=$.3.j.K(2)-1;b.$6=b.$6||$.3.I++;5(d)d.$6=d.$6||$.3.I++;l 2};$.3.p={y:4(){9 b=2;5(2.m)2.t.16(2.m,2.7);E 5(2.o)2.t.h(4(i,a){b.o.x(a)});2.t=[];2.u=Q},s:4(){5(2.u)l;9 b=2;9 c=2.t,w=$(2.8,2.g),H=w.11(c);2.t=w;5(2.m){H.10(2.m,2.7);5(c.C>0)$.h(c,4(i,a){5($.B(a,w)<0)$.Z.P(a,b.m,b.7)})}E{H.h(4(){b.7.x(2)});5(2.o&&c.C>0)$.h(c,4(i,a){5($.B(a,w)<0)b.o.x(a)})}}};$.R($.3,{I:0,j:[],k:[],A:v,D:X,N:4(){5($.3.A&&$.3.k.C){9 a=$.3.k.C;W(a--)$.3.j[$.3.k.V()].s()}},U:4(){$.3.A=v},M:4(){$.3.A=Q;$.3.s()},L:4(){$.h(G,4(i,n){5(!$.7[n])l;9 a=$.7[n];$.7[n]=4(){9 r=a.x(2,G);$.3.s();l r}})},s:4(b){5(b!=z){5($.B(b,$.3.k)<0)$.3.k.K(b)}E $.h($.3.j,4(a){5($.B(a,$.3.k)<0)$.3.k.K(a)});5($.3.D)1j($.3.D);$.3.D=1i($.3.N,1h)},y:4(b){5(b!=z)$.3.j[b].y();E $.h($.3.j,4(a){$.3.j[a].y()})}});$.3.L(\'1g\',\'1f\',\'1e\',\'1b\',\'1a\',\'19\',\'18\',\'17\',\'1c\',\'15\',\'1d\',\'P\');$(4(){$.3.M()});9 f=$.p.J;$.p.J=4(a,c){9 r=f.x(2,G);5(a&&a.8)r.g=a.g,r.8=a.8;5(14 a==\'13\')r.g=c||S,r.8=a;l r};$.p.J.p=$.p})(12);',62,82,'||this|livequery|function|if|lqguid|fn|selector|var|||||||context|each||queries|queue|return|type||fn2|prototype|||run|elements|stopped|false|els|apply|stop|undefined|running|inArray|length|timeout|else|id|arguments|nEls|guid|init|push|registerPlugin|play|checkQueue|isFunction|remove|true|extend|document|expire|pause|shift|while|null|new|event|bind|not|jQuery|string|typeof|toggleClass|unbind|addClass|removeAttr|attr|wrap|before|removeClass|empty|after|prepend|append|20|setTimeout|clearTimeout'.split('|'),0,{}));

/*
    query
*/
new function(settings){var $separator=settings.separator||'&';var $spaces=settings.spaces===false?false:true;var $suffix=settings.suffix===false?'':'[]';var $prefix=settings.prefix===false?false:true;var $hash=$prefix?settings.hash===true?"#":"?":"";var $numbers=settings.numbers===false?false:true;jQuery.query=new function(){var is=function(o,t){return o!=undefined&&o!==null&&(!!t?o.constructor==t:true)};var parse=function(path){var m,rx=/\[([^[]*)\]/g,match=/^(\S+?)(\[\S*\])?$/.exec(path),base=match[1],tokens=[];while(m=rx.exec(match[2]))tokens.push(m[1]);return[base,tokens]};var set=function(target,tokens,value){var o,token=tokens.shift();if(typeof target!='object')target=null;if(token===""){if(!target)target=[];if(is(target,Array)){target.push(tokens.length==0?value:set(null,tokens.slice(0),value))}else if(is(target,Object)){var i=0;while(target[i++]!=null);target[--i]=tokens.length==0?value:set(target[i],tokens.slice(0),value)}else{target=[];target.push(tokens.length==0?value:set(null,tokens.slice(0),value))}}else if(token&&token.match(/^\s*[0-9]+\s*$/)){var index=parseInt(token,10);if(!target)target=[];target[index]=tokens.length==0?value:set(target[index],tokens.slice(0),value)}else if(token){var index=token.replace(/^\s*|\s*$/g,"");if(!target)target={};if(is(target,Array)){var temp={};for(var i=0;i<target.length;++i){temp[i]=target[i]}target=temp}target[index]=tokens.length==0?value:set(target[index],tokens.slice(0),value)}else{return value}return target};var queryObject=function(a){var self=this;self.keys={};if(a.queryObject){jQuery.each(a.get(),function(key,val){self.SET(key,val)})}else{jQuery.each(arguments,function(){var q=""+this;q=q.replace(/^[?#]/,'');q=q.replace(/[;&]$/,'');if($spaces)q=q.replace(/[+]/g,' ');jQuery.each(q.split(/[&;]/),function(){var key=decodeURIComponent(this.split('=')[0]);var val=decodeURIComponent(encodeURIComponent(this.split('=')[1]));if(!key)return;if($numbers){if(/^[+-]?[0-9]+\.[0-9]*$/.test(val))val=parseFloat(val);else if(/^[+-]?[0-9]+$/.test(val))val=parseInt(val,10)}val=(!val&&val!==0)?true:val;if(val!==false&&val!==true&&typeof val!='number')val=val;self.SET(key,val)})})}return self};queryObject.prototype={queryObject:true,has:function(key,type){var value=this.get(key);return is(value,type)},GET:function(key){if(!is(key))return this.keys;var parsed=parse(key),base=parsed[0],tokens=parsed[1];var target=this.keys[base];while(target!=null&&tokens.length!=0){target=target[tokens.shift()]}return typeof target=='number'?target:target||""},get:function(key){var target=this.GET(key);if(is(target,Object))return jQuery.extend(true,{},target);else if(is(target,Array))return target.slice(0);return target},SET:function(key,val){var value=!is(val)?null:val;var parsed=parse(key),base=parsed[0],tokens=parsed[1];var target=this.keys[base];this.keys[base]=set(target,tokens.slice(0),value);return this},set:function(key,val){return this.copy().SET(key,val)},REMOVE:function(key){return this.SET(key,null).COMPACT()},remove:function(key){return this.copy().REMOVE(key)},EMPTY:function(){var self=this;jQuery.each(self.keys,function(key,value){delete self.keys[key]});return self},load:function(url){var hash=url.replace(/^.*?[#](.+?)(?:\?.+)?$/,"$1");var search=url.replace(/^.*?[?](.+?)(?:#.+)?$/,"$1");return new queryObject(url.length==search.length?'':search,url.length==hash.length?'':hash)},empty:function(){return this.copy().EMPTY()},copy:function(){return new queryObject(this)},COMPACT:function(){function build(orig){var obj=typeof orig=="object"?is(orig,Array)?[]:{}:orig;if(typeof orig=='object'){function add(o,key,value){if(is(o,Array))o.push(value);else o[key]=value}jQuery.each(orig,function(key,value){if(!is(value))return true;add(obj,key,build(value))})}return obj}this.keys=build(this.keys);return this},compact:function(){return this.copy().COMPACT()},toString:function(){var i=0,queryString=[],chunks=[],self=this;var addFields=function(arr,key,value){if(!is(value)||value===false)return;var o=[encodeURIComponent(key)];if(value!==true){o.push("=");o.push(encodeURIComponent(value))}arr.push(o.join(""))};var build=function(obj,base){var newKey=function(key){return!base||base==""?[key].join(""):[base,"[",key,"]"].join("")};jQuery.each(obj,function(key,value){if(typeof value=='object')build(value,newKey(key));else addFields(chunks,newKey(key),value)})};build(this.keys);if(chunks.length>0)queryString.push($hash);queryString.push(chunks.join($separator));return queryString.join("")}};return new queryObject(location.search,location.hash)}}(jQuery.query||{});

/*
    cookie
*/
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('n.5=v(a,b,c){4(7 b!=\'w\'){c=c||{};4(b===o){b=\'\';c.3=-1}2 d=\'\';4(c.3&&(7 c.3==\'p\'||c.3.q)){2 e;4(7 c.3==\'p\'){e=x y();e.z(e.A()+(c.3*B*r*r*C))}s{e=c.3}d=\';3=\'+e.q()}2 f=c.8?\';8=\'+(c.8):\'\';2 g=c.9?\';9=\'+(c.9):\'\';2 h=c.t?\';t\':\'\';6.5=[a,\'=\',D(b),d,f,g,h].E(\'\')}s{2 j=o;4(6.5&&6.5!=\'\'){2 k=6.5.F(\';\');G(2 i=0;i<k.m;i++){2 l=n.H(k[i]);4(l.u(0,a.m+1)==(a+\'=\')){j=I(l.u(a.m+1));J}}}K j}};',47,47,'||var|expires|if|cookie|document|typeof|path|domain|||||||||||||length|jQuery|null|number|toUTCString|60|else|secure|substring|function|undefined|new|Date|setTime|getTime|24|1000|encodeURIComponent|join|split|for|trim|decodeURIComponent|break|return'.split('|'),0,{}));

/*
    utility by springChun
*/
Function.prototype.overwrite = function(f) {
    var result = f;
    if (!result.original) {
        result.original = this;
    }
    return result;
}
Date.prototype.toString = Date.prototype.toString.overwrite(function(format) {
    var result = new String();
    if (typeof(format) == "string") {
        result = format;
        result = result.replace(/yyyy|YYYY/, this.getFullYear());
        result = result.replace(/yy|YY/, this.getFullYear().toString().substr(2, 2));
        result = result.replace(/MM/, this.getMonth() >= 9 ? this.getMonth() + 1 : "0" + (this.getMonth() + 1));
        result = result.replace(/M/, this.getMonth());
        result = result.replace(/dd|DD/, this.getDate() > 9 ? this.getDate() : "0" + this.getDate());
        result = result.replace(/d|D/, this.getDate());
        result = result.replace(/hh|HH/, this.getHours() > 9 ? this.getHours() : "0" + this.getHours());
        result = result.replace(/h|H/, this.getHours());
        result = result.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes() : "0" + this.getMinutes());
        result = result.replace(/m/, this.getMinutes());
        result = result.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds() : "0" + this.getSeconds());
        result = result.replace(/s|S/, this.getSeconds());
    }
    return result;
});
String.prototype.format = function() {
    var result = this;
    if (arguments.length > 0) {
        parameters = $.makeArray(arguments);
        $.each(parameters,
        function(i, n) {
            result = result.replace(new RegExp("\\{" + i + "\\}", "g"), n);
        });
    }
    return result;
}
function StringBuilder() {
    this.strings = new Array();
    this.length = 0;
}
StringBuilder.prototype.append = function(string) {
    this.strings.push(string);
    this.length += string.length;
}
StringBuilder.prototype.toString = function(start, length) {
    return this.strings.join("").substr(start, length);
};


/*
    jmsajax
*/
(function($) {
    $.jmsajax = function(options) {
        var defaults = {
            type: "POST",
            dataType: "msjson",
            data: {},
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
            },
            contentType: "application/json; charset=utf-8",
            error: function(x, s, m) {
                alert("Status: " + ((x.statusText) ? x.statusText : "Unknown") + "\nMessage: " + msJSON.parse(((x.responseText) ? x.responseText : "Unknown")).Message);
            }
        };
        var options = $.extend(defaults, options);
        if (options.method) options.url += "/" + options.method;
        if (options.data) {
            if (options.type == "GET") {
                var data = "";
                for (var i in options.data) {
                    if (data != "") data += "&";
                    data += i + "=" + msJSON.stringify(options.data[i]);
                }
                options.url += "?" + data;
                data = null;
                options.data = "{}";
            }
            else if (options.type == "POST") {
                options.data = msJSON.stringify(options.data);
            }
        }
        if (options.success) {
            if (options.dataType) {
                if (options.dataType == "msjson") {
                    var base = options.success;
                    options.success = function(response, status) {
                        var y = dateparse(response);
                        if (options.version) {
                            if (options.version >= 3.5) y = y.d;
                        }
                        else {
                            if (response.indexOf("{\"d\":") == 0) y = y.d;
                        }
                        base(y, status);
                    }
                }
            }
        }
        return $.ajax(options);
    };
    dateparse = function(data) {
        try {
            return msJSON.parse(data, function(key, value) {
                var a;
                if (typeof value === "string") {
                    if (value.indexOf("Date") >= 0) {
                        a = /^\/Date\(([0-9]+)\)\/$/.exec(value);
                        if (a) {
                            return new Date(parseInt(a[1], 10));
                        }
                    }
                }
                return value;
            });
        }
        catch (e) {
            return null;
        }
    }
    msJSON = function() {
        function f(n) {
            return n < 10 ? '0' + n : n;
        }
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapeable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap, indent, meta = {
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            },
            rep;

        function quote(string) {
            escapeable.lastIndex = 0;
            return escapeable.test(string) ? '"' + string.replace(escapeable, function(a) {
                var c = meta[a];
                if (typeof c === 'string') {
                    return c;
                }
                return '\\u' + ('0000' + (+(a.charCodeAt(0))).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        }

        function str(key, holder) {
            var i, k, v, length, mind = gap,
                partial, value = holder[key];
            if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }
            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }
            switch (typeof value) {
            case 'string':
                return quote(value);
            case 'number':
                return isFinite(value) ? String(value) : 'null';
            case 'boolean':
            case 'null':
                return String(value);
            case 'object':
                if (!value) {
                    return 'null';
                }
                if (value.toUTCString) {
                    return '"\\/Date(' + (value.getTime()) + ')\\/"';
                }
                gap += indent;
                partial = [];
                if (typeof value.length === 'number' && !(value.propertyIsEnumerable('length'))) {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }
                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }
                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value, rep);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value, rep);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }
                v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
            }
        }
        return {
            stringify: function(value, replacer, space) {
                var i;
                gap = '';
                indent = '';
                if (typeof space === 'number') {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }
                } else if (typeof space === 'string') {
                    indent = space;
                }
                rep = replacer;
                if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
                    throw new Error('JSON.stringify');
                }
                return str('', {
                    '': value
                });
            },
            parse: function(text, reviver) {
                var j;

                function walk(holder, key) {
                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }
                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function(a) {
                        return '\\u' + ('0000' + (+(a.charCodeAt(0))).toString(16)).slice(-4);
                    });
                }
                if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                    j = eval('(' + text + ')');
                    return typeof reviver === 'function' ? walk({
                        '': j
                    }, '') : j;
                }
                throw new SyntaxError('JSON.parse');
            }
        };
    }();
})(jQuery);

/*
    trimpath
*/
var TrimPath;
(function() {
    if (TrimPath == null) TrimPath = new Object();
    if (TrimPath.evalEx == null) TrimPath.evalEx = function(src) {
        return eval(src);
    };
    var UNDEFINED;
    if (Array.prototype.pop == null) Array.prototype.pop = function() {
        if (this.length === 0) {
            return UNDEFINED;
        }
        return this[--this.length];
    };
    if (Array.prototype.push == null) Array.prototype.push = function() {
        for (var i = 0; i < arguments.length; ++i) {
            this[this.length] = arguments[i];
        }
        return this.length;
    };
    TrimPath.parseTemplate = function(tmplContent, optTmplName, optEtc) {
        if (optEtc == null) optEtc = TrimPath.parseTemplate_etc;
        var funcSrc = parse(tmplContent, optTmplName, optEtc);
        var func = TrimPath.evalEx(funcSrc, optTmplName, 1);
        if (func != null) return new optEtc.Template(optTmplName, tmplContent, funcSrc, func, optEtc);
        return null;
    }
    try {
        String.prototype.process = function(context, optFlags) {
            var template = TrimPath.parseTemplate(this, null);
            if (template != null) return template.process(context, optFlags);
            return this;
        }
    } catch (e) {}
    TrimPath.parseTemplate_etc = {};
    TrimPath.parseTemplate_etc.statementTag = "forelse|for|if|elseif|else|var|macro";
    TrimPath.parseTemplate_etc.statementDef = {
        "if": {
            delta: 1,
            prefix: "if (",
            suffix: ") {",
            paramMin: 1
        },
        "else": {
            delta: 0,
            prefix: "} else {"
        },
        "elseif": {
            delta: 0,
            prefix: "} else if (",
            suffix: ") {",
            paramDefault: "true"
        },
        "/if": {
            delta: -1,
            prefix: "}"
        },
        "for": {
            delta: 1,
            paramMin: 3,
            prefixFunc: function(stmtParts, state, tmplName, etc) {
                if (stmtParts[2] != "in") throw new etc.ParseError(tmplName, state.line, "bad for loop statement: " + stmtParts.join(' '));
                var iterVar = stmtParts[1];
                var listVar = "__LIST__" + iterVar;
                return ["var ", listVar, " = ", stmtParts[3], ";", "var __LENGTH_STACK__;", "if (typeof(__LENGTH_STACK__) == 'undefined' || !__LENGTH_STACK__.length) __LENGTH_STACK__ = new Array();", "__LENGTH_STACK__[__LENGTH_STACK__.length] = 0;", "if ((", listVar, ") != null) { ", "var ", iterVar, "_ct = 0;", "for (var ", iterVar, "_index in ", listVar, ") { ", iterVar, "_ct++;", "if (typeof(", listVar, "[", iterVar, "_index]) == 'function') {continue;}", "__LENGTH_STACK__[__LENGTH_STACK__.length - 1]++;", "var ", iterVar, " = ", listVar, "[", iterVar, "_index];"].join("");
            }
        },
        "forelse": {
            delta: 0,
            prefix: "} } if (__LENGTH_STACK__[__LENGTH_STACK__.length - 1] == 0) { if (",
            suffix: ") {",
            paramDefault: "true"
        },
        "/for": {
            delta: -1,
            prefix: "} }; delete __LENGTH_STACK__[__LENGTH_STACK__.length - 1];"
        },
        "var": {
            delta: 0,
            prefix: "var ",
            suffix: ";"
        },
        "macro": {
            delta: 1,
            prefixFunc: function(stmtParts, state, tmplName, etc) {
                var macroName = stmtParts[1].split('(')[0];
                return ["var ", macroName, " = function", stmtParts.slice(1).join(' ').substring(macroName.length), "{ var _OUT_arr = []; var _OUT = { write: function(m) { if (m) _OUT_arr.push(m); } }; "].join('');
            }
        },
        "/macro": {
            delta: -1,
            prefix: " return _OUT_arr.join(''); };"
        }
    }
    TrimPath.parseTemplate_etc.modifierDef = {
        "eat": function(v) {
            return "";
        },
        "escape": function(s) {
            return String(s).replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
        },
        "capitalize": function(s) {
            return String(s).toUpperCase();
        },
        "default": function(s, d) {
            return s != null ? s : d;
        }
    }
    TrimPath.parseTemplate_etc.modifierDef.h = TrimPath.parseTemplate_etc.modifierDef.escape;
    TrimPath.parseTemplate_etc.Template = function(tmplName, tmplContent, funcSrc, func, etc) {
        this.process = function(context, flags) {
            if (context == null) context = {};
            if (context._MODIFIERS == null) context._MODIFIERS = {};
            if (context.defined == null) context.defined = function(str) {
                return (context[str] != undefined);
            };
            for (var k in etc.modifierDef) {
                if (context._MODIFIERS[k] == null) context._MODIFIERS[k] = etc.modifierDef[k];
            }
            if (flags == null) flags = {};
            var resultArr = [];
            var resultOut = {
                write: function(m) {
                    resultArr.push(m);
                }
            };
            try {
                func(resultOut, context, flags);
            } catch (e) {
                if (flags.throwExceptions == true) throw e;
                var result = new String(resultArr.join("") + "[ERROR: " + e.toString() + (e.message ? '; ' + e.message : '') + "]");
                result["exception"] = e;
                return result;
            }
            return resultArr.join("");
        }
        this.name = tmplName;
        this.source = tmplContent;
        this.sourceFunc = funcSrc;
        this.toString = function() {
            return "TrimPath.Template [" + tmplName + "]";
        }
    }
    TrimPath.parseTemplate_etc.ParseError = function(name, line, message) {
        this.name = name;
        this.line = line;
        this.message = message;
    }
    TrimPath.parseTemplate_etc.ParseError.prototype.toString = function() {
        return ("TrimPath template ParseError in " + this.name + ": line " + this.line + ", " + this.message);
    }
    var parse = function(body, tmplName, etc) {
        body = cleanWhiteSpace(body);
        var funcText = ["var TrimPath_Template_TEMP = function(_OUT, _CONTEXT, _FLAGS) { with (_CONTEXT) {"];
        var state = {
            stack: [],
            line: 1
        };
        var endStmtPrev = -1;
        while (endStmtPrev + 1 < body.length) {
            var begStmt = endStmtPrev;
            begStmt = body.indexOf("{", begStmt + 1);
            while (begStmt >= 0) {
                var endStmt = body.indexOf('}', begStmt + 1);
                var stmt = body.substring(begStmt, endStmt);
                var blockrx = stmt.match(/^\{(cdata|minify|eval)/);
                if (blockrx) {
                    var blockType = blockrx[1];
                    var blockMarkerBeg = begStmt + blockType.length + 1;
                    var blockMarkerEnd = body.indexOf('}', blockMarkerBeg);
                    if (blockMarkerEnd >= 0) {
                        var blockMarker;
                        if (blockMarkerEnd - blockMarkerBeg <= 0) {
                            blockMarker = "{/" + blockType + "}";
                        } else {
                            blockMarker = body.substring(blockMarkerBeg + 1, blockMarkerEnd);
                        }
                        var blockEnd = body.indexOf(blockMarker, blockMarkerEnd + 1);
                        if (blockEnd >= 0) {
                            emitSectionText(body.substring(endStmtPrev + 1, begStmt), funcText);
                            var blockText = body.substring(blockMarkerEnd + 1, blockEnd);
                            if (blockType == 'cdata') {
                                emitText(blockText, funcText);
                            } else if (blockType == 'minify') {
                                emitText(scrubWhiteSpace(blockText), funcText);
                            } else if (blockType == 'eval') {
                                if (blockText != null && blockText.length > 0) funcText.push('_OUT.write( (function() { ' + blockText + ' })() );');
                            }
                            begStmt = endStmtPrev = blockEnd + blockMarker.length - 1;
                        }
                    }
                } else if (body.charAt(begStmt - 1) != '$' && body.charAt(begStmt - 1) != '\\') {
                    var offset = (body.charAt(begStmt + 1) == '/' ? 2 : 1);
                    if (body.substring(begStmt + offset, begStmt + 10 + offset).search(TrimPath.parseTemplate_etc.statementTag) == 0) break;
                }
                begStmt = body.indexOf("{", begStmt + 1);
            }
            if (begStmt < 0) break;
            var endStmt = body.indexOf("}", begStmt + 1);
            if (endStmt < 0) break;
            emitSectionText(body.substring(endStmtPrev + 1, begStmt), funcText);
            emitStatement(body.substring(begStmt, endStmt + 1), state, funcText, tmplName, etc);
            endStmtPrev = endStmt;
        }
        emitSectionText(body.substring(endStmtPrev + 1), funcText);
        if (state.stack.length != 0) throw new etc.ParseError(tmplName, state.line, "unclosed, unmatched statement(s): " + state.stack.join(","));
        funcText.push("}}; TrimPath_Template_TEMP");
        return funcText.join("");
    }
    var emitStatement = function(stmtStr, state, funcText, tmplName, etc) {
        var parts = stmtStr.slice(1, -1).split(' ');
        var stmt = etc.statementDef[parts[0]];
        if (stmt == null) {
            emitSectionText(stmtStr, funcText);
            return;
        }
        if (stmt.delta < 0) {
            if (state.stack.length <= 0) throw new etc.ParseError(tmplName, state.line, "close tag does not match any previous statement: " + stmtStr);
            state.stack.pop();
        }
        if (stmt.delta > 0) state.stack.push(stmtStr);
        if (stmt.paramMin != null && stmt.paramMin >= parts.length) throw new etc.ParseError(tmplName, state.line, "statement needs more parameters: " + stmtStr);
        if (stmt.prefixFunc != null) funcText.push(stmt.prefixFunc(parts, state, tmplName, etc));
        else funcText.push(stmt.prefix);
        if (stmt.suffix != null) {
            if (parts.length <= 1) {
                if (stmt.paramDefault != null) funcText.push(stmt.paramDefault);
            } else {
                for (var i = 1; i < parts.length; i++) {
                    if (i > 1) funcText.push(' ');
                    funcText.push(parts[i]);
                }
            }
            funcText.push(stmt.suffix);
        }
    }
    var emitSectionText = function(text, funcText) {
        if (text.length <= 0) return;
        var nlPrefix = 0;
        var nlSuffix = text.length - 1;
        while (nlPrefix < text.length && (text.charAt(nlPrefix) == '\n'))
        nlPrefix++;
        while (nlSuffix >= 0 && (text.charAt(nlSuffix) == ' ' || text.charAt(nlSuffix) == '\t'))
        nlSuffix--;
        if (nlSuffix < nlPrefix) nlSuffix = nlPrefix;
        if (nlPrefix > 0) {
            funcText.push('if (_FLAGS.keepWhitespace == true) _OUT.write("');
            var s = text.substring(0, nlPrefix).replace('\n', '\\n');
            if (s.charAt(s.length - 1) == '\n') s = s.substring(0, s.length - 1);
            funcText.push(s);
            funcText.push('");');
        }
        var lines = text.substring(nlPrefix, nlSuffix + 1).split('\n');
        for (var i = 0; i < lines.length; i++) {
            emitSectionTextLine(lines[i], funcText);
            if (i < lines.length - 1) funcText.push('_OUT.write("\\n");\n');
        }
        if (nlSuffix + 1 < text.length) {
            funcText.push('if (_FLAGS.keepWhitespace == true) _OUT.write("');
            var s = text.substring(nlSuffix + 1).replace('\n', '\\n');
            if (s.charAt(s.length - 1) == '\n') s = s.substring(0, s.length - 1);
            funcText.push(s);
            funcText.push('");');
        }
    }
    var emitSectionTextLine = function(line, funcText) {
        var endMarkPrev = '}';
        var endExprPrev = -1;
        while (endExprPrev + endMarkPrev.length < line.length) {
            var begMark = "${",
                endMark = "}";
            var begExpr = line.indexOf(begMark, endExprPrev + endMarkPrev.length);
            if (begExpr < 0) break;
            if (line.charAt(begExpr + 2) == '%') {
                begMark = "${%";
                endMark = "%}";
            }
            var endExpr = line.indexOf(endMark, begExpr + begMark.length);
            if (endExpr < 0) break;
            emitText(line.substring(endExprPrev + endMarkPrev.length, begExpr), funcText);
            var exprArr = line.substring(begExpr + begMark.length, endExpr).replace(/\|\|/g, "#@@#").split('|');
            for (var k in exprArr) {
                if (exprArr[k].replace) exprArr[k] = exprArr[k].replace(/#@@#/g, '||');
            }
            funcText.push('_OUT.write(');
            emitExpression(exprArr, exprArr.length - 1, funcText);
            funcText.push(');');
            endExprPrev = endExpr;
            endMarkPrev = endMark;
        }
        emitText(line.substring(endExprPrev + endMarkPrev.length), funcText);
    }
    var emitText = function(text, funcText) {
        if (text == null || text.length <= 0) return;
        text = text.replace(/\\/g, '\\\\');
        text = text.replace(/\n/g, '\\n');
        text = text.replace(/"/g, '\\"');
        funcText.push('_OUT.write("');
        funcText.push(text);
        funcText.push('");');
    }
    var emitExpression = function(exprArr, index, funcText) {
        var expr = exprArr[index];
        if (index <= 0) {
            funcText.push(expr);
            return;
        }
        var parts = expr.split(':');
        funcText.push('_MODIFIERS["');
        funcText.push(parts[0]);
        funcText.push('"](');
        emitExpression(exprArr, index - 1, funcText);
        if (parts.length > 1) {
            funcText.push(',');
            funcText.push(parts[1]);
        }
        funcText.push(')');
    }
    var cleanWhiteSpace = function(result) {
        result = result.replace(/\t/g, "    ");
        result = result.replace(/\r\n/g, "\n");
        result = result.replace(/\r/g, "\n");
        result = result.replace(/^(\s*\S*(\s+\S+)*)\s*$/, '$1');
        return result;
    }
    var scrubWhiteSpace = function(result) {
        result = result.replace(/^\s+/g, "");
        result = result.replace(/\s+$/g, "");
        result = result.replace(/\s+/g, " ");
        result = result.replace(/^(\s*\S*(\s+\S+)*)\s*$/, '$1');
        return result;
    }
    TrimPath.parseDOMTemplate = function(elementId, optDocument, optEtc) {
        if (optDocument == null) optDocument = document;
        var element = optDocument.getElementById(elementId);
        var content = element.value;
        if (content == null) content = element.innerHTML;
        content = content.replace(/</g, "<").replace(/>/g, ">");
        return TrimPath.parseTemplate(content, elementId, optEtc);
    }
    TrimPath.processDOMTemplate = function(elementId, context, optFlags, optDocument, optEtc) {
        return TrimPath.parseDOMTemplate(elementId, optDocument, optEtc).process(context, optFlags);
    }
})();

/*
    getJSONP
*/
(function($) {
    $.extend({
        _jsonp: {
            scripts: {},
            counter: 1,
            charset: "gb2312",
            head: document.getElementsByTagName("head")[0],
            name: function(callback) {
                var name = '_jsonp_' + (new Date).getTime() + '_' + this.counter;
                this.counter++;
                var cb = function(json) {
                    eval('delete ' + name);
                    callback(json);
                    $._jsonp.head.removeChild($._jsonp.scripts[name]);
                    delete $._jsonp.scripts[name];
                };
                eval(name + ' = cb');
                return name;
            },
            load: function(url, name) {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.charset = this.charset;
                script.src = url;
                this.head.appendChild(script);
                this.scripts[name] = script;
            }
        },
        getJSONP: function(url, callback) {
            var name = $._jsonp.name(callback);
            var url = url.replace(/{callback};/, name);
            $._jsonp.load(url, name);
            return this;
        }
    });
})(jQuery);

/*
    Jdorpdown
*/
(function($){
    $.fn.Jdropdown=function(option,callback){
        if(!this.length)return;
        if (typeof option == "function") {
            callback = option;
            option = {};
        }
        var config=$.extend({
            "event":"mouseover",
            "current":"hover",
            "delay":0
        },option||{});
        var evt2=(config.event=="mouseover")?"mouseout":"mouseleave";
        $.each(this, function() {
            var timer1 = null,
                timer2 = null,
                flag = false;
            $(this).bind(config.event,function(){
                if (flag) {
                    clearTimeout(timer2);
                } else {
                    var _this = $(this);
                    timer1 = setTimeout(function() {
                        _this.addClass(config.current);
                        flag = true;
                        if(callback)callback(_this);
                    }, config.delay);
                }
            }).bind(evt2,function(){
                if (flag) {
                    var _this = $(this);
                    timer2 = setTimeout(function() {
                        _this.removeClass(config.current);
                        flag = false;
                    }, config.delay);
                } else {
                    clearTimeout(timer1);
                }
            });
            /*$(this).hover(function(){
                if (flag) {
                    clearTimeout(timer2);
                } else {
                    var _this = $(this);
                    timer1 = setTimeout(function() {
                        _this.addClass(config.current);
                        flag = true;
                        if(callback)callback(_this);
                    }, config.delay);
                }
            },function(){
                if (flag) {
                    var _this = $(this);
                    timer2 = setTimeout(function() {
                        _this.removeClass(config.current);
                        flag = false;
                    }, config.delay);
                } else {
                    clearTimeout(timer1);
                }
            });*/
        })
    };
})(jQuery);

(function ($) {
    $.fn.dropdown = function (option, callback) {
        var option = $.extend({
            className: 'item', //菜单className
            current: "hover",
            enterDelay: 10, //菜单进入时delay
            leaveDelay:300,//菜单移除后delay
			onmouseleave:null
        }, option);

        $.each(this, function () {
            var o = $(this);
            var $item = o.find('.' + option.className);
            var mouseLocs = [];
            var lastDelayLoc = null;
            var mouse_locs_tracked = 3;
            var showTag = false;
            var dropdownTimer, enterTimer;

            function active(that) {
                var offset = o.offset(),
                    upperLeft = {
                        x: offset.left,
                        y: offset.top
                    },
                    upperRight = {
                        x: offset.left + o.outerWidth(),
                        y: upperLeft.y
                    },
                    lowerLeft = {
                        x: offset.left,
                        y: offset.top + o.outerHeight()
                    },
                    lowerRight = {
                        x: offset.left + o.outerWidth(),
                        y: lowerLeft.y
                    }
                loc = mouseLocs[mouseLocs.length - 1],
                prevLoc = mouseLocs[0];

                if (!loc) {
                    return 0;
                }

                if (!prevLoc) {
                    prevLoc = loc;
                }

                if (prevLoc.x < offset.left || prevLoc.x > lowerRight.x ||
                    prevLoc.y < offset.top || prevLoc.y > lowerRight.y) {
                    return 0;
                }

                if (lastDelayLoc && loc.x == lastDelayLoc.x && loc.y == lastDelayLoc.y) {
                    return 0;
                }

                //求倾斜率
                function slope(a, b) {
                    return (b.y - a.y) / (b.x - a.x);
                }

                var decreasingCorner = upperRight,
                    increasingCorner = lowerRight;

                var decreasingSlope = slope(loc, decreasingCorner),
                    prevDecreasingSlope = slope(prevLoc, decreasingCorner),

                    increasingSlope = slope(loc, increasingCorner),
                    prevIncreasingSlope = slope(prevLoc, increasingCorner);

                if (decreasingSlope < prevDecreasingSlope && increasingSlope > prevIncreasingSlope) {
                    if ((prevLoc.x - upperLeft.x) < 25) {
                        return 0;
                    }
                    lastDelayLoc = loc;
                    return 300;
                }

                lastDelayLoc = null;
                return 0;
            }
            //事件绑定
            o.bind('mouseenter', function () {
                clearTimeout(dropdownTimer);
            });

			var currentItem = null;
			var delayItem = null;

            o.bind('mouseleave', function () {
                if (showTag) {
                    dropdownTimer = setTimeout(function () {
                        $item.removeClass(option.current);
                    }, option.leaveDelay);
                }
				if (option.onmouseleave) {
					option.onmouseleave();
				}
				currentItem = null;
            });

            $item.bind('mouseenter', function () {
                var self = $(this);
				var _this = this;
				var trigger = function(){
					currentItem = jQuery.inArray(_this,$item);
                        $item.removeClass(option.current);
                        self.addClass(option.current);
                        showTag = true;
                        if (callback) callback(self);
                    }

                enterTimer = setTimeout(function () {
                    if (active(self) == 0) {
						trigger();
						clearTimeout(delayItem);
                    }
                }, option.enterDelay);

				delayItem = setTimeout(function(){
					if (currentItem != jQuery.inArray(_this,$item)) {
						trigger();
					}
				},700)
            });

            $item.bind('mouseleave', function () {
                var self = $(this);
                clearTimeout(enterTimer);
				clearTimeout(delayItem);
            });

            $(document).mousemove(function (e) {
                mouseLocs.push({
                    x: e.pageX,
                    y: e.pageY
                });
                if (mouseLocs.length > mouse_locs_tracked) {
                    mouseLocs.shift();
                }
            });
        })
    };
})(jQuery);


/*
    Jtab
*/
(function($) {
    $.fn.Jtab = function(option, callback) {
        if(!this.length)return;
        if (typeof option == "function") {
            callback = option;
            option = {};
        }
        var settings = $.extend({
            type: "static",
            auto: false,
            event: "mouseover",
            currClass: "curr",
            source: "data-tag",
            hookKey:"data-widget",
            hookItemVal: "tab-item",
            hookContentVal: "tab-content",
            stay: 5000,
            delay: 100,
            threshold:null,
            mainTimer: null,
            subTimer: null,
            index: 0,
            compatible:false
        }, option || {});
        var items = $(this).find("*["+settings.hookKey+"="+settings.hookItemVal+"]"),
            contens = $(this).find("*["+settings.hookKey+"="+settings.hookContentVal+"]"),
            isUrl = settings.source.toLowerCase().match(/http:\/\/|\d|\.aspx|\.ascx|\.asp|\.php|\.html\.htm|.shtml|.js/g);

        if (items.length != contens.length) {
            return false;
        }

        var init = function(index, tag) {
            settings.subTimer = setTimeout(function() {
                items.eq(settings.index).removeClass(settings.currClass);
                if(settings.compatible){
                    contens.eq(settings.index).hide();
                }
                if (tag) {
                    settings.index++;
                    //settings.threshold=settings.threshold?settings.threshold:items.length;
                    if (settings.index == items.length) {
                        settings.index = 0;
                    }
                } else {
                    settings.index = index;
                }
                settings.type = (items.eq(settings.index).attr(settings.source) != null) ? "dynamic" : "static";
                rander();
            }, settings.delay);
        };
        var autoRun = function() {
            settings.mainTimer = setInterval(function() {
                init(settings.index, true);
            }, settings.stay);
        };
        var rander = function() {
            items.eq(settings.index).addClass(settings.currClass);
            if(settings.compatible){
                contens.eq(settings.index).show();
            }
            switch (settings.type) {
                default:
                case "static":
                    var source = "";
                    break;
                case "dynamic":
                    var source = (!isUrl) ? items.eq(settings.index).attr(settings.source) : settings.source;
                    items.eq(settings.index).removeAttr(settings.source);
                    break;
            }
            if (callback) {
                callback(source, contens.eq(settings.index), settings.index);
            }
        };
        items.each(function(i) {

            $(this).bind(settings.event, function() {
                clearTimeout(settings.subTimer);
                clearInterval(settings.mainTimer);

                init(i, false);
            }).bind("mouseleave", function() {
                if (settings.auto) {
                    autoRun();
                } else {
                    return;
                }
            });
        });
        if (settings.type == "dynamic") {
            init(settings.index, false);
        }
        if (settings.auto) {
            autoRun();
        }

    };
})(jQuery);

/*
    Jlazyload
*/
(function($){
    $.fn.Jlazyload=function(option,callback){
        if(!this.length)return;
        var settings=$.extend({
            type:null,
            offsetParent:null,
            source:"data-lazyload",
            placeholderImage:"http://misc.360buyimg.com/lib/img/e/blank.gif",
            placeholderClass:"loading-style2",
            threshold:200//阈值，控制显示位置，默认为200
        },option||{}),
        _this=this,_timer,_client,
        rect=function(object){
            var left = object.scrollLeft,
                top = object.scrollTop,
                width = object.offsetWidth,
                height = object.offsetHeight;
            while(object.offsetParent){
                left += object.offsetLeft;
                top += object.offsetTop;
                object = object.offsetParent;
            }
            return {
                left:left,
                top:top,
                width:width,
                height:height
            }
        },
        client=function(){
            var de=document.documentElement,
                dc=document.body,
                left = window.pageXOffset?window.pageXOffset:(de.scrollLeft || dc.scrollLeft),
                top =  window.pageYOffset?window.pageYOffset:(de.scrollTop || dc.scrollTop),
                width =  de.clientWidth,
                height = de.clientHeight;
            return {
                left:left,
                top:top,
                width:width,
                height:height
            }
        },
        intersect=function(rect1,rect2){
            var lc1, lc2, tc1, tc2, w1, h1,t = settings.threshold?parseInt(settings.threshold):0;
            lc1 = rect1.left + rect1.width / 2;
            lc2 = rect2.left + rect2.width / 2;
            tc1 = rect1.top + rect1.height / 2 ;
            tc2 = rect2.top + rect2.height / 2 ;
            w1 = (rect1.width + rect2.width) / 2 ;
            h1 = (rect1.height + rect2.height) / 2;
            return Math.abs(lc1 - lc2) < (w1+t) && Math.abs(tc1 - tc2) < (h1+t);
        },
        imagesInit=function(flag,source,object){
            if(settings.placeholderImage&&settings.placeholderClass){
                object.attr("src",settings.placeholderImage).addClass(settings.placeholderClass);
            }
            if(flag){
                object.attr("src",source).removeAttr(settings.source);
                if(callback)callback(source,object);
            }
        },
        textareaInit=function(flag,source,object){
            if(flag){
                var element=$("#"+source);
                element.html(object.val()).removeAttr(settings.source);
                object.remove();
                if(callback)callback(source,object);
            }
        },
        moduleInit=function(flag,source,object){
            if(flag){
                object.removeAttr(settings.source);
                if(callback)callback(source,object);
            }
        },
        init=function(){
            //alert(_this.length)
            _client=client(),
            _this=_this.filter(function(){
                return $(this).attr(settings.source);
            });
            $.each(_this,function(){
                var source=$(this).attr(settings.source);
                if(!source){
                    return;
                }
                var rect1=(!settings.offsetParent)?_client:rect($(settings.offsetParent).get(0)),
                    rect2=rect(this),
                    flag=intersect(rect1,rect2);
                switch(settings.type){
                    case "image":
                        imagesInit(flag,source,$(this));
                        break;
                    case "textarea":
                        textareaInit(flag,source,$(this));
                        break;
                    case "module":
                        moduleInit(flag,source,$(this));
                        break;
                    default:
                        break;
                }
            });
        },
        rander=function(){
            if(_this.length>0){
                clearTimeout(_timer);
                _timer=setTimeout(function(){
                    init();
                },10);
            }
        };
        init();
        if(!settings.offsetParent){
            $(window).bind("scroll",function(){
                rander();
            }).bind("reset",function(){
                rander();
            });
        }else{
            $(settings.offsetParent).bind("scroll",function(){
                rander();
            });
        }
    }
})(jQuery);

/*
    Jtimer
*/
(function($) {
    $.Jtimer = function(option,callback) {
        var settings=$.extend({
            pids:null,
            template:null,
            reset:null,
            mainPlaceholder:"timed",
            subPlaceholder:"timer",
            resetPlaceholder:"reset",
            iconPlaceholder:"icon",
            finishedClass:"",
            timer:[]
        },option||{}),
        timeFormat=function(t){
            var T = t.split(" "),
                A = T[0].split("-"),
                B = T[1].split(":");
            return new Date(A[0], A[1] - 1, A[2], B[0], B[1], B[2])
        },
        textFormat=function(t){
            if(String(t).length<2){
                t="0"+t
            }
            return t
        },
        init=function(index,data){
            if (data=={}||!data||!data.start||!data.end) {
                return;
            }
            var start = timeFormat(data.start),
                server = timeFormat(data.server),
                end = timeFormat(data.end),
                H, M, S, //timer,
                ST = (start - server) / 1000,
                ET = (end - server) / 1000,
                mainElement = "#"+settings.mainPlaceholder+index,
                subElement = "#"+settings.subPlaceholder+data.qid,
                resetElement = "#"+settings.resetPlaceholder+data.qid;
            if(ST <= 0 ){//&& ET > 0当抢购开始
                var html=settings.template.process(data);
                $(mainElement).html(html);
            };
            settings.timer[data.qid] = setInterval(function() {
                if (ST > 0) {//未开始
                    clearInterval(settings.timer[data.qid]);
                    return;
                } else {//已开始
                    if (ET > 0) {//未结束
                        H = Math.floor(ET / 3600);
                        M = Math.floor((ET - H * 3600) / 60);
                        S = (ET - H * 3600) % 60;
                        $(subElement).html("\u5269\u4f59<b>" + textFormat(H) + "</b>\u5c0f\u65f6<b>" + textFormat(M) + "</b>\u5206<b>" + textFormat(S) + "</b>\u79d2");
                        ET--;
                    } else {//已结束
                        $(subElement).html("\u62a2\u8d2d\u7ed3\u675f\uff01");
                        if(settings.iconPlaceholder){
                            iconElement = "#"+settings.iconPlaceholder+data.qid;
                            $(iconElement).attr("class",settings.finishedClass).html("\u62a2\u5b8c");
                        }
                        if(settings.reset){
                            $(subElement).append("<a href=\"javascript:void(0)\" id=\""+resetElement.substring(1)+"\">\u5237\u65b0</a>");
                            $(resetElement).bind("click",function(){
                                $.each(settings.timer,function(i){
                                    clearInterval(this);
                                });
                                settings.reset();
                            });
                        }
                        clearInterval(settings.timer[data.qid]);
                    }
                }
            }, 1000);
        },
        dataSort=function(a,b){
            return ((timeFormat(a.end)-timeFormat(a.server))-(timeFormat(b.end)-timeFormat(b.server)))
        };
        $.ajax({
            url:"http://qiang.jd.com/HomePageNewLimitBuy.ashx?callback=?",
            data:{"ids":settings.pids},
            dataType:"jsonp",
            success:function(json){
                if (json&&json.data) {
                    json.data.sort(dataSort);
                    $.each(json.data, function(i) {
                        init((i+1),json.data[i]);
                    })
                }
                if(callback)callback();
            }
        });
    }
})(jQuery);

/*
    Jslider
*/
(function($){
    $.fn.Jslider=function(option,callback){
        if(!this.length)return;
        if (typeof option == "function") {
            callback = option;
            option = {};
        }
        var settings=$.extend({
            auto:false,
            reInit:false,//重新初始化
            data:[],
            defaultIndex:0,
            slideWidth:0,
            slideHeight:0,
            slideDirection:1,//1,left;2,up;3,fadeIn
            speed:"normal",
            stay:5000,
            delay:150,
            maxAmount:null,
            template:null,
            showControls:true
        },option||{});

        var element=$(this),
        elementItems=null,
        elementControls=null,
        elementControlsItems=null,
        mainTimer=null,
        controlTimer=null,
        init=function(){
            var object;
            if(settings.maxAmount&&settings.maxAmount<settings.data.length){
                // settings.data.splice(settings.maxAmount);
                settings.data.splice(settings.maxAmount,settings.data.length-settings.maxAmount);
            }
            if(typeof settings.data=="object"){
                if(settings.data.length){
                    object={};
                    object.json=settings.data;
                }else{
                    object=settings.data;
                }
            }
            var template=settings.template;
            if(settings.reInit){
                var htmlItems,
                    htmlControls=template.controlsContent.process(object);
                object.json=object.json.slice(1);
                htmlItems=template.itemsContent.process(object);
                element.find(".slide-items").eq(0).append(htmlItems);
                element.find(".slide-controls").eq(0).html(htmlControls);
            }else{
                var newTemplate=template.itemsWrap.replace("{innerHTML}",template.itemsContent)+template.controlsWrap.replace("{innerHTML}",template.controlsContent),
                    html=newTemplate.process(object);
                element.html(html);
            }
            elementItems=element.find(".slide-items");
            elementControls=element.find(".slide-controls");
            elementControlsItems=elementControls.find("span");
            bindEvents();
            autoRun();
            if(callback)callback(element);
        },
        bindEvents=function(){
            elementControlsItems.bind("mouseover",function(){
                var index=elementControlsItems.index(this);
                if(index==settings.defaultIndex)return;
                clearTimeout(controlTimer);
                clearInterval(mainTimer);
                controlTimer=setTimeout(function(){
                    play(index);
                },settings.delay);
            }).bind("mouseleave",function(){
                clearTimeout(controlTimer);
                clearInterval(mainTimer);
                autoRun();
            });

            elementItems.bind("mouseover",function(){
                clearTimeout(controlTimer);
                clearInterval(mainTimer);
            }).bind("mouseleave",function(){
                autoRun();
            });
        },
        play=function(index){
            elementControlsItems.each(function(i){
                if(i==index){
                    $(this).addClass("curr");
                }else{
                    $(this).removeClass("curr");
                }
            });
            var left=0,top=0;
            if(settings.slideDirection==3){
                var children=elementItems.children(),
                last=children.eq(settings.defaultIndex),
                current=children.eq(index);
                last.css({"zIndex":0});
                current.css({"zIndex":1});
                last.fadeOut("fast");
                current.fadeIn("slow");
                settings.defaultIndex=index;
            }else{
                if(settings.slideDirection==1){//横向
                    elementItems.css({"width":settings.slideWidth*settings.data.length});
                    left=-settings.slideWidth*index
                }else{//纵向
                    top=-settings.slideHeight*index
                }
                elementItems.animate({
                    top:top+"px",
                    left:left+"px"
                },
                settings.speed,
                function(){
                    settings.defaultIndex=index
                })
            }
        },
        autoRun=function(){
            if(settings.auto){
                mainTimer=setInterval(function(){
                    var v=settings.defaultIndex;
                    v++;
                    if(v==settings.data.length){
                        v=0;
                    }
                    play(v);
                },settings.stay)
            }
        };
        init();
    }
})(jQuery);

/*
    pagination
*/
jQuery.fn.pagination = function(maxentries, opts) {
    opts = jQuery.extend({
        items_per_page: 10,
        num_display_entries: 10,
        current_page: 0,
        num_edge_entries: 0,
        link_to: "#",
        prev_text: "Prev",
        next_text: "Next",
        ellipse_text: "...",
        prev_show_always: true,
        next_show_always: true,
        callback: function() {
            return false;
        }
    }, opts || {});
    return this.each(function() {
        function numPages() {
            return Math.ceil(maxentries / opts.items_per_page);
        }

        function getInterval() {
            var ne_half = Math.ceil(opts.num_display_entries / 2);
            var np = numPages();
            var upper_limit = np - opts.num_display_entries;
            var start = current_page > ne_half ? Math.max(Math.min(current_page - ne_half, upper_limit), 0) : 0;
            var end = current_page > ne_half ? Math.min(current_page + ne_half, np) : Math.min(opts.num_display_entries, np);
            return [start, end];
        }

        function pageSelected(page_id, evt) {
            current_page = page_id;
            drawLinks();
            var continuePropagation = opts.callback(page_id, panel);
            if (!continuePropagation) {
                if (evt.stopPropagation) {
                    evt.stopPropagation();
                }
                else {
                    evt.cancelBubble = true;
                }
            }
            return continuePropagation;
        }

        function drawLinks() {
            panel.empty();
            var interval = getInterval();
            var np = numPages();
            if (np == 1) {
                $(".Pagination").css({
                    display: "none"
                });
            }
            var getClickHandler = function(page_id) {
                return function(evt) {
                    return pageSelected(page_id, evt);
                }
            }
            var appendItem = function(page_id, appendopts) {
                page_id = page_id < 0 ? 0 : (page_id < np ? page_id : np - 1);
                appendopts = jQuery.extend({
                    text: page_id + 1,
                    classes: ""
                }, appendopts || {});
                if (page_id == current_page) {
                    var lnk = $("<a href='javascript:void(0)' class='current'>" + (appendopts.text) + "</a>");
                }
                else {
                    var lnk = $("<a>" + (appendopts.text) + "</a>").bind("click", getClickHandler(page_id)).attr('href', opts.link_to.replace(/__id__/, page_id));
                }
                if (appendopts.classes) {
                    lnk.addClass(appendopts.classes);
                }
                panel.append(lnk);
            }
            if (opts.prev_text && (current_page > 0 || opts.prev_show_always)) {
                appendItem(current_page - 1, {
                    text: opts.prev_text,
                    classes: "prev"
                });
            }
            if (interval[0] > 0 && opts.num_edge_entries > 0) {
                var end = Math.min(opts.num_edge_entries, interval[0]);
                for (var i = 0; i < end; i++) {
                    appendItem(i);
                }
                if (opts.num_edge_entries < interval[0] && opts.ellipse_text) {
                    jQuery("<span>" + opts.ellipse_text + "</span>").appendTo(panel);
                }
            }
            for (var i = interval[0]; i < interval[1]; i++) {
                appendItem(i);
            }
            if (interval[1] < np && opts.num_edge_entries > 0) {
                if (np - opts.num_edge_entries > interval[1] && opts.ellipse_text) {
                    jQuery("<span>" + opts.ellipse_text + "</span>").appendTo(panel);
                }
                var begin = Math.max(np - opts.num_edge_entries, interval[1]);
                for (var i = begin; i < np; i++) {
                    appendItem(i);
                }
            }
            if (opts.next_text && (current_page < np - 1 || opts.next_show_always)) {
                appendItem(current_page + 1, {
                    text: opts.next_text,
                    classes: "next"
                });
            }
        }
        var current_page = opts.current_page;
        maxentries = (!maxentries || maxentries < 0) ? 1 : maxentries;
        opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0) ? 1 : opts.items_per_page;
        var panel = jQuery(this);
        this.selectPage = function(page_id) {
            pageSelected(page_id);
        }
        this.prevPage = function() {
            if (current_page > 0) {
                pageSelected(current_page - 1);
                return true;
            }
            else {
                return false;
            }
        }
        this.nextPage = function() {
            if (current_page < numPages() - 1) {
                pageSelected(current_page + 1);
                return true;
            }
            else {
                return false;
            }
        }
        drawLinks();
    });
};

/*
    jdThickbox
*/
(function($) {
    $.extend($.browser, {
        client: function() {
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight,
                bodyWidth: document.body.clientWidth,
                bodyHeight: document.body.clientHeight
            };
        },
        scroll: function() {
            var dds = document.documentElement.scrollTop;
            var dbs = document.body.scrollTop;
            var ddl = document.documentElement.scrollLeft;
            var dbl = document.body.scrollLeft;
            var top = !!dds ? dds : dbs;
            var left = !!ddl ? ddl : dbl;

            return {
                width: document.documentElement.scrollWidth,
                height: document.documentElement.scrollHeight,
                bodyWidth: document.body.scrollWidth,
                bodyHeight: document.body.scrollHeight,
                left: left,
                top: top
            };
        },
        screen: function() {
            return {
                width: window.screen.width,
                height: window.screen.height
            };
        },
        isIE6: $.browser.msie && $.browser.version == 6,
        isMinW: function(val) {
            return Math.min($.browser.client().bodyWidth, $.browser.client().width) <= val;
        },
        isMinH: function(val) {
            return $.browser.client().height <= val;
        }
    })
})(jQuery);
(function($) {
    $.fn.jdPosition = function(option) {
        var s = $.extend({
            mode: null
        }, option || {});
        switch (s.mode) {
        default:
        case "center":
            var ow = $(this).outerWidth(),
                oh = $(this).outerHeight();
            var w = $.browser.isMinW(ow),
                h = $.browser.isMinH(oh);

            $(this).css({
                left: $.browser.scroll().left + Math.max(($.browser.client().width - ow) / 2, 0) + "px",
                top: (!$.browser.isIE6)
                    ? (h ? $.browser.scroll().top : ($.browser.scroll().top + Math.max(($.browser.client().height - oh) / 2, 0) + "px"))
                    : (($.browser.scroll().top <= $.browser.client().bodyHeight - oh)
                        ? ($.browser.scroll().top + Math.max(($.browser.client().height - oh) / 2, 0) + "px")
                        : ($.browser.client().height - oh)/2 + "px")
            });
            break;
        case "auto":
            break;
        case "fixed":
            break
        }
    }
})(jQuery);


(function($) {
    $.fn.jdThickBox = function(option, callback) {
        if (typeof option == "function") {
            callback = option;
            option = {}
        };
        var s = $.extend({
            type: "text",
            source: null,
            width: null,
            height: null,
            title: null,
            _frame: "",
            _div: "",
            _box: "",
            _con: "",
            _loading: "thickloading",
            close: false,
            _close: "",
            _fastClose: false,
            _close_val: "×",
            _titleOn: true,
            _title: "",
            _autoReposi: false,
            _countdown: false,
            _thickPadding: 10,
            _wrapBorder:1
        }, option || {});
        var object = (typeof this != "function") ? $(this) : null;
        var timer;
        var close = function() {
            clearInterval(timer);
            $(".thickframe").add(".thickdiv").remove();
            $(".thickbox").empty().remove();
            if (s._autoReposi) {
                $(window).unbind("resize.jdThickBox").unbind("scroll.jdThickBox")
            }
        };
        if (s.close) {
            close();
            return false
        };
        var reg = function(str) {
            if (str != "") {
                return str.match(/\w+/)
            } else {
                return ""
            }
        };
        var init = function(element) {
            if ($(".thickframe").length == 0 || $(".thickdiv").length == 0) {
                $("<iframe class='thickframe' id='" + reg(s._frame) + "' marginwidth='0' marginheight='0' frameborder='0' scrolling='no'></iframe>").appendTo($(document.body));
                $("<div class='thickdiv' id='" + reg(s._div) + "'></div>").appendTo($(document.body))
            } else {
                $(".thickframe").add(".thickdiv").show()
            };
            $("<div class='thickbox' id='" + reg(s._box) + "'><div class='thickwrap'></div></div>").appendTo($(document.body));

            if ( $('.thickwrap') ) {
                $('.thickwrap').css('width', s.width + s._thickPadding*2 );
                s._wrapBorder = 1;
            }
            if (s._titleOn) initTitle(element);
            $("<div class='thickcon' id='" + reg(s._con) + "' style='width:" + s.width + "px;height:" + s.height + "px;'></div>").appendTo($(".thickwrap"));
            if (s._countdown) initCountdown();
            $(".thickcon").addClass(s._loading);

            reposi();
            initClose();
            inputData(element);
            if (s._autoReposi) {
                $(window).bind("resize.jdThickBox", reposi).bind("scroll.jdThickBox", reposi)
            };
            if (s._fastClose) {
                $(document.body).bind("click.jdThickBox", function(e) {
                    e = e ? e : window.event;
                    var tag = e.srcElement ? e.srcElement : e.target;
                    if (tag.className == "thickdiv") {
                        $(this).unbind("click.jdThickBox");
                        close()
                    }
                })
            }
        };
        var initCountdown = function() {
            var x = s._countdown;
            $("<div class='thickcountdown' style='width:" + s.width + "'><span id='jd-countdown'>" + x + "</span>秒后自动关闭</div>").appendTo($(".thickwrap"));
            timer = setInterval(function() {
                x--;
                $("#jd-countdown").html(x);
                if (x == 0) {
                    x = s._countdown;
                    close()
                }
            }, 1000)
        };
        var initTitle = function(element) {
            s.title = (s.title == null && element) ? element.attr("title") : s.title;
            $("<div class='thicktitle' id='" + reg(s._title) + "' style='width:" + s.width + "'><span>" + s.title + "</span></div>").appendTo($(".thickwrap"))
        };
        var initClose = function() {
            if (s._close != null) {
                $("<a href='#' class='thickclose' id='" + reg(s._close) + "'>" + s._close_val + "</a>").appendTo($(".thickwrap"));
                $(".thickclose").one("click", function() {
                    close();
                    return false
                })
            }
        };
        var inputData = function(element) {
            s.source = (s.source == null) ? element.attr("href") : s.source;
            switch (s.type) {
            default:
            case "text":
                $(".thickcon").html(s.source);
                $(".thickcon").removeClass(s._loading);
                if (callback) {
                    callback()
                };
                break;
            case "html":
                $(s.source).clone().appendTo($(".thickcon")).show();
                $(".thickcon").removeClass(s._loading);
                if (callback) {
                    callback()
                };
                break;
            case "image":
                s._index = (s._index == null) ? object.index(element) : s._index;
                $(".thickcon").append("<img src='" + s.source + "' width='" + s.width + "' height='" + s.height + "'>");
                s.source = null;
                $(".thickcon").removeClass(s._loading);
                if (callback) {
                    callback()
                };
                break;
            case "ajax":
            case "json":
                if (callback) {
                    callback(s.source, $(".thickcon"), function() {
                        $(".thickcon").removeClass(s._loading)
                    })
                };
                break;
            case "iframe":
                $("<iframe src='" + s.source + "' marginwidth='0' marginheight='0' frameborder='0' scrolling='no' style='width:" + s.width + "px;height:" + s.height + "px;border:0;'></iframe>").appendTo($(".thickcon"));
                $(".thickcon").removeClass(s._loading);
                if (callback) {
                    callback()
                };
                break
            }
        };
        var reposi = function() {
            var w1 = s._thickPadding*2 + parseInt(s.width);

            $(".thickcon").css({
                width: s.width,
                height:s.height,
                paddingLeft: s._thickPadding,
                paddingRight: s._thickPadding
            });

            // 修复IE9计算 outerHeight 问题: .thickcon在IE9中返回 undefined
            setTimeout(function() {
            $(".thickbox").css({
                    width: w1 + s._wrapBorder*2,
                    height: parseInt(s._titleOn ? $(".thicktitle").outerHeight() : 0) + parseInt($(".thickcon").outerHeight()) + s._wrapBorder*2
            });
            }, 100);

            $(".thickbox").jdPosition({
                mode: "center"
            });
            if ($.browser.isIE6) {
                var ow = $(".thickbox").outerWidth(),
                    oh = $(".thickbox").outerHeight();
                var w2 = $.browser.isMinW(ow),
                    h2 = $.browser.isMinH(oh);
                $(".thickframe").add(".thickdiv").css({
                    width: w2 ? ow : "100%",
                    height: Math.max($.browser.client().height, $.browser.client().bodyHeight) + "px"
                })
            }
        };
        if (object != null) {
            object.click(function() {
                init($(this));
                return false
            })
        } else {
            init()
        }
    };
    $.jdThickBox = $.fn.jdThickBox
})(jQuery);

function jdThickBoxclose() {
    $(".thickclose").trigger("click");
};

/*
    jdMarquee
*/
(function($) {
    $.fn.jdMarquee = function(option, callback) {
        if (typeof option == "function") {
            callback = option;
            option = {}
        };
        var s = $.extend({
            deriction: "up",
            speed: 10,
            auto: false,
            width: null,
            height: null,
            step: 1,
            control: false,
            _front: null,
            _back: null,
            _stop: null,
            _continue: null,
            wrapstyle: "",
            stay: 5000,
            delay: 20,
            dom: "div>ul>li".split(">"),
            mainTimer: null,
            subTimer: null,
            tag: false,
            convert: false,
            btn: null,
            disabled: "disabled",
            pos: {
                ojbect: null,
                clone: null
            }
        }, option || {});
        var object = this.find(s.dom[1]);
        var subObject = this.find(s.dom[2]);
        var clone;
        if (s.deriction == "up" || s.deriction == "down") {
            var height = object.eq(0).outerHeight();
            var step = s.step * subObject.eq(0).outerHeight();
            object.css({
                width: s.width + "px",
                overflow: "hidden"
            })
        };
        if (s.deriction == "left" || s.deriction == "right") {
            var width = subObject.length * subObject.eq(0).outerWidth();
            object.css({
                width: width + "px",
                overflow: "hidden"
            });
            var step = s.step * subObject.eq(0).outerWidth()
        };
        var init = function() {
            var wrap = "<div style='position:relative;overflow:hidden;z-index:1;width:" + s.width + "px;height:" + s.height + "px;" + s.wrapstyle + "'></div>";
            object.css({
                position: "absolute",
                left: 0,
                top: 0
            }).wrap(wrap);
            s.pos.object = 0;
            clone = object.clone();
            object.after(clone);
            switch (s.deriction) {
            default:
            case "up":
                object.css({
                    marginLeft: 0,
                    marginTop: 0
                });
                clone.css({
                    marginLeft: 0,
                    marginTop: height + "px"
                });
                s.pos.clone = height;
                break;
            case "down":
                object.css({
                    marginLeft: 0,
                    marginTop: 0
                });
                clone.css({
                    marginLeft: 0,
                    marginTop: -height + "px"
                });
                s.pos.clone = -height;
                break;
            case "left":
                object.css({
                    marginTop: 0,
                    marginLeft: 0
                });
                clone.css({
                    marginTop: 0,
                    marginLeft: width + "px"
                });
                s.pos.clone = width;
                break;
            case "right":
                object.css({
                    marginTop: 0,
                    marginLeft: 0
                });
                clone.css({
                    marginTop: 0,
                    marginLeft: -width + "px"
                });
                s.pos.clone = -width;
                break
            };
            if (s.auto) {
                initMainTimer();
                object.hover(function() {
                    clear(s.mainTimer)
                }, function() {
                    initMainTimer()
                });
                clone.hover(function() {
                    clear(s.mainTimer)
                }, function() {
                    initMainTimer()
                })
            };
            if (callback) {
                callback()
            };
            if (s.control) {
                initControls()
            }
        };
        var initMainTimer = function(delay) {
            clear(s.mainTimer);
            s.stay = delay ? delay : s.stay;
            s.mainTimer = setInterval(function() {
                initSubTimer()
            }, s.stay)
        };
        var initSubTimer = function() {
            clear(s.subTimer);
            s.subTimer = setInterval(function() {
                roll()
            }, s.delay)
        };
        var clear = function(timer) {
            if (timer != null) {
                clearInterval(timer)
            }
        };
        var disControl = function(A) {
            if (A) {
                $(s._front).unbind("click");
                $(s._back).unbind("click");
                $(s._stop).unbind("click");
                $(s._continue).unbind("click")
            } else {
                initControls()
            }
        };
        var initControls = function() {
            if (s._front != null) {
                $(s._front).click(function() {
                    $(s._front).addClass(s.disabled);
                    disControl(true);
                    clear(s.mainTimer);
                    s.convert = true;
                    s.btn = "front";
                    initSubTimer();
                    if (!s.auto) {
                        s.tag = true
                    };
                    convert()
                })
            };
            if (s._back != null) {
                $(s._back).click(function() {
                    $(s._back).addClass(s.disabled);
                    disControl(true);
                    clear(s.mainTimer);
                    s.convert = true;
                    s.btn = "back";
                    initSubTimer();
                    if (!s.auto) {
                        s.tag = true
                    };
                    convert()
                })
            };
            if (s._stop != null) {
                $(s._stop).click(function() {
                    clear(s.mainTimer)
                })
            };
            if (s._continue != null) {
                $(s._continue).click(function() {
                    initMainTimer()
                })
            }
        };
        var convert = function() {
            if (s.tag && s.convert) {
                s.convert = false;
                if (s.btn == "front") {
                    if (s.deriction == "down") {
                        s.deriction = "up"
                    };
                    if (s.deriction == "right") {
                        s.deriction = "left"
                    }
                };
                if (s.btn == "back") {
                    if (s.deriction == "up") {
                        s.deriction = "down"
                    };
                    if (s.deriction == "left") {
                        s.deriction = "right"
                    }
                };
                if (s.auto) {
                    initMainTimer()
                } else {
                    initMainTimer(4 * s.delay)
                }
            }
        };
        var setPos = function(y1, y2, x) {
            if (x) {
                clear(s.subTimer);
                s.pos.object = y1;
                s.pos.clone = y2;
                s.tag = true
            } else {
                s.tag = false
            };
            if (s.tag) {
                if (s.convert) {
                    convert()
                } else {
                    if (!s.auto) {
                        clear(s.mainTimer)
                    }
                }
            };
            if (s.deriction == "up" || s.deriction == "down") {
                object.css({
                    marginTop: y1 + "px"
                });
                clone.css({
                    marginTop: y2 + "px"
                })
            };
            if (s.deriction == "left" || s.deriction == "right") {
                object.css({
                    marginLeft: y1 + "px"
                });
                clone.css({
                    marginLeft: y2 + "px"
                })
            }
        };
        var roll = function() {
            var y_object = (s.deriction == "up" || s.deriction == "down") ? parseInt(object.get(0).style.marginTop) : parseInt(object.get(0).style.marginLeft);
            var y_clone = (s.deriction == "up" || s.deriction == "down") ? parseInt(clone.get(0).style.marginTop) : parseInt(clone.get(0).style.marginLeft);
            var y_add = Math.max(Math.abs(y_object - s.pos.object), Math.abs(y_clone - s.pos.clone));
            var y_ceil = Math.ceil((step - y_add) / s.speed);
            switch (s.deriction) {
            case "up":
                if (y_add == step) {
                    setPos(y_object, y_clone, true);
                    $(s._front).removeClass(s.disabled);
                    disControl(false)
                } else {
                    if (y_object <= -height) {
                        y_object = y_clone + height;
                        s.pos.object = y_object
                    };
                    if (y_clone <= -height) {
                        y_clone = y_object + height;
                        s.pos.clone = y_clone
                    };
                    setPos((y_object - y_ceil), (y_clone - y_ceil))
                };
                break;
            case "down":
                if (y_add == step) {
                    setPos(y_object, y_clone, true);
                    $(s._back).removeClass(s.disabled);
                    disControl(false)
                } else {
                    if (y_object >= height) {
                        y_object = y_clone - height;
                        s.pos.object = y_object
                    };
                    if (y_clone >= height) {
                        y_clone = y_object - height;
                        s.pos.clone = y_clone
                    };
                    setPos((y_object + y_ceil), (y_clone + y_ceil))
                };
                break;
            case "left":
                if (y_add == step) {
                    setPos(y_object, y_clone, true);
                    $(s._front).removeClass(s.disabled);
                    disControl(false)
                } else {
                    if (y_object <= -width) {
                        y_object = y_clone + width;
                        s.pos.object = y_object
                    };
                    if (y_clone <= -width) {
                        y_clone = y_object + width;
                        s.pos.clone = y_clone
                    };
                    setPos((y_object - y_ceil), (y_clone - y_ceil))
                };
                break;
            case "right":
                if (y_add == step) {
                    setPos(y_object, y_clone, true);
                    $(s._back).removeClass(s.disabled);
                    disControl(false)
                } else {
                    if (y_object >= width) {
                        y_object = y_clone - width;
                        s.pos.object = y_object
                    };
                    if (y_clone >= width) {
                        y_clone = y_object - width;
                        s.pos.clone = y_clone
                    };
                    setPos((y_object + y_ceil), (y_clone + y_ceil))
                };
                break
            }
        };
        if (s.deriction == "up" || s.deriction == "down") {
            if (height >= s.height && height >= s.step) {
                init()
            }
        };
        if (s.deriction == "left" || s.deriction == "right") {
            if (width >= s.width && width >= s.step) {
                init()
            }
        }
    }
})(jQuery);

/*
    $.login
*/
$.login = function(options) {
    options = $.extend({
        loginService: "http://passport."+ pageConfig.FN_getDomain() +"/loginservice.aspx?callback=?",
        loginMethod: "Login",
        loginUrl: "https://passport."+ pageConfig.FN_getDomain() +"/new/login.aspx",
        returnUrl: location.href,
        automatic: true,
        complete: null,
        modal: false
    }, options || {});
    if (options.loginService != "" && options.loginMethod != "") {
        $.getJSON(options.loginService, {
            method: options.loginMethod
        }, function(result) {
            if (result != null) {
                if (options.complete != null) {
                    options.complete(result.Identity)
                }
                if (!result.Identity.IsAuthenticated && options.automatic && options.loginUrl != "") {
                    if (options.modal) {
                        jdModelCallCenter.login()
                    } else {
                        location.href = options.loginUrl + "?ReturnUrl=" + escape(options.returnUrl)
                    }
                }
            }
        })
    }
};

/*
    friend

var jdFriendUrl = 'http://club.jd.com/jdFriend/TuiJianService.aspx';

function FriendScript() {
    var param = getparam();
    if (param != "") {
        var js = document.createElement('script');
        js.type = 'text/javascript';
        js.src = jdFriendUrl + '?roid=' + Math.random() + param;
        js.charset = 'GB2312';
        document.getElementsByTagName('head')[0].appendChild(js)
    }
}
window.onload = function() {
    FriendScript()
};
*/
function getparam() {
    var sid = "";
    var type = "";
    var args = new Object();
    var query = location.search.substring(1);
    var pairs = query.split("&");
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('=');
        if (pos == -1) continue;
        var argname = pairs[i].substring(0, pos);
        if (pairs[i].substring(0, pos) == "sid") {
            sid = unescape(pairs[i].substring(pos + 1))
        }
        if (pairs[i].substring(0, pos) == "t") {
            type = unescape(pairs[i].substring(pos + 1))
        }
    }
    if (sid != "" || type != "") {
        return "&sid=" + escape(sid) + "&t=" + escape(type)
    } else {
        return ""
    }
};

/*
    jdCalcul
*/
(function($) {
    $.jdCalcul = function(pids) {
        var arr = null;
        var pids = pids.join(",");
        var dataUrl = "http://qiang.jd.com/HomePageLimitBuy.ashx?callback=?&ids=" + pids;
        var purl = "http://item.jd.com/";
        var init = function(data) {
            var s = $.extend({
                contentid: "#limit",
                clockid: "#clock",
                rankid: "#rank",
                limitid: "#limitbuy"
            },
            data || {});
            if (data == {} || data == "" || s.start == null || s.start == "" || s.end == null || s.end == ""  || s.pros.length < 1) {
                return;
            };
            s.start = format(s.start);
            s.start = ($.browser.mozzia) ? Date.parse(s.start) : s.start;
            s.server = format(s.server);
            s.server = ($.browser.mozzia) ? Date.parse(s.server) : s.server;
            s.end = format(s.end);
            s.end = ($.browser.mozzia) ? Date.parse(s.end) : s.end;
            s.contentid = $(s.contentid + s.qid);
            s.clockid = $(s.clockid + s.qid);
            s.rankid = $(s.rankid + s.qid);
            s.limitid = $(s.limitid + s.qid);
            var ST = (s.start - s.server) / 1000,
            H,
            M,
            S,
            timer;
            var ET = (s.end - s.server) / 1000;
            var createHtml = function() {
                var html = "<li><div class=\"p-img\"><a href=\"{6}{0}.html\" target=\"_blank\"><img src=\"{1}\" width=\"100\" height=\"100\" /></a>{2}</div><div class=\"p-name\"><a href=\"{6}{0}.html\" target=\"_blank\">{3}</a></div><div class=\"p-price\">抢购价：<strong>{4}</strong>{5}</div></li>";
                var html1 = "<ul>";
                $.each(s.pros,
                function(i) {
                    var id = s.pros[i].id,
                    tp = s.pros[i].tp,
                    zt = (s.pros[i].zt == 1) ? "<div class='pi9'></div>": "<div class='pi10'></div>",
                    mc = unescape(s.pros[i].mc),
                    qg = s.pros[i].qg,
                    zk = "(" + s.pros[i].zk + "折)";
                    html1 += html.replace(/\{0\}/g, id).replace("{1}", tp).replace("{2}", zt).replace("{3}", mc).replace("{4}", qg).replace("{5}", zk).replace(/\{6\}/g, purl);
                });
                html1 += "</ul>";
                s.contentid.html(html1);
            };
            var run = function() {
                if (ST > 0) {
                    return;
                } else {
                    if (ET > 0) {
                        H = Math.floor(ET / 3600);
                        M = Math.floor((ET - H * 3600) / 60);
                        S = (ET - H * 3600) % 60;
                        s.clockid.html("剩余<b>" + H + "</b>小时<b>" + M + "</b>分<b>" + S + "</b>秒");
                        ET--;
                    } else {
                        s.clockid.html("抢购结束");
                        clearInterval(timer);
                        s.limitid.hide();
                        if (s.rankid.length > 0) {
                            s.rankid.show();
                        }
                    }
                }
            };
            if (ST <= 0 && ET > 0) {
                createHtml();
                if (s.rankid.length > 0) {
                    s.rankid.hide();
                }
                s.limitid.show();
            };
            run();
            timer = setInterval(function() {
                run()
            },
            1000);
        };
        var format = function(t) {
            var T = t.split(" ");
            var A = T[0].split("-");
            var B = T[1].split(":");
            return new Date(A[0], A[1] - 1, A[2], B[0], B[1], B[2]);
        };
        $.ajax({
            url: dataUrl,
            dataType: "jsonp",
            success: function(json) {
                if (json) {
                    arr = json.data;
                    $.each(arr,
                    function(i) {
                        init(arr[i]);
                    })
                }
            }
        })
    }
})(jQuery);

/*
    mlazyload
*/
function mlazyload(option) {
    var settings = {
        defObj: null,
        defHeight: 0,
        fn: null
    };
    settings = $.extend(settings, option || {});
    var defHeight = settings.defHeight,
        defObj = (typeof settings.defObj == "object") ? settings.defObj : $(settings.defObj);
    if (defObj.length < 1) {
        return
    };
    var pageTop = function() {
        var d = document,
            y = (navigator.userAgent.toLowerCase().match(/iPad/i) == "ipad") ? window.pageYOffset : Math.max(d.documentElement.scrollTop, d.body.scrollTop);
        return d.documentElement.clientHeight + y - settings.defHeight
    };
    var moduleLoad = function() {
        if (defObj.offset().top <= pageTop() && !defObj.attr("load")) {
            defObj.attr("load", "true");
            if (settings.fn) {
                settings.fn();
            }
        }
    };
    moduleLoad();
    $(window).bind("scroll", function() {
        moduleLoad();
    });
}

/*
    getrecent
*/
var jdRecent = {
    element: $("#recent ul"),
    jsurl: "http://www.jd.com/lishiset.aspx?callback=jdRecent.setData&id=",
    cookiename: "_recent",
    list: $.cookie("_recent"),
    url: location.href,
    init: function() {
        var _matchStr = this.url.match(/\/(\d{6}).html/);
        var _id = (_matchStr != null && _matchStr[0].indexOf("html") != -1) ? _matchStr[1] : "";
        if (!this.list || this.list == null || this.list == "") {
            if (_id == "") {
                return this.getData(0);
            } else {
                this.list = _id;
            }
        } else {
            if (_id == "" || this.list.indexOf(_id) != -1) {
                this.list = this.list;
            } else {
                if (this.list.split(".").length >= 10) {
                    this.list = this.list.replace(/.\d+$/, "");
                }
                this.list = _id + "." + this.list;
            }
        }
        $.cookie(this.cookiename, this.list, {
            expires: 7,
            path: "/",
            domain: "jd.com",
            secure: false
        });
        this.getData(this.list);
    },
    clear: function() {
        $.cookie(this.cookiename, "", {
            expires: 7,
            path: "/",
            domain: "jd.com",
            secure: false
        });
    },
    getData: function(list) {
        if (list == 0) {
            this.element.html("<li><div class='norecode'>暂无记录!</div></li>");
            return;
        }
        var rec = list.split(".");
        for (i in rec) {
            if (i == 0) {
                this.element.empty()
            };
            $.getJSONP(this.jsurl + rec[i], this.setData);
        }
    },
    setData: function(result) {
        this.element.append("<li><div class='p-img'><a href='" + result.url + "'><img src='" + result.img + "' /></a></div><div class='p-name'><a href='" + result.url + "'>" + decodeURIComponent(result.name) + "</a></div></li>");
    }
};
$("#clearRec").click(function() {
    jdRecent.clear();
    jdRecent.getData(0);
});
mlazyload({
    defObj: "#recent",
    defHeight: 50,
    fn: function() {
        if (jdRecent.element.length == 1) {
            jdRecent.init();
        }
    }
});


/*
    jdModelCallCenter#20110126
*/
var jdModelCallCenter = {
    settings: {
        clstag1: 0,
        clstag2: 0
    },
    tbClose: function() {
        if ($(".thickbox").length != 0) {
            jdThickBoxclose()
        }
    },
    login: function() {
        this.tbClose();
        var _this = this;
        var userAgent = navigator.userAgent.toLowerCase(),
            flag = (userAgent.match(/ucweb/i) == "ucweb" || userAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4");
        if (flag) {
            location.href = "https://passport."+ pageConfig.FN_getDomain() +"/new/login.aspx?ReturnUrl=" + escape(location.href);
            return;
        }
        setTimeout(function() {
            $.jdThickBox({
                type: "iframe",
                title: "您尚未登录",
                source: "http://passport.jd.com/uc/popupLogin2013?clstag1=" + _this.settings.clstag1 + "&clstag2=" + _this.settings.clstag2 + "&r=" + Math.random(),
                width: 390,
                height: 450,
                _title: "thicktitler",
                _close: "thickcloser",
                _con: "thickconr"
            })
        }, 20)
    },
    regist: function() {
        var _this = this;
        this.tbClose();
        setTimeout(function() {
            $.jdThickBox({
                type: "iframe",
                title: "您尚未登录",
                source: "http://reg.jd.com/reg/popupPerson?clstag1=" + _this.settings.clstag1 + "&clstag2=" + _this.settings.clstag2 + "&r=" + Math.random(),
                width: 390,
                height: 450,
                _title: "thicktitler",
                _close: "thickcloser",
                _con: "thickconr"
            })
        }, 20)
    },
    init: function() {
        var _this = this;

        $.ajax({
            url: ('https:' == document.location.protocol ? 'https://' : 'http://') + "passport."+ pageConfig.FN_getDomain() +"/new/helloService.ashx?m=ls&sso=0",
            dataType:"jsonp",
            success:function(json){
                _this.tbClose();
                if(json&&json.info){
                    $("#loginbar").html(json.info);
                }
                _this.settings.fn();
            }
        });
/*        $.getJSON("http://passport.360buy.com/new/loginwebservice.aspx?callback=?", {
            method: "GetHello"
        }, function(result) {
            _this.tbClose();
            if (result && result.info != "") {
                $("#shortcut .fore1").html(result.info)
            }
            _this.settings.fn()
        })*/
    }
};


/*
    autoLocation#20110411
*/
$.extend(jdModelCallCenter, {
    autoLocation: function(url) {
        var _this = this;
        $.login({
            modal: true,
            complete: function(result) {
                if (result != null && result.IsAuthenticated != null && result.IsAuthenticated) {
                    window.location = url
                }
            }
        })
    }
});

/*
    doAttention
*/
$.extend(jdModelCallCenter, {
    doAttention: function(productId) {
        //var serviceUrl = "http://t."+ pageConfig.FN_getDomain() +"/regard/follow.action?callback=?";
        var serviceUrl = 'http://t.jd.com/product/followProduct.action?productId=' + productId;

        $.login({
            modal: true,
            complete: function(result) {

                if (result != null && result.IsAuthenticated != null && result.IsAuthenticated) {

                    var widthA = 510;
                    var heightA = 440;

                    $.jdThickBox({
                        type: "iframe",
                        source: serviceUrl + "&t=" + Math.random(),
                        width: widthA,
                        height: heightA,
                        title: "提示",
                        _box: "attboxr",
                        _con: "attconr",
                        _countdown: false
                    }, function() {

                        var _mvq = window._mvq = window._mvq || [];
                        _mvq.push([ '$setGeneral', 'concern', '', '', '' ]);
                        _mvq.push([ '$addItem', '', productId, '', '', '' ]);
                        _mvq.push([ '$logData' ]);

                    });

                }
            }
        })
    }
});

/*
    btn-coll
*/
$(".btn-coll").livequery("click", function() {
    var current = $(this);
    var productId = parseInt(current.attr("id").replace("coll", ""));
    $.extend(jdModelCallCenter.settings, {
        clstag1: "login|keycount|5|3",
        clstag2: "login|keycount|5|4",
        id: productId,
        fn: function() {
            jdModelCallCenter.doAttention(this.id)
        }
    });
    jdModelCallCenter.settings.fn()
});


////////////////////////////////////////////////////////////////////////////////页面公用模块

if ( typeof pageConfig !== 'undefined' ) {
    pageConfig.isHome = (function() {
        return pageConfig.navId&&pageConfig.navId=="home"&&location.href.indexOf('www.jd.com')>=0;
    })();
}

/**
* @bigiframe
*/
$.bigiframe = function(obj,width,height){
	if (obj && $.browser.msie && $.browser.version == 6) {
		if (typeof(width) == 'undefined') {
			var width = obj.outerWidth();
		}

		if (typeof(height) == 'undefined') {
			var height = obj.outerHeight();
		}

		var html  =  '<iframe src="javascript:false;" frameBorder="0" style="width:'+width+'px;height:'+height+'px;position:absolute;z-index:-1;opacity:0;filter:alpha(opacity=0);top:0;left:0;">';
		obj.append(html);
	}
}

/*
    category
*/
var category={
    OBJ:$("#_JD_ALLSORT"),
    URL_Serv:"http://www.360buy.com/ajaxservice.aspx?stype=SortJson",
    URL_BrandsServ:"http://d.360buy.com/brandVclist/get?callback=category.getBrandService&ids=a,915,925^b,916,926^c,917,927^d,918,928^e,919,929^f,920,930^g,921,931^h,922,932^i,923,933^j,924,934^k,2096,2097^l,3512,3513^m,5274,5275^p,6211,6212",
    FN_GetLink:function(type,obj){
        var linkUrl,linkText;
        switch(type){
            case 1:
                linkUrl=obj.u;
                linkText=obj.n;
                break;
            case 2:
                linkUrl=obj.split("|")[0];
                linkText=obj.split("|")[1];
                break;
        }
        if(linkUrl==""){
            return linkText;
        }else{
            if (!/^http[s]?:\/\/([\w-]+\.)+[\w-]+([\w-.\/?%&=]*)?$/.test(linkUrl)){
                linkUrl=linkUrl.replace(/-000$/,"");
                if(linkUrl.match(/^\d*-\d*$/)){
                    linkUrl="http://channel.jd.com/"+linkUrl+".html";
                }else{
                    linkUrl="http://list.jd.com/"+linkUrl+".html";
                }
            }
            return "<a href=\""+linkUrl+"\">"+linkText+"</a>";
        }
    },
    FN_SetLink:function(flag){
        var html="";
        var clsDiy = pageConfig.isHome ? 'clstag="homepage|keycount|home2013|0604e"' : '';
        var clsCellphone = pageConfig.isHome ? 'clstag="homepage|keycount|home2013|0603e"' : '';
        var clsJiaZhuangCheng = pageConfig.isHome ? 'clstag="homepage|keycount|home2013|0605e"' : '';

        switch(flag){
            case "c":
                html='<div class="categorys-links" id="categorys-links-diy" '+ clsDiy +'><a href="http://diy.jd.com/" target="_blank">DIY装机大师</a></div>';
                break;
            case "b":
                html='<div class="categorys-links" id="categorys-links-cellphone" '+ clsCellphone +'><a href="http://sale.jd.com/act/UaSsnjAKQNeyiY.html" target="_blank">JDPhone计划</a></div>';
                break;
            case "d":
                html='<div class="categorys-links" id="categorys-links-jzc" '+ clsJiaZhuangCheng +'><a href="http://channel.jd.com/jiazhuang.html" target="_blank">家装城</a></div>';
                break;
            // case "e":
            //     html="<div class='categorys-links' id='categorys-links-dpg' clstag='homepage|keycount|home2013|0606e'><a href='http://dapeigou.jd.com/'>搭配购</a></div>";
            //     break;
            default:
                break;
        }
        return html;
    },
    DATA_Simple:{
        "1":[
              {l:"http://book.jd.com/",n:"图书"},
              {l:"http://mvd.jd.com/",n:"音像"},
              {l:"http://e.jd.com/",n:"数字商品"}
        ],
        "2":[
             {l:"http://channel.jd.com/electronic.html",n:"家用电器"}
        ],
        "3":[
             {l:"http://shouji.jd.com/",n:"手机"},
             {l:"http://channel.jd.com/digital.html",n:"数码"}
        ],
        "4":[
             {l:"http://channel.jd.com/computer.html",n:"电脑、办公"}
        ],
        "5":[
             {l:"http://channel.jd.com/home.html",n:"家居"},
             {l:"http://channel.jd.com/furniture.html",n:"家具"},
             {l:"http://channel.jd.com/decoration.html",n:"家装"},
             {l:"http://channel.jd.com/kitchenware.html",n:"厨具"}
        ],
        "6":[
             {l:"http://channel.jd.com/clothing.html",n:"服饰内衣"},
             {l:"http://channel.jd.com/jewellery.html",n:"珠宝首饰"}
        ],
        "7":[
             {l:"http://channel.jd.com/beauty.html",n:"个护化妆"}
        ],
        "8":[
             {l:"http://channel.jd.com/shoes.html",n:"鞋靴"},
             {l:"http://channel.jd.com/bag.html",n:"箱包"},
             {l:"http://channel.jd.com/watch.html",n:"钟表"},
             {l:"http://channel.jd.com/1672-2615.html",n:"奢侈品"}
        ],
        "9":[
             {l:"http://channel.jd.com/sports.html",n:"运动户外"}
        ],
        "10":[
             {l:"http://channel.jd.com/auto.html",n:"汽车用品"}
        ],
        "11":[
              {l:"http://channel.jd.com/baby.html",n:"母婴"},
              {l:"http://channel.jd.com/toys.html",n:"玩具乐器"}
        ],
        "12":[
              {l:"http://channel.jd.com/food.html",n:"食品饮料"},
              {l:"http://channel.jd.com/wine.html",n:"酒类"},
              {l:"http://channel.jd.com/freshfood.html",n:"生鲜"}
        ],
        "13":[
              {l:"http://channel.jd.com/health.html",n:"营养保健"}
        ],
        "14":[
              {l:"http://caipiao.jd.com/",n:"彩票"},
              {l:"http://trip.jd.com/",n:"旅行"},
              {l:"http://chongzhi.jd.com/",n:"充值"},
              {l:"http://piao.jd.com/",n:"票务"}
        ]},
    TPL_Simple: '{for item in data}'
        +'<div class="item fore${parseInt(item_index)}">'
        +'    <span data-split="1" {if pageConfig.isHome} clstag="homepage|keycount|home2013|06{if parseInt(item_index)+1>9}${parseInt(item_index)+1}{else}0${parseInt(item_index)+1}{/if}a"{/if}>'
        +'        <h3>{for sItem in item}{if sItem_index!=0}、{/if}<a href="${sItem.l}">${sItem.n}</a>{/for}</h3>'
        +'        <s></s>'
        +'    </span>'
        +'</div>'
        +'{/for}'
        +'<div class="extra"><a href="http://www.jd.com/allSort.aspx">全部商品分类</a></div>',
    FN_InitSimple:function(){
        var html;
        var object={};
        var cat2013 = $('#categorys-2013');

        object.data=this.DATA_Simple;

        cat2013.addClass('categorys-2014');
        html=this.TPL_Simple.process(object);

		var o = $("#_JD_ALLSORT");
        o.html(html);
		$.bigiframe(o);
    },
    FN_GetData:function(){
        $.getJSONP(this.URL_Serv,category.getDataService);
    },
    FN_GetBrands:function(){
        $.getJSONP(this.URL_BrandsServ,category.getBrandService);
    },
    FN_RefactorJSON: function( data, perPageNum ) {
        var totalPage = data.length/perPageNum;
        var resData = [];

        for ( var i = 0; i < totalPage; i++ ) {
            resData.push({ 'tabs': [], 'increment': null, 'count': perPageNum, skuids: []});
        }

        var m = 0;
        for ( var k = 0; k < data.length; k++ ) {
            if ( k%perPageNum == 0 ) { m++; }

            resData[(m-1)]['tabs'].push( data[k] );
            resData[(m-1)]['increment'] = m;
            resData[(m-1)]['skuids'].push( data[k].wid );

        }

        return resData
    },
    renderItem: function (data, i) {
        var tplItemNormal = ''
            +'<div class="item fore${index+1}">'
            +'    <span data-split="1" {if pageConfig.isHome}clstag="homepage|keycount|home2013|0${601+parseInt(index)}a"{/if}><h3>${n}</h3><s></s></span>'
            +'    <div class="i-mc">'
            +'        <div onclick="$(this).parent().parent().removeClass(\'hover\')" class="close">×</div>'
            +'        <div class="subitem" {if pageConfig.isHome}clstag="homepage|keycount|home2013|0${601+parseInt(index)}b"{/if}>'
            +'            {for subitem in i}'
            +'            <dl class="fore${parseInt(subitem_index)+1}">'
            +'                <dt>${category.FN_GetLink(1,subitem)}</dt>'
            +'                <dd>{for link in subitem.i}<em>${category.FN_GetLink(2,link)}</em>{/for}</dd>'
            +'            </dl>'
            +'            {/for}'
            +'        </div>'
            +'        <div class="cat-right-con fr" id="JD_sort_${t}"><div class="loading-style1"><b></b>加载中，请稍候...</div></div>'
            +'    </div>'
            +'</div>';

        // 本地生活、旅游出行
        var tplItemVirtuals = ''
            +'<div class="item item-col2 fore${index+1}">'
            +'    <span data-split="1" {if pageConfig.isHome}clstag="homepage|keycount|home2013|0${601+parseInt(index)}a"{/if}><h3>${n}</h3><s></s></span>'
            +'    <div class="i-mc">'
            +'        <ul class="title-list lh">'
            +'            <li class="fore1"><a href="http://chongzhi.jd.com/">充值缴费</a></li>'
            +'            <li class="fore2"><a href="http://caipiao.jd.com/">京东彩票</a></li>'
            +'            <li class="fore3"><a href="http://channel.jd.com/4938-12316.html">培训教育</a></li>'
            +'            <li class="fore4"><a href="http://jipiao.jd.com/ticketquery/flightHotcity.action">优选机票</a></li>'
            +'            <li class="fore5"><a href="http://channel.jd.com/4938-12300.html">旅行签证</a></li>'
            +'        </ul>'
            +'        <div onclick="$(this).parent().parent().removeClass(\'hover\')" class="close">×</div>'
            +'        <div class="subitem" {if pageConfig.isHome}clstag="homepage|keycount|home2013|0${601+parseInt(index)}b"{/if}>'
            +'            {for item in i}'
            +'            <div class="sub-item-col sub-item-col${item_index} fl">'
            +'                {for subitem in item.tabs}'
            +'                <dl class="fore${parseInt(subitem_index)+1}">'
            +'                    <dt>${category.FN_GetLink(1,subitem)}</dt>'
            +'                    <dd>{for link in subitem.i}<em>${category.FN_GetLink(2,link)}</em>{/for}</dd>'
            +'                </dl>'
            +'                {/for}'
            +'            </div>'
            +'            {/for}'
            +'        </div>'
            +'    </div>'
            +'</div>';

        if ( data.t == 'l' ) {
            return tplItemVirtuals.process(data);
        } else {
            return tplItemNormal.process(data);
        }
    },
    FN_GetBrands:function(){
        $.getJSONP(this.URL_BrandsServ,category.getBrandService);
    },
    getDataService:function(data){
        var resHTML = [];
        var _this = this;

        $.each(data.data, function (i) {
            this.index = i;

            // JSON 分组
            if (this.t == 'l') {
                this.i = _this.FN_RefactorJSON(this.i, 7);
            }

            resHTML.push( _this.renderItem(this, i) );
        });

        resHTML.push( '<div class="extra"><a {if pageConfig.isHome}clstag="homepage|keycount|home2013|0614a"{/if} href="http://www.jd.com/allSort.aspx">全部商品分类</a></div>' );

        this.OBJ.attr("load","1").html(resHTML.join(''));

		$.bigiframe(this.OBJ);
        this.FN_GetBrands();

		var me = this;
		var objWidth = this.OBJ.outerWidth();
		var objHeight = this.OBJ.outerHeight();

        //this.OBJ.find(".item").Jdropdown({"delay":200});
		$('#_JD_ALLSORT').dropdown({"delay":0,onmouseleave:function(){$('#_JD_ALLSORT .item').removeClass('hover');}},function(object){
        // this.OBJ.find(".item").Jdropdown({"delay":200},function(object){
            var sTop=document.documentElement.scrollTop+document.body.scrollTop,
                oTop,
                iTop,
                nTop=$("#nav-2013").offset().top+39;
            if(sTop<=nTop){
                //当全部商品分类模块顶部显示时
                if(object.hasClass("fore13")){
                    //iTop=23;
                    iTop=3;
                }else{
                    iTop=3;
                }
                sTop=iTop;
            }else{
                //当全部商品分类模块顶部显示在屏幕外时
                oTop=object.offset().top;
                if(sTop>oTop-5){
                    sTop=oTop-nTop-10;
                }else{
                    sTop=Math.max(3,sTop-nTop);
                }
            }

			var i_mc = object.find(".i-mc");
            i_mc.css({"top":sTop+"px"});

			if (me.OBJ.find('iframe')) {
				var w = i_mc.outerWidth() + objWidth;
				var h = i_mc.outerHeight() > objHeight ?  i_mc.outerHeight() : objHeight;
				me.OBJ.find('iframe').css({
					width:w,
					height:h,
					top:sTop
				})
			}
        });
    },
    getRightAreaTPL: function(id) {
        var tplRightEntrance = '';
        var tplPromotions = '';
        var tplBrands = '';

        var result = '';

        // 右上角入口链接
        tplRightEntrance = this.FN_SetLink(id);

        // 广告图
        tplPromotions = ''
            +'{if p.length!=0}'
            +'<dl class="categorys-promotions">'
            +'    <dd>'
            +'        <ul>'
            +'            {for item in p}'
            +'            <li>'
            +'                <a href="${item.u}" target="_blank">'
            +'                {if item.i}'
            +'                    <img src="${item.i}" width="194" height="70" title="${item.n}" />'
            +'                {else}'
            +'                    ${item.n}'
            +'                {/if}'
            +'                </a>'
            +'            </li>'
            +'            {/for}'
            +'        </ul>'
            +'    </dd>'
            +'</dl>'
            +'{/if}';

        // 推荐品牌列表
        tplBrands = ''
            +'{if b.length!=0}'
            +'<dl class="categorys-brands">'
            +'    {if id=="k"}'
            +'        <dt>推荐品牌出版商/书店</dt>'
            +'    {else}'
            +'        {if id=="l"}'
            +'        <dt>推荐产品</dt>'
            +'        {else}'
            +'        <dt>推荐品牌</dt>'
            +'        {/if}'
            +'    {/if}'
            +'    <dd>'
            +'        <ul>'
            +'            {for item in b} <li><a href="${item.u}" target="_blank">${item.n}</a></li> {/for}'
            +'        </ul>'
            +'    </dd>'
            +'</dl>'
            +'{/if}';

        // 推荐品牌在上，广告图片在下
        if ( /c|b|d/.test(id) ) {
            result = tplRightEntrance + tplBrands + tplPromotions;
        } else {
            result = tplRightEntrance + tplPromotions + tplBrands;
        }

        return result;
    },
    getBrandService:function(json){
        var _this=this,
            data=json.data;
        this.OBJ.attr("load","2");


        $.each(data,function(i){
            var id = this.id;
            var TPL = _this.getRightAreaTPL(id);

            // 本地生活、游泳出行分类
            if ( id !== 'l' ) {
                $("#JD_sort_"+id).html(TPL.process(this));
            }

        });

        $('.cat-right-con').each(function(i) {
            if (pageConfig.isHome) {
                $(this).find('.categorys-promotions').attr( 'clstag', 'homepage|keycount|home2013|0' + (601+i) + 'c' );
                $(this).find('.categorys-brands').attr( 'clstag', 'homepage|keycount|home2013|0' + (601+i) + 'd' );
            }

        });
    },
    FN_Init:function(){
        if(!this.OBJ.length)return;
        if(!this.OBJ.attr("load")){
            if(window.pageConfig&&window.pageConfig.pageId!=0){
                this.FN_InitSimple();
            }
            if($("#categorys").length){
                $("#categorys").Jdropdown({"delay":200});
            }else{
                $("#categorys-2013").Jdropdown({"delay":200});
            }
        }
        var _this=this;
        this.OBJ.one("mouseover",function(){
            var flag=_this.OBJ.attr("load");
            if (!flag){
                _this.FN_GetData();
            }else if(flag==1){
                _this.FN_GetBrands();
            }else{
                return;
            }
        })
    }
};


//我的京东
var UC={
    DATA_Cookie:"aview",
    TPL_UnRegist:"<div class=\"prompt\">\
            <span class=\"fl\">您好，请<a href=\"javascript:login()\" clstag=\"homepage|keycount|home2013|04a\">登录</a></span>\
            <span class=\"fr\"></span>\
        </div>",
    TPL_Regist:"<div class=\"prompt\">\
                <span class=\"fl\"><strong>${Name}</strong></span>\
                <span class=\"fr\"><a href=\"http://home.jd.com/\">去我的京东首页&nbsp;&gt;</a></span>\
            </div>",
    TPL_OList:{
        placeholder:"<div id=\"jduc-orderlist\"></div>",
        fragment:"<div class=\"orderlist\">\
                <div class=\"smt\">\
                    <h4>最新订单状态：</h4>\
                    <div class=\"extra\"><a href=\"http://jd2008.jd.com/JdHome/OrderList.aspx\" target=\"_blank\">查看所有订单&nbsp;&gt;</a></div>\
                </div>\
                <div class=\"smc\">\
                    <ul>\
                        {for item in orderList}\
                        <li class=\"fore${parseInt(item_index)+1}\">\
                            <div class=\"p-img fl\">\
                                {for image in item.OrderDetail}\
                                    {if image_index<2}\
                                        <a href=\"http://www.jd.com/product/${image.ProductId}.html\" target=\"_blank\"><img src=\"${pageConfig.FN_GetImageDomain(image.ProductId)}n5/${image.ImgUrl}\" width=\"50\" height=\"50\" alt=\"${image.ProductName}\" /></a>\
                                    {/if}\
                                {/for}\
                                {if item.OrderDetail.length>2}\
                                    <a href=\"${item.passKeyUrl}\" target=\"_blank\" class=\"more\">更多</a>\
                                {/if}\
                            </div>\
                            <div class=\"p-detail fr\">\
                                订单号：${item.OrderId}<br />\
                                状　态：<span>${UC.FN_SetState(item.OrderState)}</span><br />\
                                　　　　<a href=\"${item.passKeyUrl}\">查看详情</a>\
                            </div>\
                        </li>\
                        {/for}\
                    </ul>\
                </div>\
            </div>"
    },
    TPL_UList:"<div class=\"uclist\">\
                <ul class=\"fore1 fl\">\
                    <li><a target=\"_blank\" clstag=\"homepage|keycount|home2013|04b\" href=\"http://jd2008.jd.com/JdHome/OrderList.aspx\">待处理订单<span id=\"num-unfinishedorder\"></span></a></li>\
                    <li><a target=\"_blank\" clstag=\"homepage|keycount|home2013|04c\" href=\"http://jd2008.jd.com/user_spzx.aspx\">咨询回复<span id=\"num-consultation\"></span></a></li>\
                    <li><a target=\"_blank\" clstag=\"homepage|keycount|home2013|04d\" href=\"http://t.jd.com/product/followProductList.action?isReduce=true\">降价商品<span id=\"num-reduction\"></span></a></li>\
                    <li><a target=\"_blank\" clstag=\"homepage|keycount|home2013|04e\" href=\"http://quan.jd.com/user_quan.action\">优惠券<span id=\"num-ticket\"></span></a></li>\
                </ul>\
                <ul class=\"fore2 fl\">\
                    <li><a target=\"_blank\" clstag=\"homepage|keycount|home2013|04i\" href=\"http://t.jd.com/home/follow\">我的关注&nbsp;&gt;</a></li>\
                    <li><a target=\"_blank\" clstag=\"homepage|keycount|home2013|04g\" href=\"http://bean.jd.com/myJingBean/list\">我的京豆&nbsp;&gt;</a></li>\
                    <li><a target=\"_blank\" clstag=\"homepage|keycount|home2013|04h\" href=\"http://my.jd.com/personal/guess.html\">为我推荐&nbsp;&gt;</a></li>\
                    <li><a target=\"_blank\" clstag=\"homepage|keycount|home2013|shouhou\" href=\"http://myjd.jd.com/repair/orderlist.action\">返修退换货&nbsp;&gt;</a></li>\
                </ul>\
            </div>",
    TPL_VList:{
        placeholder:"<div class=\"viewlist\">\
                <div class=\"smt\" clstag=\"homepage|keycount|home2013|04k\">\
                    <h4>最近浏览的商品：</h4>\
                    <div style=\"float:right;padding-right:9px;\"><a style=\"border:0;color:#005EA7\" href=\"http://my.jd.com/history/list.html\" target=\"_blank\">查看浏览历史&nbsp;&gt;</a></div>\
                </div>\
                <div class=\"smc\" id=\"jduc-viewlist\" clstag=\"homepage|keycount|home2013|04j\">\
                    <div class=\"loading-style1\"><b></b>加载中，请稍候...</div>\
                    <ul class=\"lh hide\"></ul>\
                </div>\
            </div>",
        fragment:"{for item in list}<li><a href=\"http://item.jd.com/${item.wid}.html\" target=\"_blank\" title=\"${item.wname}\"><img src=\"${pageConfig.FN_GetImageDomain(item.wid)}n5/${item.imgUrl}\" width=\"50\" height=\"50\" alt=\"${item.wname}\" /></a></li>{/for}"
    },
    FN_SetState:function(word){
        var word=word;
        if(word.length>4){
            word="<span title="+word+">"+word.substr(0,4)+"...</span>"
        }
        return word;
    },
    FN_InitNewVList: function(vlist) {

        var list = !!vlist ? vlist.split('|') : [],
            len = list.length,
            res = [], resSkus, i = 0;

        while (i < len) {
            res.push(list[i].split('.')[1]);
            i++;
        }

        resSkus = res.join(',');
        $.getJSONP("http://my.jd.com/product/info.html?ids="+ resSkus +"&jsoncallback=UC.FN_ShowVList");
    },
    FN_InitVList:function(vlist){
        var list = JSON.parse(vlist),
            len = list.length,
            skus = ',';

        for ( var i = 0; i < len; i++ ) {
            if ( !new RegExp(list[i]['s']).test(skus) ) {
                skus += (list[i]['s'] + ',');
            }
        }
        skus = skus.replace(/(^,*)|(,*$)/g, '');

        $.getJSONP("http://my.jd.com/product/info.html?ids="+skus+"&jsoncallback=UC.FN_ShowVList");

    },
    FN_ShowVList:function(data){
        if (!data) {
            return;
        }
        var loading=$("#jduc-viewlist").find(".loading-style1");
        data.length = data.length > 5 ? 5 : data.length;
        var resData = { list: data };

        if(loading.length>0){
            loading.hide();
        }
        var html=this.TPL_VList.fragment.process(resData);
        $("#jduc-viewlist").find("ul").eq(0).html(html).show();
    },
    FN_setWords:function(num){
        var html="<font style=\"color:{0}\">({1})</font>",
            color="";
        if(num==0){
            color="#ccc";
        }else{
            color="#c00";
        }
        return pageConfig.FN_StringFormat(html,color,num)
    },
    FN_InitOList:function(){
        //initOrderlist
        $.ajax({
            url:"http://minijd.360buy.com/getOrderList",
            dataType:"jsonp",
            //timeout:5,
            success:function(json){
                if(json&&json.error==0&&json.orderList){
                    var html=UC.TPL_OList.fragment.process(json);
                    $("#jduc-orderlist").html(html);
                }
            }
        });

        //待处理订单
        $.ajax({
            //url : "http://top-t.360buy.com:8080/getHomeCount",
            url : "http://minijd.360buy.com/getHomeCount",
            dataType : "jsonp",
            success : function(json) {
                if (json && json.error==0) {
                    $("#num-unfinishedorder").html(UC.FN_setWords(json.orderCount));
                }
            }
        });

        //咨询回复
        $.ajax({
            url:"http://comm.360buy.com/index.php?mod=Consultation&action=havingReplyCount",
            dataType : "jsonp",
            success : function(json) {
                if (json) {
                    $("#num-consultation").html(UC.FN_setWords(json.cnt));
                }
            }
        });

        //降价商品
        $.ajax({
            // url : "http://t.360buy.com/follow/followProductCount.action",
            url : "http://follow.soa.jd.com/product/queryForReduceProductCount.action?",
            dataType : "jsonp",
            success : function(json) {
                if (json && json.data > 0) {
                    $("#num-reduction").html(UC.FN_setWords(json.data));
                }
            }
        });

        //优惠券
        $.ajax({
            url : "http://coupon.360buy.com/service.ashx",
            data : {
                m : "getcouponcount"
            },
            dataType : "jsonp",
            success : function(json) {
                if (json) {
                    $("#num-ticket").html(UC.FN_setWords(json.CouponCount));
                }
            }
        });
    }
};

//购物车结算
var MCART={
    DATA_Cookie:"cn",
    DATA_Amount:readCookie("cn")||"0",
    URL_Serv:"http://cart.jd.com/cart/miniCartServiceNew.action",
    TPL_Iframe:"<iframe scrolling=\"no\" frameborder=\"0\" marginheight=\"0\" marginwidth=\"0\" id=\"settleup-iframe\"></iframe>",
    TPL_NoGoods:"<div class=\"prompt\"><div class=\"nogoods\"><b></b>购物车中还没有商品，赶紧选购吧！</div></div>",
    TPL_List: {
        wrap: '<div id="settleup-content"><div class="smt"><h4 class="fl">最新加入的商品</h4></div><div class="smc"></div><div class="smb ar">共<b>${Num}</b>件商品　共计<strong>￥ ${TotalPromotionPrice.toFixed(2)}</strong><br><a href="http://cart.jd.com/cart/cart.html?r=${+new Date}" title="去购物车结算" id="btn-payforgoods">去购物车结算</a></div></div>',
        sigle: '<ul id="mcart-sigle">'
            +'{for list in TheSkus}'
            +'  <li>'
            +'      <div class="p-img fl"><a href="http://item.jd.com/${list.Id}.html" target="_blank"><img src="${pageConfig.FN_GetImageDomain(list.Id)}n5/${list.ImgUrl}" width="50" height="50" alt=""></a></div>'
            +'      <div class="p-name fl"><a href="http://item.jd.com/${list.Id}.html" title="${list.Name}" target="_blank">${list.Name}</a></div>'
            +'      <div class="p-detail fr ar">'
            +'          <span class="p-price"><strong>￥${list.PromotionPrice.toFixed(2)}</strong>×${list.Num}</span>'
            +'          <br>'
            +'          {if parseInt(list.FanPrice)>0}'
            +'          <span class="hl-green">返现：￥<em>${list.FanPrice}</em></span>'
            +'          <br>'
            +'          {/if}'
            +'          {if parseInt(list.Score)>0}'
            +'          <span class="hl-orange">送京豆：<em>${list.Score}</em></span>'
            +'          <br>'
            +'          {/if}'
            +'          <a class="delete" data-id="${list.Id}" data-type="RemoveProduct" href="#delete">删除</a>'
            +'      </div>'
            +'      {for jq in list.CouponAD}'
            +'      <div class="gift-jq">[赠券] 赠送${jq.Jing}京券 ${jq.LimitAd}</a></div>'
            +'      {/for}'
            +'  </li>'
            +'{/for}'
            +'</ul>',
        gift: '<ul id="mcart-gift">'
            +'{for list in TheGifts}'
            +'  <li>'
            +'      <div class="p-img fl"><a href="http://item.jd.com/${list.MainSKU.Id}.html" target="_blank"><img src="${pageConfig.FN_GetImageDomain(list.MainSKU.Id)}n5/${list.MainSKU.ImgUrl}" width="50" height="50" alt=""></a></div>'
            +'      <div class="p-name fl"><a href="http://item.jd.com/${list.MainSKU.Id}.html" title="${list.MainSKU.Name}" target="_blank">${list.MainSKU.Name}</a></div>'
            +'      <div class="p-detail fr ar">'
            +'          <span class="p-price"><strong>￥${list.PromotionPrice.toFixed(2)}</strong>×${list.Num}</span>'
            +'          <br>'
            +'          {if parseInt(list.FanPrice)>0}'
            +'          <span class="hl-green">返现：￥<em>${list.FanPrice}</em></span>'
            +'          <br>'
            +'          {/if}'
            +'          {if parseInt(list.Score)>0}'
            +'          <span class="hl-orange">送京豆：<em>${list.Score}</em></span>'
            +'          <br>'
            +'          {/if}'
            +'          <a class="delete" data-id="${list.MainSKU.Id}" data-type="RemoveProduct" href="#delete">删除</a>'
            +'      </div>'
            +'      {for gift in list.Skus}'
            +'      <div class="gift"><a href="http://item.jd.com/${gift.Id}.html" target="_blank">[{if gift.Type==2}赠品{/if}{if gift.Type==1}附件{/if}] ${gift.Name}</a></div>'
            +'      {/for}'
            +'      {for jq in list.CouponAD}'
            +'      <div class="gift-jq">[赠券] 赠送${jq.Jing}元京券 ${jq.LimitAd}</a></div>'
            +'      {/for}'
            +'  </li>'
            +'  {/for}'
            +'</ul>',
        suit: '{for suit in TheSuit}'
            +'<ul id="mcart-suit">'
            +'  <li class="dt">'
            +'      <div class="fl"><span>[套装]</span> ${suit.Name}</div>'
            +'      <div class="fr"><em>小计：￥${(suit.PromotionPrice*suit.Num).toFixed(2)}</em></div>'
            +'      <div class="clr"></div>'
            +'  </li>'
            +'  {for list in suit.Skus}'
            +'  <li>'
            +'      <div class="p-img fl"><a href="http://item.jd.com/${list.Id}.html" target="_blank"><img src="${pageConfig.FN_GetImageDomain(list.Id)}n5/${list.ImgUrl}" width="50" height="50" alt=""></a></div>'
            +'      <div class="p-name fl"><span></span><a href="http://item.jd.com/${list.Id}.html" title="${list.Name}" target="_blank">${list.Name}</a></div>'
            +'      <div class="p-detail fr ar">'
            +'          <span class="p-price"><strong>￥${list.PromotionPrice.toFixed(2)}</strong>×${list.Num}</span>'
            +'          <br>'
            +'          {if parseInt(list.FanPrice)>0}'
            +'          <span class="hl-green">返现：￥<em>${list.FanPrice}</em></span>'
            +'          <br>'
            +'          {/if}'
            +'          {if parseInt(list.Score)>0}'
            +'          <span class="hl-orange">送京豆：<em>${list.Score}</em></span>'
            +'          <br>'
            +'          {/if}'
            +'          <a class="delete" data-id="${list.Id}|${suit.Id}" data-type="RemoveSuit" href="#delete">删除</a>'
            +'      </div>'
            +'      {for gift in list.Gifts}'
            +'      <div class="gift"><a href="http://item.jd.com/${gift.Id}.html" target="_blank">[{if gift.Type==2}赠品{/if}{if gift.Type==1}附件{/if}] ${gift.Name}</a></div>'
            +'      {/for}'
            +'      {for jq in list.CouponAD}'
            +'      <div class="gift-jq">[赠券] 赠送${jq.Jing}元京券 ${jq.LimitAd}</a></div>'
            +'      {/for}'
            +'  </li>'
            +'  {/for}'
            +'</ul>'
            +'{/for}',
        mj: '{for mj in ManJian}'
            +'<ul id="mcart-mj">'
            +'  <li class="dt">'
            +'      <div class="fl"><span class="hl-green">满减</span>{if mj.ManFlag} 已购满{if mj.ManNum>0}${mj.ManNum}件{else}${mj.ManPrice}元{/if}，已减${mj.JianPrice}元{else}购满{if mj.ManNum>0}${mj.ManNum}件{else}${mj.ManPrice}元{/if}，即可享受满减优惠{/if}</div>'
            +'      <div class="fr"><em>小计：￥${(mj.PromotionPrice*mj.Num).toFixed(2)}</em></div>'
            +'      <div class="clr"></div>'
            +'  </li>'
            +'  {for list in mj.Skus}'
            +'  <li>'
            +'      <div class="p-img fl"><a href="http://item.jd.com/${list.Id}.html" target="_blank"><img src="${pageConfig.FN_GetImageDomain(list.Id)}n5/${list.ImgUrl}" width="50" height="50" alt=""></a></div>'
            +'      <div class="p-name fl"><span></span><a href="http://item.jd.com/${list.Id}.html" title="${list.Name}" target="_blank">${list.Name}</a></div>'
            +'      <div class="p-detail fr ar">'
            +'          <span class="p-price"><strong>￥${list.PromotionPrice.toFixed(2)}</strong>×${list.Num}</span>'
            +'          <br>'
            +'          {if parseInt(list.FanPrice)>0}'
            +'          <span class="hl-green">返现：￥<em>${list.FanPrice}</em></span>'
            +'          <br>'
            +'          {/if}'
            +'          {if parseInt(list.Score)>0}'
            +'          <span class="hl-orange">送京豆：<em>${list.Score}</em></span>'
            +'          <br>'
            +'          {/if}'
            +'          <a class="delete" data-id="${list.Id}|${mj.Id}" data-type="RemoveSuit" href="#delete">删除</a>'
            +'      </div>'
            +'      {for gift in list.Gifts}'
            +'      <div class="gift"><a href="http://item.jd.com/${gift.Id}.html" target="_blank">[{if gift.Type==2}赠品{/if}{if gift.Type==1}附件{/if}] ${gift.Name}</a></div>'
            +'      {/for}'
            +'      {for jq in list.CouponAD}'
            +'      <div class="gift-jq">[赠券] 赠送${jq.Jing}元京券 ${jq.LimitAd}</a></div>'
            +'      {/for}'
            +'  </li>'
            +'  {/for}'
            +'</ul>'
            +'{/for}',
        mz: '{for mz in ManZeng}'
            +'<ul id="mcart-mz">'
            +'  <li class="dt">'
            +'      <div class="fl"><span class="hl-orange">满赠</span>'
            +'          {if mz.ManFlag}'
            +'              已购满${mz.ManPrice}元，您{if mz.ManGifts.length>0}已{else}可{/if}领赠品'
            +'          {else}'
            +'              购满${mz.ManPrice}元，即可领取赠品'
            +'          {/if}'
            +'      </div>'
            +'      <div class="fr"><em>小计：￥${(mz.PromotionPrice*mz.Num).toFixed(2)}</em></div>'
            +'      <div class="clr"></div>'
            +'  </li>'
            +'  {for gift in mz.ManGifts}<li class="dt-mz"><a href="${gift.Id}" target="_blank">[赠品]${gift.Name}</a>×${gift.Num}</li>{/for}'
            +'  {for list in mz.Skus}'
            +'  <li>'
            +'      <div class="p-img fl"><a href="http://item.jd.com/${list.Id}.html" target="_blank"><img src="${pageConfig.FN_GetImageDomain(list.Id)}n5/${list.ImgUrl}" width="50" height="50" alt=""></a></div>'
            +'      <div class="p-name fl"><span></span><a href="http://item.jd.com/${list.Id}.html" title="${list.Name}" target="_blank">${list.Name}</a></div>'
            +'      <div class="p-detail fr ar">'
            +'          <span class="p-price"><strong>￥${list.PromotionPrice.toFixed(2)}</strong>×${list.Num}</span>'
            +'          <br>'
            +'          {if parseInt(list.FanPrice)>0}'
            +'          <span class="hl-green">返现：￥<em>${list.FanPrice}</em></span>'
            +'          <br>'
            +'          {/if}'
            +'          {if parseInt(list.Score)>0}'
            +'          <span class="hl-orange">送京豆：<em>${list.Score}</em></span>'
            +'          <br>'
            +'          {/if}'
            +'          <a class="delete" data-id="${list.Id}|${mz.Id}" data-type="RemoveSuit" href="#delete">删除</a>'
            +'      </div>'
            +'      {for gift in list.Gifts}'
            +'      <div class="gift"><a href="http://item.jd.com/${gift.Id}.html" target="_blank">[{if gift.Type==2}赠品{/if}{if gift.Type==1}附件{/if}] ${gift.Name}</a></div>'
            +'      {/for}'
            +'      {for jq in list.CouponAD}'
            +'      <div class="gift-jq">[赠券] 赠送${jq.Jing}元京券 ${jq.LimitAd}</a></div>'
            +'      {/for}'
            +'  </li>'
            +'  {/for}'
            +'</ul>'
            +'{/for}'
    },
    FN_BindEvents:function(){
        var _this = this;

        $("#settleup-content .delete").bind("click",function(){
            var id=$(this).attr("data-id").split('|'),
                name=$(this).attr("data-type"),
                data = {
                    method:name,
                    cartId:id[0]
                };
            if(!id)return;

            if ( id.length > 1 && !!id[1] ) {
                data.targetId = id[1];
            }

            $.ajax({
                url:MCART.URL_Serv,
                data: data,
                dataType:"jsonp",
                success:function(json){
                    if(json.Result) {
                        _this.FN_Refresh();
                    }
                }
            })
        })
    },
    FN_Refresh:function(){
        var object=document.getElementById("settleup")?$("#settleup dl"):$("#settleup-2013 dl");
        //if(object.attr("load")  &&readCookie(MCART.DATA_Cookie)==MCART.DATA_Amount)return;//非首次访问&&cookie值未发生改变
        var element=object.find("dd").eq(0),
            html,
            refreshCallback=function(data){
                var r = data.Cart,
                    len = r.TheSkus.length + r.TheSuit.length + r.TheGifts.length + r.ManJian.length + r.ManZeng.length,
                    sigle = MCART.TPL_List.sigle.process(data.Cart),
                    gift = MCART.TPL_List.gift.process(data.Cart),
                    suit = MCART.TPL_List.suit.process(data.Cart),
                    mz = MCART.TPL_List.mz.process(data.Cart),
                    mj = MCART.TPL_List.mj.process(data.Cart);

            if ( len > 0 ) {
                element.html(MCART.TPL_List.wrap.process(data.Cart));
                element.find('#settleup-content .smc').html(sigle+gift+suit+mj+mz);
                $('#settleup-url').attr('href', 'http://cart.jd.com/cart/cart.html?r='+(+new Date));
            } else {
                element.html(MCART.TPL_NoGoods);
            }

            if($.browser.msie && $.browser.version == 6){
                var content=$("#settleup-content");
                content.before(MCART.TPL_Iframe);
                var iframe=$("#settleup-iframe");
                iframe.height(content.height());
            }
            MCART.FN_BindEvents();
        };

        $.ajax({
            url:MCART.URL_Serv,
            data:{
                method:"GetCart"
            },
            dataType:"jsonp",
            success:function(json){
                refreshCallback(json);
            }
        });

        MCART.DATA_Amount=readCookie(MCART.DATA_Cookie);
        if(MCART.DATA_Amount!=null){
            $("#shopping-amount").html(MCART.DATA_Amount).parent().show();
        }
        //object.attr("load","1");
    }
};

// 通知弹出层
var NotifyPop = {
    _saleNotify: 'http://skunotify.'+ pageConfig.FN_getDomain() +'/pricenotify.html?',
    _stockNotify: 'http://skunotify.'+ pageConfig.FN_getDomain() +'/storenotify.html?',
    init: function($btn, skuAttr) {
        var that = this,
            p = this.serializeUrl(location.href),
            query = /from=weibo/.test(location.href)? location.search.replace(/\?/, '') : '',
            type;

        // 微博callback url
        if ( /from=weibo/.test(location.href) ) {
            type = p.param.type;
            this.setThickBox(type, query);
        }

        // 形如<a href="" data-type="1" data-sku="1234456">到货通知</a>按钮
        $btn.livequery('click', function() {
            //btn-notice
            var _this = this,
                id = $(this).attr('id'),
                type = $(this).attr('data-type') || 2;

            that.sku = $(this).attr('data-sku');

            that.checkLogin(function(r) {
                if (!r.IsAuthenticated) {
                    jdModelCallCenter.settings.fn = function() {
                        that.checkLogin(function(d) {
                            if (d.IsAuthenticated) {
                                that._userPin = d.Name;
                                that.setThickBox(type, query);
                            }
                        });
                    };
                    jdModelCallCenter.login();
                } else {
                    that._userPin = r.Name;
                    that.setThickBox(type, query);
                }
            });
            return false;
        }).attr('href', '#none').removeAttr('target');
    },
    serializeUrl: function(url) {
        var sep = url.indexOf('?'),
            link = url.substr( 0, sep),
            params = url.substr( sep+1 ),
            paramArr = params.split('&'),
            len = paramArr.length,i,
            res = {},curr,key,val;

        for ( i=0; i<len; i++) {
            curr = paramArr[i].split('=');
            key = curr[0];
            val = curr[1];

            res[key] = val;
        }

        return {
            url: link,
            param: res
        }
    },
    checkLogin: function(cb) {
        if ( typeof cb !== 'function' ) { return; }

        $.getJSON('http://passport.' + pageConfig.FN_getDomain() + '/loginservice.aspx?method=Login&callback=?', function(r) {
            if ( r.Identity ) {
                cb(r.Identity);
            }
        });
    },
    setThickBox: function(type, query) {
        //webSite=1&origin=1&source=1
        var title,url, w, h,
            param = {
                skuId: this.sku,
                pin: this._userPin,
                webSite: 1,
                origin: 1,
                source: 1
            },
            p = this.serializeUrl(location.href);

        if ( /blogPin/.test(location.href) ) {
            param.blogPin = p.param.blogPin;
        }

        if ( type == 1 ) {
            title = '降价通知';
            url = this._saleNotify;
            h = 250;
        }
        if ( type == 2 ) {
            title = '到货通知';
            url = this._stockNotify;
            h = 210;
            param.storeAddressId = readCookie('ipLoc-djd') || '0-0-0';
        }

        if ( !!query ) {
            url = url + query;
        } else {
            url = url + $.param(param);
        }
        $.jdThickBox({
            type: 'iframe',
            source: decodeURIComponent(url) + '&nocache=' + (+new Date()),
            width: 500,
            height: h,
            title: title,
            _box: "notify_box",
            _con: "notify_con",
            _title: "notify_title"
        });
    }
};

(function(){
    //ImgError
    pageConfig.FN_ImgError(document);

    //Jlazyload
    $("img[data-lazyload]").Jlazyload({
        type:"image",
        placeholderClass:"err-product"
    });

    //分类
    category.FN_Init();

    //shortcut
    if(document.getElementById("shortcut")){
        $("#shortcut .menu").Jdropdown({"delay":50});
    }else{
        //$("#shortcut-2013 .menu").Jdropdown({"delay":50});
        $("#biz-service").Jdropdown({"delay":50},function(){
            $.ajax({
                url:"http://www.jd.com/hotwords.aspx?position=new-index-002",
                dataType:"script",
                scriptCharset:"gb2312",
                cache:true
            });
        });
        $("#site-nav").Jdropdown({"delay":50},function(){
            $.ajax({
                url:"http://www.jd.com/hotwords.aspx?position=new-index-003",
                dataType:"script",
                scriptCharset:"gb2312",
                cache:true
            });
        });

    }
    //navitems
    if(document.getElementById("navitems")){
        $("#navitems li").Jdropdown();
    }else{
        $("#navitems-2013 li").Jdropdown();
    }

    //登录
    $.ajax({
        url:('https:' == document.location.protocol ? 'https://' : 'http://') + "passport."+ pageConfig.FN_getDomain() +"/new/helloService.ashx?m=ls",
        dataType:"jsonp",
        scriptCharset:"gb2312",
        success:function(json){
            if(json&&json.info){
                $("#loginbar").html(json.info);
            }
            if(json&&json.sso){
                $.each(json.sso,function(){
                    $.getJSON(this)
                })
            }
        }
    });

    //迷你购物车
    if(document.getElementById("settleup")){
        if(MCART.DATA_Amount!=null){
            $("#settleup s").eq(0).addClass("shopping");
            $("#shopping-amount").html(MCART.DATA_Amount);
        }
        $("#settleup dl").Jdropdown({"delay":200},function(object){
            MCART.FN_Refresh();
            // 新购物车链接
            $('#settleup-url').attr('href', 'http://cart.jd.com/cart/cart.html?r='+(+new Date));
        });
    }else{
        if(MCART.DATA_Amount!=null){
            $("#shopping-amount").html(MCART.DATA_Amount);
        }
        $("#settleup-2013 dl").Jdropdown({"delay":200},function(object){
            MCART.FN_Refresh();
            // 新购物车链接
            $('#settleup-url').attr('href', 'http://cart.jd.com/cart/cart.html?r='+(+new Date));
        });
    }

    //我的京东
    var _my360buy=document.getElementById("my360buy")?$("#my360buy"):$("#my360buy-2013");
    _my360buy.find("dl").Jdropdown({"delay":100},function(object){
        if(object.attr("load"))return;
        $.login({
            automatic: false,
            complete: function(data) {
                if(!data)return;
                var element=object.find("dd").eq(0),
                    html="",
                    vlist = readCookie(UC.DATA_Cookie);
                if(!data.IsAuthenticated){
                    html+=UC.TPL_UnRegist;
                    html+=UC.TPL_UList;
                }else{
                    html+=UC.TPL_Regist.process(data);
                    html+=UC.TPL_OList.placeholder;
                    html+=UC.TPL_UList;
                }

                if(vlist){
                    html+=UC.TPL_VList.placeholder;
                }
                element.html(html);

                //控制访问频率
                object.attr("load","1");
                setTimeout(function(){
                    object.removeAttr("load");
                },60000);

                //未登录显示最近浏览商品，中断执行
                if(/\[\{/.test(vlist)){
                    // cookie JSON格式
                    UC.FN_InitVList(vlist);
                } else {
                    // 字符串
                    UC.FN_InitNewVList(vlist);
                }
                UC.FN_InitOList();
            }
        });
    });

    //onkeyup
    document.onkeyup=function(e){
        var tagName=document.activeElement.tagName.toLowerCase();
        if(tagName=="input"||tagName=="textarea")return;
        var e=e?e:window.event,
        code=e.keyCode||e.which;
        switch(code){
            case 68://down
                if(!window.pageConfig.clientViewTop){
                    window.pageConfig.clientViewTop=0;
                }
                window.pageConfig.clientViewTop+=document.documentElement.clientHeight;
                window.scrollTo(0,pageConfig.clientViewTop);
                break;
            case 83://search
                window.scrollTo(0,0);
                window.pageConfig.clientViewTop=0;
                document.getElementById("key").focus();
                break;
            case 84://top
                window.scrollTo(0,0);
                window.pageConfig.clientViewTop=0;
                break;
            default:
                break;
        }
    }

})();

/*search input suggest box
 * 2012-5-31:
 * update expand attribute (price, brand) url
 * 2012-06-05 Tuesday:
 * update search box background color
 */
var $o = ( function(regionType) {
    var StringUtil = {} ;
    StringUtil.replace = function (sTemplate, oJson) {
        return sTemplate.replace(/#{(.*?)}/g, function() {
            var sWord = arguments[1];
            if ("undefined" != typeof(oJson[sWord])) {
                return oJson[sWord] ;
            } else {
                return arguments[0] ;
            }
        }) ;
    } ;
    String.prototype.isEmpty = function () {
        return 0 == this.length ;
    } ;

    var DEL_HISTORY_STR = '<a style="color:#005AA0" onclick="$o.del(event)">\u5220\u9664</a>';
    var HISTORY_TIP = '\u641C\u7D22\u5386\u53F2';
    var HISTORY_ITEM_T = '<li id="d_#{id}" suggest-pos="#{suggest_pos}" title="#{title}" onclick="$o.clickItem(this)" history="1"><div class="search-item" style="color:#005AA0">#{keyword}</div><div class="search-count">'+HISTORY_TIP+'</div></li>' ;
    var NORMAL_ITEM_T = '<li id="d_#{id}" suggest-pos="#{suggest_pos}" title="#{title}" onclick="$o.clickItem(this)"><div class="search-item">#{keyword}</div><div class="search-count">\u7EA6#{amount}\u4E2A\u5546\u54C1</div></li>' ;
    var CATEGORY_ITEM_T = '<div id="d_#{id}" suggest-pos="#{suggest_pos}" class="#{className}" title="#{title}" cid="#{cid}" cLevel="#{cLevel}" onclick="$o.clickItem(this)"><div class="search-item">\u5728<strong>#{cname}</strong>\u5206\u7c7b\u4e2d\u641c\u7d22</div><div class="search-count">\u7EA6#{amount}\u4E2A\u5546\u54C1</div></div>#{categorys}' ;
    var CATEGORY_CONTAINER_T = '<li class="fore1"><div id="d_#{id}" suggest-pos="#{suggest_pos}" class="fore1" title="#{title}" onclick="$o.clickItem(this)"><div class="search-item">#{keyword}</div><div class="search-count" #{style}>\u7EA6#{amount}\u4E2A\u5546\u54C1</div></div>#{categorys}</li>' ;

    var URL_KS_T = "http://dd.search.jd.com/?key=#{keyword}" ;

    //var BG_COLOR = "#FCF4EA" ;
    var BG_COLOR = "#FFDFC6" ;
    var BG_COLOR_NULL = "#FFF" ;
    var oInputBoxN = $("#key") ;
    var oTipBoxN = $("#shelper") ;

    function SearchBox() {
        this.length = 0 ;
        this.index = -1 ;
        this.needCreatedItem = false ;
        this.iLastModified = 0;
    }
    SearchBox.prototype.init = function() {
        this.length = 0 ;
        this.index = -1 ;
        this.needCreatedItem = false ;
    } ;
    SearchBox.prototype.hideTip = function() {
        this.init() ;
        oTipBoxN.html("").hide() ;
    } ;
    SearchBox.prototype.clickItem = function(oItemN) {
        var sCid = oItemN.getAttribute("cid") ;
        if (null != sCid && "" != sCid) {
            search.cid = sCid ;
        } else {
            search.cid = null ;
        }
        var sCLevel = oItemN.getAttribute("cLevel") ;
        if (null != sCLevel && "" != sCLevel) {
            search.cLevel = sCLevel ;
        } else {
            search.cLevel = null ;
        }
        var sEvVal = oItemN.getAttribute("ev_val") ;
        if (null != sEvVal && !$.trim(sEvVal).isEmpty()) {
            search.ev_val = sEvVal ;
        } else {
            search.ev_val = null ;
        }
        var sTitle = oItemN.getAttribute("title") ;
        if (null != sTitle && !$.trim(sTitle).isEmpty()) {
            oInputBoxN.val(sTitle) ;
        }
        search.additinal = '&suggest='+oItemN.getAttribute('suggest-pos');
        search("key") ;
    } ;
    SearchBox.prototype.mouseenter = function(oItem) {
        var oItem = $(oItem);
        if ( oItem.attr('history') ) {
            oItem.find('.search-count').html(DEL_HISTORY_STR);
        }
        oItem.css('background',BG_COLOR);
        // change relational node style
        var aIdNums = oItem.attr('id').split("_"), iSelectedIndex = parseInt(aIdNums[1], 10);
        if (iSelectedIndex != this.index) {
            if ( this.index>-1 ) {
                var oldItem = $("#d_"+this.index);
                oldItem.css("background", BG_COLOR_NULL);
                if ( oldItem.attr('history') ) { oldItem.find('.search-count').html(HISTORY_TIP); }
            }
            this.index = iSelectedIndex;
        }
        this.needCreatedItem = true ;
    } ;
    SearchBox.prototype.mouseleave = function(oItem) {
        oItem.css('background', BG_COLOR_NULL);
        if ( oItem.attr('history') ) {
            oItem.find('.search-count').html(HISTORY_TIP);
        }
        this.needCreatedItem = false ;
    };
    SearchBox.prototype.selectItemNode = function(direction) {//1向下， -1向上
        var oSelf = this ;
        var oRelNode = $("#d_" + oSelf.index + ':visible') ;
        oRelNode.css("background-color", BG_COLOR_NULL) ;
        if ( oRelNode.attr('history') ) {
            oRelNode.find('.search-count').html(HISTORY_TIP);
        }
        if ( oSelf.index==-1 && direction==-1) { direction = 0; }
        oSelf.index = (oSelf.length + oSelf.index + direction) % oSelf.length;
        var oNode = $("#d_" + oSelf.index) ;

        if (oNode.length > 0) {
            if ( oNode.attr('history') ) {
                oNode.find('.search-count').html(DEL_HISTORY_STR);
            }
            oNode.css("background-color", BG_COLOR) ;
            // change text of input box
            var sTitle = oNode.attr("title") ;
            if (null != sTitle && !$.trim(sTitle).isEmpty()) {
                oInputBoxN.val(sTitle) ;
            }
            // handle category and expand attribute value
            var sCid = oNode.attr("cid") ;
            if (null != sCid && "" != sCid) {
                search.cid = sCid ;
            } else {
                search.cid = null ;
            }
            var sCLevel = oNode.attr("cLevel");
            if (null != sCLevel && "" != sCLevel) {
                search.cLevel = sCLevel ;
            } else {
                search.cLevel = null ;
            }
            search.ev_val = null ;
            search.additinal = '&suggest='+oNode.attr('suggest-pos');
        }
    } ;
    SearchBox.prototype.input = function () {
        var oSelf = this;
        var sKeyword = $.trim(oInputBoxN.val());
        if ( !sKeyword && !readCookie('pin') && !readCookie('_tp') ) { return ; }
        var sUrlKs = StringUtil.replace(URL_KS_T, {
            keyword: encodeURIComponent(sKeyword)
        }) ;
        $.ajax({
            url: sUrlKs,
            dataType: 'jsonp',
            scriptCharset:'utf-8',
            jsonp: 'callback',
            success: (function(time){
                return function(res){
                    if ( oSelf.iLastModified>time ) { return ; }
                    oSelf.iLastModified = time;
                    oSelf.onloadItems(res);
                };
            })(new Date().getTime())
        }) ;
    };
    SearchBox.prototype.keydown_up = function(event) {
        var oSelf = this;
        var oEvent = event || window.event;
        if (0 == oInputBoxN.length) {
            oInputBoxN = $("#key") ;
        }
        if (0 == oTipBoxN.length) {
            oTipBoxN = $("tie") ;
        }
        var iKeyCode = oEvent.keyCode ;
        switch (iKeyCode)
        {
            case 38:    // turn up
                oSelf.selectItemNode(-1) ;
                break ;
            case 40:    // turn down
                oSelf.selectItemNode(1) ;
                break ;
            case 27:
                oSelf.hideTip();
                break ;
            case 37:    // turn left
                break ;
            case 39:    // turn left
                break ;
            default:
                if ( !$.browser.mozilla ) {
                    oSelf.input();
                }
                break ;
        }
    } ;
    SearchBox.prototype.onloadItems = function(json) {
        if (0 == json.length) {
            this.hideTip();
            return ;
        }
        var oSelf = this ;
        oSelf.init() ;
        var html = "" ;
        var iSearchType = 0 ;
        if (window.pageConfig && window.pageConfig.searchType ) {
            iSearchType = window.pageConfig.searchType ;
        }
        var suggest_pos=0 , new_html='', has_category=false;
        var iLen = 0, sInputKeyword = $.trim(oInputBoxN.val());
        for (var i = 0, iLoopLen = json.length ; i < iLoopLen ; i++) {
            var oItem = json[i] ;
            if ( !oItem) { continue; }
            var sRespKeyword = $.trim(oItem.keyword) ;
            var realWordIndex = sRespKeyword.toLowerCase().indexOf(sInputKeyword.toLowerCase());
            var sDecoratedKeyword = sRespKeyword;
            if (realWordIndex == 0) {
                sDecoratedKeyword = sInputKeyword + "<strong>" + sRespKeyword.substring(realWordIndex+sInputKeyword.length) + "</strong>" ;
            }
            if ( "string" == typeof(oItem.cid) && !$.trim(oItem.cid).isEmpty() ) {  // category html
                if (has_category==false) {
                    has_category = true;
                    var style = 'style="visibility:hidden"',amount=0;
                    if ( oItem.oamount && oItem.oamount > 0 ) {
                        amount = oItem.oamount; style = '';
                    }
                    new_html += StringUtil.replace(CATEGORY_CONTAINER_T, {
                        id: iLen,
                        title: oItem.keyword,
                        keyword: sDecoratedKeyword,
                        amount: amount,
                        suggest_pos: suggest_pos,
                        style: style
                    }) ;
                    iLen++;
                    suggest_pos++;
                }
                if ( "string" == typeof(oItem.cname) && $.trim(oItem.cname).isEmpty()) {
                    continue ;
                }
                var sLevel = oItem["level"] ;
                if (!sLevel) {
                    continue ;
                }
                if (0 == iSearchType) {                 // filter category 3 level category of book, mvd
                    if ("string" == typeof(sLevel) && /^[1-8]4$/.test(sLevel)) {
                        continue ;
                    }
                } else if (5 == iSearchType) {          // filter category not belong ebook
                    if ("string" == typeof(sLevel) && !(/^[5-8]2$/.test(sLevel))) {
                        continue ;
                    }
                } else if (1 == iSearchType || 2 == iSearchType || 3 == iSearchType || 4 == iSearchType) {
                    continue ;
                }

                var sClassName = "item1" ;
                var sTmp = StringUtil.replace(CATEGORY_ITEM_T, {
                    id: iLen,
                    title: oItem.keyword,
                    cid: oItem.cid,
                    cLevel: oItem.level,
                    className: sClassName,
                    cname: oItem.cname,
                    amount: oItem.amount,
                    suggest_pos: suggest_pos-1
                }) ;
                new_html = StringUtil.replace(new_html, {categorys:sTmp});
                iLen++;
            } else {
                var style = '';
                if ( oItem.amount==0 ) {
                    new_html += StringUtil.replace(HISTORY_ITEM_T, {
                        id: iLen,
                        title: oItem.keyword,
                        keyword: sDecoratedKeyword,
                        amount: oItem.amount,
                        suggest_pos: suggest_pos
                    }) ;
                } else {
                    new_html += StringUtil.replace(NORMAL_ITEM_T, {
                        id: iLen,
                        title: oItem.keyword,
                        keyword: sDecoratedKeyword,
                        amount: oItem.amount,
                        suggest_pos: suggest_pos,
                        style : style
                    }) ;
                }
                iLen++;
                suggest_pos++;
            }
        }
        oSelf.length = iLen;
        html = StringUtil.replace(new_html, {categorys:''});
        if ("" != html) {
            html += '<li class="close" onclick="$o.hideTip()">\u5173\u95ed</li>' ;
            oTipBoxN.html(html).show() ;
            oTipBoxN.find('[id^="d_"]').bind('mouseleave', function() {
                oSelf.mouseleave($(this));
            }).bind('mouseenter', function(){
                oSelf.mouseenter($(this));
            });
        } else {
            oTipBoxN.html("").hide() ;
        }
    } ;
    SearchBox.prototype.bind_input = function() {
        if ( $.browser.mozilla ) {
            oInputBoxN.bind('keydown', function(e) {
                oSearchBox.keydown_up(e) ;
            })
            oInputBoxN.bind('input', function(e) {
                oSearchBox.input(e) ;
            });
        } else {
            oInputBoxN.bind('keyup', function(e) {
                oSearchBox.keydown_up(e) ;
            });
        }
        oInputBoxN.blur(function() {
            if (!oSearchBox.needCreatedItem) {
                oSearchBox.hideTip() ;
            }
        }).focus(function(){
            setTimeout(function(){oSearchBox.input();}, 10);
        }) ;
        oTipBoxN.parent().bind('mouseenter',function(){
            if ( oSearchBox.timeoutId ) {
                clearTimeout(oSearchBox.timeoutId);
            }
        }).bind('mouseleave',function(){
            oSearchBox.timeoutId = setTimeout(function(){
                oSearchBox.hideTip();
            }, 500);
        });
    };
    SearchBox.prototype.del = function(e) {
        var oSelf = this;
        e = e ? e : window.event;
        if ( window.event ) {
            e.cancelBubble = true; e.returnValue = false;
        } else {
            e.stopPropagation(); e.preventDefault();
        }
        var src = $(e.srcElement ? e.srcElement : e.target), keyword=src.parent().parent().attr('title');
        $.ajax({
            url:'http://search.jd.com/suggest.php?op=del&callback=?&key='+encodeURIComponent(keyword),
            dataType:"jsonp",
            scriptCharset:"utf-8",
            beforeSend:function(){
                src.parent().parent().hide();
            },
            success:function(res){
                oInputBoxN.focus();
            }
        });
    };
    var oSearchBox = new SearchBox() ;
    oSearchBox.bind_input();

    return oSearchBox ;
} )() ;


pageConfig.FN_InitSidebar=function(){
    if(!$("#toppanel").length){
        $(document.body).prepend("<div class=\"w ld\" id=\"toppanel\"></div>");
    }
    $("#toppanel").append("<div id=\"sidepanel\" class=\"hide\"></div>");
    var object=$("#sidepanel");
    this.scroll=function(){
        var _this=this;
        $(window).bind("scroll",function(){
            var top=document.body.scrollTop||document.documentElement.scrollTop;
            if(top==0){
                object.hide()
            }else{
                object.show()
            }
        });
        _this.initCss();
        $(window).bind("resize",function(){
            _this.initCss();
        });
    };
    this.initCss=function(){
        var css,width=pageConfig.compatible?1210:990;
        if(screen.width>=1210){
            if($.browser.msie&&$.browser.version<=6){
                css={"right":"-26px"}
            }else{
                css={
                    "right":(document.documentElement.clientWidth-width)/2-26+"px"
                }
            }
            object.css(css)
        }
    };
    this.addCss=function(a){
        object.css(a)
    };
    this.addItem=function(a){
        object.append(a)
    };
    this.setTop=function(){
        this.addItem("<a href='#' class='gotop' title='使用快捷键T也可返回顶部哦！'><b></b>返回顶部</a>");
    }
};

/*
 * Product Contrast init
 */
pageConfig.FN_InitContrast = function( cookieName, script, pageType ) {
    var cookieName = cookieName || '_contrast',
        pageType = pageType || 'list',
        script = script || 'http://misc.360buyimg.com/contrast/js/contrast.js?ver='+(+new Date),
        status = readCookie( cookieName + '_status' );

    if ( pageConfig.isInitContrast ) { return false; }

    if ( (status == 'show' || status == 'side') && !!readCookie( cookieName ) == true  ) {
        $.getScript( script, function() {
            if ( Contrast ) {
                Contrast.init( pageType, cookieName );
            }
        });

    } else {

        $('.btn-compare').bind( 'click', function() {
            var skuid = this.getAttribute('skuid');

            $.getScript( script, function() {

                if ( Contrast ) {
                    Contrast.init( pageType, cookieName ).showPopWin( skuid );
                }
            });
        });
    }
    pageConfig.isInitContrast = 1;
};

/*
 gloablPatch
*/
if ( !/debug=global/.test(location.href) ) {
    $.ajax({
        url: 'http://fa.360buy.com/loadFa_toJson.js?aid=2_601_5095',
        dataType: 'script',
        scriptCharset: 'gbk',
        cache: true
    });
}
