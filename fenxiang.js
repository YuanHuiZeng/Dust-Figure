const $ = Env('粉象')
const name = "粉象";
const bark = require('./sendNotify')
// const $zeng = new Env(name);
const $zeng = init()
const main = 'https://api-1.fenxianglife.com';
const elephantInfo = main + '/njia/elephant/info';
const recive = main + '/njia/elephant/coin/receive';
const userInfo = main + '/njia/users/info';
const meals = main + '/njia/game/task/finish';
const signDay = main + '/njia/elephant/sign/detail';
const sign_in = main + '/njia/elephant/sign';
const taskListUrl = main + '/njia/game/task/list';
const goodsUrl = main + '/goods/selection';
const drawList = main + '/njia/luckyDraw/items';
const joinDraw = main + '/njia/luckyDraw/signUp';
const inviteUrl = main + '/njia/elephant/mammon/invite';
const helpUrl = main + '/njia/elephant/mammon/help';
const recivenc = main + '/njia/orchard/task/list';
const finsisRecive = main +'/njia/orchard/task/finish';
const waterUrl = main + '/njia/orchard/user/fruiter/detail';
const toWaterUrl = main + '/njia/orchard/user/fruiter/water';
const time5Url  = main +  '/njia/elephant/activity/limitedTime/complete';
const fenSign = main + '/njia/rewardPoints/V2/scoreIndex';
const acquireWater = main + '/njia/orchard/user/fruiter/acquireWater';
var invitationCode = '';
let userWaterId = '';
let waterTotal = 0 ;
let dayAwardWaterID = 0
const token = '121312';
let tokenArr = [];
if (process.env.FENGCOOKIE) {
    tokenArr = process.env.FENGCOOKIE.split('\n');
    console.log(tokenArr);
    console.log(`您选择的是用换行隔开\n`)
}
const commonHeaders = {
    "h5-tk": '',
    'Content-Type': 'application/json',
    'Host': 'api-1.fenxianglife.com',
}
let fruitRipe = false;
let userName = null
!(async () => {
    // console.log(await step());
    for (let i = 0; i < tokenArr.length; i++) {
        commonHeaders['h5-tk'] = tokenArr[i];
        await step();
        // await sleeped(30);
        if (i==2){
            console.log("脚本结束");
        } else {
            console.log("休息30s后执行账号",i+1);
        }

    }
})();
// step();

async function step() {
    if (token) {
        await signCorn();
        await getUserInfo();
        await signIn();
        await autoReceive();
        await getElephantInfo();
        await finishMeals();
        await signDetail();
        await invite();
        await helpInvite();
        // await toLuckyDraw();
        await getTaskToFinish();
        await reciveWater();
        await getWaterId();
        await acquireWaters();
        await limitedTime();

        // console.log(parseInt(waterTotal/10))
        for (let j = 1;j<parseInt(waterTotal/10);j++){
            if (!fruitRipe){
                await getWaterId();
                await autoWater(j);
                await sleeped(15)
            }else {
                fruitRipe = false
                break
            }

        }

    } else {
        getToken()
    }
};

function getToken() {

}
//签到金币
function signCorn(){
    return new Promise(resolve => {
        let opt = {
            url :fenSign,
            headers:commonHeaders
        }
        $zeng.post(opt,(err,res,data)=>{
            try {
                let signData = JSON.parse(data);
                // console.log(signData);
                if (signData.code == 200 && signData.data.signInTask == 1){
                    console.log(`连续签到${signData.data.signContinuityDay}天`);
                    console.log(`签到金币${signData.data.todaySignScore}`);
                }else if (signData.data.signInTask == 0){
                    console.log(`今天已签到！！`);
                }
                resolve()
            }catch (e) {

            }
        })
    })
}
//签到
function signIn() {
    return new Promise(resolve => {
        let opt = {
            url :sign_in,
            headers:commonHeaders
        }
        $zeng.post(opt,(err,res,data)=>{
            try {
                let signData = JSON.parse(data);
                if (signData.code === 200){
                    $zeng.notify(signData.message, " ", " ");
                } else{
                    $zeng.notify(signData.message, " ", " ");
                }
                resolve()
            }catch (e) {

            }
        })
    })
}
//userInfo
function getUserInfo() {
    return new Promise(resolve => {
        let opt = {
            url: userInfo,
            headers: commonHeaders
        }
        $zeng.get(opt, (err, res, data) => {
            let infoData = JSON.parse(data);
            // console.log(infoData);
            invitationCode = infoData.data.userInfo.invitationCode;
            userName = infoData.data.userInfo.nickname;
            console.log('账号名称',infoData.data.userInfo.nickname);
            console.log('邀请码',invitationCode);
            resolve()
        })
    })
}

//自动收取
function autoReceive() {
    return new Promise(resolve => {
        let opt = {
            url: recive,
            headers: commonHeaders
        }
        $zeng.post(opt, (err, res, data) => {
            try {
                let resData = JSON.parse(data)
                if (resData.code === 200) {
                    $zeng.notify("收取金币成功", " ", '');
                } else {
                    $zeng.notify("收取金币失败:", " ", resData.message);
                }
                resolve()
            } catch (e) {

            }
        })
    })
}
//领取昨天浇水奖励
function acquireWaters() {
    return new Promise(resolve => {
        try {
            let body = JSON.stringify({"canAcquireWaterId":dayAwardWaterID,"userFruiterId":userWaterId});
            let opt = {
                url : acquireWater,
                headers: commonHeaders,
                body:body
            };
            $zeng.post(opt,(err,res,data) => {
                let result = JSON.parse(data);
                console.log('领水:',result.message);
                resolve()
            })
        }catch (e) {
            $zeng.notify("开启助力失败", " ", '');
        }
    })
}
//ElephantInfo
function getElephantInfo() {
    return new Promise(resolve => {
        try {
            let opt = {
                url: elephantInfo,
                headers: commonHeaders
            }
            $zeng.get(opt, (err, res, data) => {
                let infoData = JSON.parse(data);
                $zeng.notify("猪猪信息:", " ", '\n' + '账号等级' + infoData.data.level + '\n' + '储蓄总量' + infoData.data.coinVolume + '\n' + '金币总量' + infoData.data.coinCurrent);
                resolve()
            })
        } catch (e) {
            $zeng.done()
        }

    })
}

//开启助力
function invite() {
    return new Promise(resolve => {
        try {
            let opt = {
                url : inviteUrl,
                headers: commonHeaders
            };
            $zeng.post(opt,(err,res,data) => {
                let inviteData = JSON.parse(data);
                // console.log(inviteData);
                if (inviteData.code === 200){
                    $zeng.notify("开启助力成功", " ", '');
                }else{
                    $zeng.notify("开启助力失败", " ", inviteData.message);
                }
                resolve()
            })
        }catch (e) {
            $zeng.notify("开启助力失败", " ", '');
        }
    })
}

//帮助助力
function helpInvite() {
    return new Promise(resolve => {
        try {
            let body = ''
            if ($.time("HH") <=8 ){
                 body = JSON.stringify({"initiatorId": "498093563"});
            }
            // body = JSON.stringify({"initiatorId": "498093563"});
            if ($.time("HH") >8 ) {
                 body = JSON.stringify({"initiatorId": "499563122"});
            }
            let opt = {
                url : helpUrl,
                headers: commonHeaders,
                body:body
            };
            $zeng.post(opt,(err,res,data) => {
                let helpData = JSON.parse(data);
                if (helpData.code == 200){
                    $zeng.notify(helpData.data, " ", '');
                } else{
                    $zeng.notify('助力失败', " ", '');
                }
                resolve()
            })
        }catch (e) {
            $zeng.notify("开启助力失败", " ", '');
        }
    })
}
//三个时间点
function finishMeals() {
    return new Promise(resolve => {
        //早上"taskId":"3",中午"taskId":"4",  晚上"taskId":"5",
        let body = JSON.stringify({"taskId":"4","gameType":"2"});
        let opt = {
            url:meals,
            headers:commonHeaders,
            body:body,
        };
        $zeng.post(opt,(err,res,data)=>{
            let mealsData = JSON.parse(data);
            if (mealsData.code === 200){
                $zeng.notify("三餐签到成功:", "金额", mealsData.data.awardCount);
            }else{
                $zeng.notify("三餐签到:", " ", "不在签到时间段内");
            }
            resolve()
        })
    })
}
//signDetail
function signDetail() {
    return new Promise(resolve => {
        let opt = {
            url :signDay,
            headers:commonHeaders
        }
        $zeng.get(opt,(err,res,data)=>{
            try {
                let dayDetails = JSON.parse(data);
                let dayArr = dayDetails.data.list;
                let num = 0;
                dayArr.forEach(item=>{
                    if (item.state === 0){
                        num += 1
                    }
                });
                $zeng.notify("连续签到天数:", " ", num);

                resolve()
            }catch (e) {

            }
        })
    })
}
//taskList
function getTaskToFinish() {
    return new Promise(resolve => {
        let body = JSON.stringify({"gameType":"2"});
        let opt = {
            url: taskListUrl,
            headers: commonHeaders,
            body:body,
        };
        $zeng.post(opt,(err,res,data)=>{
            let taskList = JSON.parse(data);
            // console.log(taskList);//taskList.data.length
            if (taskList.code == 200){
                for(let i = 0 ;i< taskList.data.length;i++){
                    let taskID = JSON.stringify({"taskId":taskList.data[i].item.id,"gameType":"2"});
                    let opt = {
                        url:meals,
                        headers:commonHeaders,
                        body:taskID,
                    };
                    $zeng.post(opt,(err,res,data)=>{

                        try {
                            let listData = JSON.parse(data);
                            console.log(listData);
                            if (listData.code == 40009 || listData.code == 200){
                                $zeng.notify(taskList.data[i].name +" 任务完成!!", " ", " ");
                                sleep(3000);
                            }

                            // console.log('ID'+ taskList.data[i].item.id,listData);
                        }catch (e) {
                            $zeng.notify("任务失败:", " ", taskList.data[i].name);
                            // $zeng.notify("每日任务全部完成!!", " ", " ");
                        }

                    })
                   /* if (taskList.data[i].intervalState != 0){
                        let taskID = JSON.stringify({"taskId":taskList.data[i].item.id,"gameType":"2"});
                        let opt = {
                            url:meals,
                            headers:commonHeaders,
                            body:taskID,
                        };
                        $zeng.post(opt,(err,res,data)=>{

                            try {
                                let listData = JSON.parse(data);
                                console.log(listData);
                                if (listData.code == 40009 || listData.code == 200){
                                    $zeng.notify(taskList.data[i].name +" 任务完成!!", " ", " ");
                                    sleep(3000);
                                }

                                // console.log('ID'+ taskList.data[i].item.id,listData);
                            }catch (e) {
                                $zeng.notify("任务失败:", " ", taskList.data[i].name);
                                // $zeng.notify("每日任务全部完成!!", " ", " ");
                            }

                        })
                    }else{
                        $zeng.notify(taskList.data[i].name +" 任务完成!!", " ", " ");
                        continue
                    }*/
                }
                resolve()
            }

        })
    })
}

function finishTask(opt) {
    return new Promise(resolve => {
        $zeng.post(opt,(err,res,data)=>{
            try {
                let listData = JSON.parse(data);
                console.log(listData);
                if (listData.code == 40009 || listData.code == 200){
                    $zeng.notify(taskList.data[i].name +" 任务完成!!", " ", " ");
                    sleep(3000);
                }
            }catch (e) {
                $zeng.notify("任务失败:", " ", taskList.data[i].name);
            }
        })
    })
}

//luckyDrawList
function toLuckyDraw() {
    return new Promise(resolve => {
        let opt ={
            url:drawList,
            headers:commonHeaders
        };
        $zeng.get(opt,(err,res,data)=>{
            let list = JSON.parse(data);
            // console.log(list.data.list);
            //itemTitle
            for (let i = 0;i <list.data.list.length;i++){
                if (list.data.list[i].signUp) {
                    $zeng.notify(list.data.list[i].itemTitle, " ", "已参与");
                    continue
                }else{
                    let body = JSON.stringify({"luckyDrawItemId": list.data.list[i].id});
                    let joinOpt = {
                        url:joinDraw,
                        headers:commonHeaders,
                        body:body,
                    };
                    $zeng.post(joinOpt,(err,res,data)=>{
                        let joinResult = JSON.parse(data);
                        // console.log(joinResult);
                        try{
                            if (joinResult.code == 200){
                                $zeng.notify(list.data.list[i].itemTitle, " ", "参与成功");
                            } else {
                                $zeng.notify(list.data.list[i].itemTitle, " ", joinResult.message);
                            }
                        }catch (e) {

                        }
                    })
                }
            }
        })
        resolve()
    })
}


function request(url, body) {
    let bodyParams = JSON.stringify(body)
    const option =  {
        url: url,
        headers: commonHeaders,
        body:bodyParams
    };
    $zeng.post(option, (err, resp, data) => {
        // let taskData = JSON.parse(data)
        console.log(data);
        console.log(resp);
        console.log(err);
    })
}


//睡眠函数
function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}

//自动领水任务
function reciveWater() {
    return new Promise(resolve => {
        let opt = {
            url:recivenc,
            headers:commonHeaders
        }
        $zeng.get(opt,(err,res,data)=>{
            // console.log(JSON.parse(data).data);
            let reciveData = JSON.parse(data).data;
            for (let i=0;i<reciveData.length;i++){
                let opt ={
                    url:finsisRecive,
                    headers:commonHeaders,
                    body:JSON.stringify({
                        type:reciveData[i].type,
                        taskInfoId:reciveData[i].taskInfoId
                    })
                }
                $zeng.post(opt,(err,res,data)=>{
                    console.log(data);
                })
            }
            resolve()
        })
    })
}

//查询浇水id
function getWaterId() {
    return new Promise(resolve => {
        try{
            let opt = {
                url:waterUrl,
                headers:commonHeaders
            }
            $zeng.get(opt,(err,res,data)=>{
                let waterData = JSON.parse(data);
                if (waterData.code == 200){
                    userWaterId = waterData.data.id;
                    waterTotal = waterData.data.waterTotal;
                    if (waterData.data.dayAwardWater){
                        dayAwardWaterID = waterData.data.dayAwardWater.id;
                    }
                    console.log('userWaterId',userWaterId);
                    console.log('waterTotal',waterTotal);
                    resolve()
                }else{
                    resolve()
                    console.log("获取水滴失败");
                }

            })

        }catch (e) {

        }
    })
}
//自动浇水
function autoWater(i) {
    return new Promise(resolve => {
        executeWater(i)
        async function executeWater() {
            await toWaterById(i);
            // if (waterTotal >= 400){
            //
            //     await toWaterById(i);
            // }else {
            //     console.log('水滴数量不能浇水40次');
            //     resolve()
            // }
            resolve()
            // await sleeped(150);

        }

        function toWaterById(i){
            return new Promise(resolve1 => {
                let opt = {
                    url:toWaterUrl,
                    headers:commonHeaders,
                    body:JSON.stringify({'userFruiterId':userWaterId})
                };
                $zeng.post(opt,(err,res,data)=>{
                    // console.log(JSON.parse(data));
                    if (JSON.parse(data).code == 200){
                        console.log(`第${i}次浇水成功`);
                        resolve()
                    }else if (JSON.parse(data).code == 40009){
                        fruitRipe = true
                        console.log('账号:'+userName+' 水果已成熟啦')
                        bark.BarkNotify(`${userName}`,'水果已成熟啦')
                        console.log(`第${i}次浇水失败`)
                        resolve()

                    }
                });
            })
        }

    })
}

//等待一下
function sleeped(s) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, s * 1000);
    })
}
//5分钟金币
function limitedTime() {
    return new Promise(resolve => {
        try {
            let opt ={
                url:time5Url,
                headers:commonHeaders,
                body:JSON.stringify({"doublingKey": "direct"})
            };
            $zeng.post(opt,(err,res,data)=>{
                let list = JSON.parse(data);
                if (list.code === 200){
                    console.log(`收取${list.data.reward}币`)
                } else{
                    console.log(list.message)
                }
            })
            resolve()
        }catch (e) {

        }
    })
}
function init() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const isJSBox = typeof $app != "undefined" && typeof $http != "undefined"
    const isNode = typeof require == "function" && !isJSBox;
    const node = (() => {
        if (isNode) {
            const request = require('request');
            return ({request})
        } else {
            return (null)
        }
    })()
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
        if (isNode) log(title + subtitle + message)
        if (isJSBox) $push.schedule({title: title, body: subtitle ? subtitle + "\n" + message : message})
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const adapterStatus = (response) => {
        if (response) {
            if (response.status) {
                response["statusCode"] = response.status
            } else if (response.statusCode) {
                response["status"] = response.statusCode
            }
        }
        return response
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = {url: options}
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, (error, response, body) => {
            callback(error, adapterStatus(response), body)
        })
        if (isNode) {
            node.request(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isJSBox) {
            if (typeof options == "string") options = {url: options}
            options["header"] = options["headers"]
            options["handler"] = function (resp) {
                let error = resp.error;
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data;
                if (typeof body == "object") body = JSON.stringify(resp.data);
                callback(error, adapterStatus(resp.response), body)
            };
            $http.get(options);
        }
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = {url: options}
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                callback(null, adapterStatus(response), response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) {
            $httpClient.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isNode) {
            node.request.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isJSBox) {
            if (typeof options == "string") options = {url: options}
            options["header"] = options["headers"]
            options["handler"] = function (resp) {
                let error = resp.error;
                if (error) error = JSON.stringify(resp.error)
                let body = resp.data;
                if (typeof body == "object") body = JSON.stringify(resp.data)
                callback(error, adapterStatus(resp.response), body)
            }
            $http.post(options);
        }
    }
    const log = (message) => console.log(message)
    const done = (value = {}) => {
        if (isQuanX) isRequest ? $done(value) : null
        if (isSurge) isRequest ? $done(value) : $done()
    }
    return {isQuanX, isSurge, isJSBox, isRequest, notify, write, read, get, post, log, done}
}

function Env(t,s){return new class{constructor(t,s){this.name=t,this.data=null,this.dataFile="box.dat",this.logs=[],this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,s),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}getScript(t){return new Promise(s=>{$.get({url:t},(t,e,i)=>s(i))})}runScript(t,s){return new Promise(e=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=s&&s.timeout?s.timeout:o;const[h,a]=i.split("@"),r={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":h,Accept:"*/*"}};$.post(r,(t,s,i)=>e(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s);if(!e&&!i)return{};{const i=e?t:s;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s),o=JSON.stringify(this.data);e?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(s,o):this.fs.writeFileSync(t,o)}}lodash_get(t,s,e){const i=s.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return e;return o}lodash_set(t,s,e){return Object(t)!==t?t:(Array.isArray(s)||(s=s.toString().match(/[^.[\]]+/g)||[]),s.slice(0,-1).reduce((t,e,i)=>Object(t[e])===t[e]?t[e]:t[e]=Math.abs(s[i+1])>>0==+s[i+1]?[]:{},t)[s[s.length-1]]=e,t)}getdata(t){let s=this.getval(t);if(/^@/.test(t)){const[,e,i]=/^@(.*?)\.(.*?)$/.exec(t),o=e?this.getval(e):"";if(o)try{const t=JSON.parse(o);s=t?this.lodash_get(t,i,""):s}catch(t){s=""}}return s}setdata(t,s){let e=!1;if(/^@/.test(s)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(s),h=this.getval(i),a=i?"null"===h?null:h||"{}":"{}";try{const s=JSON.parse(a);this.lodash_set(s,o,t),e=this.setval(JSON.stringify(s),i)}catch(s){const h={};this.lodash_set(h,o,t),e=this.setval(JSON.stringify(h),i)}}else e=$.setval(t,s);return e}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,s){return this.isSurge()||this.isLoon()?$persistentStore.write(t,s):this.isQuanX()?$prefs.setValueForKey(t,s):this.isNode()?(this.data=this.loaddata(),this.data[s]=t,this.writedata(),!0):this.data&&this.data[s]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,s=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,s)=>{try{const e=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(e,null),s.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)))}post(t,s=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t));else if(this.isNode()){this.initGotEnv(t);const{url:e,...i}=t;this.got.post(e,i).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t))}}time(t){let s={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in s)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?s[e]:("00"+s[e]).substr((""+s[e]).length)));return t}msg(s=t,e="",i="",o){const h=t=>!t||!this.isLoon()&&this.isSurge()?t:"string"==typeof t?this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0:"object"==typeof t&&(t["open-url"]||t["media-url"])?this.isLoon()?t["open-url"]:this.isQuanX()?t:void 0:void 0;$.isMute||(this.isSurge()||this.isLoon()?$notification.post(s,e,i,h(o)):this.isQuanX()&&$notify(s,e,i,h(o))),this.logs.push("","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="),this.logs.push(s),e&&this.logs.push(e),i&&this.logs.push(i)}log(...t){t.length>0?this.logs=[...this.logs,...t]:console.log(this.logs.join(this.logSeparator))}logErr(t,s){const e=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();e?$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){const s=(new Date).getTime(),e=(s-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,s)}

