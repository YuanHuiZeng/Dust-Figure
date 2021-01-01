const $ =Env('牛牛')
let  needle = require('needle');
const notify = $.isNode() ? require('./sendNotify') : '';
let ckArr = []
if (process.env.COW) {
    ckArr = process.env.FENGCOOKIE.split('\n');
    console.log(ckArr);
    console.log(`您选择的是用换行隔开\n`)
}
let headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-cn",
    "Connection": "keep-alive",
    "Content-Length": "523",
    "Content-Type": "multipart/form-data;",
    "Cookie": '',
    "Host": "bsp.babytree.com",
    "Origin": "https://h5.babytree.com",
    "Referer": "https://h5.babytree.com/h5_farmcrow_activity/html/index?",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 pregnancy/8.39.1 AliApp(BBT/3.1.1.19) AliUnionMall",
}
let url = 'https://bsp.babytree.com/game/manor/api/award';
let taskListUrl = 'https://bsp.babytree.com/game/manor/api/taskList';
let login_string_Arr = []
if (process.env.COW_LOGIN_STRING) {
    login_string_Arr = process.env.FENGCOOKIE.split('\n');
}
let fidArr =[
    '1696073',  //娜娜大号
    '1696393'
]
let login_string = '';
let act_key = 'farmcow';
let data = {
    task_id:16,
    login_string:login_string,
    act_key:act_key
}
let option = {
    headers:headers
}
let taskList = [];
let eggNum=0;//奶瓶数
let feedsNum = 0;//饲料数量
let friendList = [];

(async function main(){
    for (let i=1;i<ckArr.length;i++){
        headers.Cookie = ckArr[i];
        login_string = login_string_Arr[i];
        console.log(`休息5s,执行第${i+1}个号`)
        await sleep(5);
        await userInfo();
        await sleep(5);
        await getFriendList();
        await refresh()
        // await checkFeeds();
        // await visitFriend();
        await feedFriend();
        if ($.time("HH") == 7 || $.time("HH") == 8){
            sign_in();
            await getTaskList();
            await sleep(5)
            await doTaskList();
            await sleep(5);
            await taskAward();
        }
        /* if (feedsNum >=20){
             await toFeed()
         }*/
    }


})().catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
})
    .finally(() => {
        $.done();
    })

//签到
function sign_in(){
    needle.post(url, data,{ multipart: true },function(error, response, body) {
        if (error) throw error;
        console.log(body);
    });
}

//用户信息
function userInfo(){
    return new Promise(resolve => {
        let opt = {
            login_string:login_string,
            act_key:act_key
        }
        let url = 'https://bsp.babytree.com/game/manor/api/login'
        needle.post(url, opt,{ multipart: true },async function(error, response, body) {
            if (error) throw error;
            // console.log(body);
            console.log(`牛牛名：${body.data.cropName}`)
            console.log(`当前奶瓶数：${body.data.eggNum}`);
            console.log(`当前饲料数：${body.data.feedsNum}`);
            feedsNum = parseInt(body.data.feedsNum);
            await notify.BarkNotify(`牛牛名：${body.data.cropName}`, `当前奶瓶数：${body.data.eggNum}`);
            // console.log(parseInt(feedsNum));
            resolve()
        });
    })

}

//获取任务列表
function getTaskList(){
    return new Promise(resolve => {
        needle.post(taskListUrl, data,{ multipart: true },function(error, response, body) {
            if (error) throw error;
            // console.log(body);
            let list = [...body.data];
            list.forEach(item=>{
                taskList.push(item)
            })
            resolve()
        });
    })

}

//完成任务
async  function doTaskList(){

    for (let i =0 ;i<taskList.length;i++){
        let url = 'https://bsp.babytree.com/game/manor/api/doTask?task_id='+taskList[i].task_id+'&login_string=u72429338307_55d87f945b2e4b793d92f733e99853f5_1605851334_A3610825-1CC8-4E56-917E-9EC2A4E30D64&act_key=farmcow';
        let opt = {
            url:url,
            // headers:otherHeaders
            headers:headers
        }
        needle.get(url,function (error,res,body){
            console.log(`${taskList[i].task_name}`,body);
        })
        await sleep(5)

    }
}

//领取任务奖励
async function taskAward(){
    return new Promise(resolve => {
        getAward()
        async function getAward(){
            for (let i =0 ;i<taskList.length;i++){
                let url = 'https://bsp.babytree.com/game/manor/api/award';
                let opt = {
                    task_id:taskList[i].task_id,
                    login_string:'u72429338307_55d87f945b2e4b793d92f733e99853f5_1605851334_A3610825-1CC8-4E56-917E-9EC2A4E30D64',
                    act_key:'farmcow'
                }
                needle.post(url, opt,{ multipart: true },function(error, response, body) {
                    if (error) throw error;
                    if (body.code == 200){
                        console.log(`${taskList[i].task_name}奖励已领取，领取了${body.data.addIntegralNum}g饲料`)
                    }else{
                        console.log(`${taskList[i].task_name},${body.msg}`)
                    }

                });
                await sleep(5)

            }
            resolve()
        }

    })

}

//喂养饲料
function toFeed(){
    return new Promise(resolve => {
        let opt = {
            login_string:login_string,
            act_key:act_key
        }
        let url = 'https://bsp.babytree.com/game/manor/api/feed';
        needle.post(url, opt,{ multipart: true },function(error, response, body) {
            if (error) throw error;
            // console.log(body);
            if (body.code ===200){
                console.log(`喂养成功，还剩饲料${body.data.remain}`)
            }else{
                console.log('喂养失败');
            }
            resolve()
        });
    })
}

//获取朋友列表
function getFriendList(){
    return new Promise(resolve => {
        let url = 'https://bsp.babytree.com/game/manor/api/friendsList?login_string='+login_string+'&act_key='+act_key;
        let opt = {
            url:url,
            // headers:otherHeaders
            headers:headers
        }
        needle.get(url,function (error,res,body){
            friendList = body.data.friend_list
            // console.log(body.data.friend_list);
            resolve()
        })
    })
}
//访问朋友
function visitFriend(){
    return new Promise( resolve => {
        let url = 'https://bsp.babytree.com/game/manor/api/visit?fid=1696073&login_string=u72429338307_55d87f945b2e4b793d92f733e99853f5_1605851334_A3610825-1CC8-4E56-917E-9EC2A4E30D64&act_key=farmcow';
        // headers.Referer = 'https://h5.babytree.com/h5_farmcrow_activity/html/index?uid=1696073'
        let opt = {
            url:url,
            headers:headers
        }
        needle.get(url,async function (error,res,body){
            console.log('访问',body);
            await notify.BarkNotify(`访问`, `媳妇的大号`);
            resolve()
        })
    })
}
//查询是否可以帮朋友喂食
function checkFeeds(){
    return new Promise(resolve => {
        let url = 'https://bsp.babytree.com/game/manor/api/canGetFeeds?login_string=u72429338307_55d87f945b2e4b793d92f733e99853f5_1605851334_A3610825-1CC8-4E56-917E-9EC2A4E30D64&act_key=farmcow';
        // headers.Referer = 'https://h5.babytree.com/h5_farmcrow_activity/html/index?uid=1696073'
        let opt = {
            url:url,
            headers:headers
        }
        needle.get(url,async function (error,res,body){
            console.log(body);
            await notify.BarkNotify(`查询`, `媳妇的大号`);
            resolve()
        })
    })


}
//刷新
function refresh(){
    return new Promise(resolve => {
        let url = 'https://bsp.babytree.com/game/manor/api/refresh?login_string='+login_string+'&act_key=farmcow'
        // headers.Referer = 'https://h5.babytree.com/h5_farmcrow_activity/html/index'
        // headers.Referer = 'https://h5.babytree.com/h5_farmcrow_activity/html/index?uid=1696073'
        let opt = {
            url:url,
            headers:headers
        }
        needle.get(url,async function (error,res,body){
            // console.log(body);
            await notify.BarkNotify(`刷新成功`, `媳妇的大号`);
            resolve()
        })
    })
}

//帮朋友喂食
function feedFriend(){
    return new Promise(async resolve => {
        for (let i =0 ;i<friendList.length-1;i++){
            await sleep(5);
            let opt = {
                // fid:1696073,   //娜娜大号
                fid:1696393,      //自己大号
                // fid:1696402,
                login_string:login_string,
                act_key:act_key
            }
            let url = 'https://bsp.babytree.com/game/manor/api/feedFriend';
            needle.post(url, opt,{ multipart: true }, async function(error, response, body) {
                if (error) throw error;
                console.log(body);
                if (body.code ===200){
                    console.log(`喂养${friendList[i].nickname}成功`)
                    await notify.BarkNotify(`喂养${friendList[i].nickname}成功`, `媳妇的大号`);
                }else{
                    console.log(`${friendList[i].nickname} ${body.msg}`);
                }

            });
        }
        resolve()

    })
}
//等待一下
function sleep(s) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, s * 1000);
    })
}

function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,o)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=e&&e.timeout?e.timeout:o;const[r,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":r,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),o=JSON.stringify(this.data);s?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(e,o):this.fs.writeFileSync(t,o)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return s;return o}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),o=s?this.getval(s):"";if(o)try{const t=JSON.parse(o);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(e),r=this.getval(i),h=i?"null"===r?null:r||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,o,t),s=this.setval(JSON.stringify(e),i)}catch(e){const r={};this.lodash_set(r,o,t),s=this.setval(JSON.stringify(r),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t)))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t))}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",o){const r=t=>{if(!t||!this.isLoon()&&this.isSurge())return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,r(o)):this.isQuanX()&&$notify(e,s,i,r(o)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}