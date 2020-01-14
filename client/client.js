var config = {
    showMsgListLength: 200,
    sendMsgListLength: 5,
    messageType:{
        MT_Broadcast: 1,
        MT_Connected: 2,
        MT_Disconnected: 3,
        MT_Register: 4,
        MT_System: 5,
    }
}
var host = document.getElementById("wshost").value
var notice = document.getElementById("notice")
var username = document.getElementById("username")
var message = document.getElementById("message")
var msgBox = document.getElementById("msgBox")

var ws = null;

// 发送的消息序号
var noticeNo = 0
// 发送的消息序号
var noticeList = []

// 收到的消息列表
var msgList = []


function wsInit() {
    //判断当前浏览器是否支持WebSocket
    if ('WebSocket' in window) {
        ws = new WebSocket(host+"?u="+username.value);
    } else {
        alert('Bowser Not support ws')
        window.close()
        return
    }

    //连接发生错误的回调方法
    ws.onerror = function (evt) {
        noticeMsg("WebSocket connection error: " + evt.data);
        // closeWebSocket()
    }

    //连接成功建立的回调方法
    ws.onopen = function () {
        noticeMsg("WebSocket connection success");
        // 广播一次上线消息
        // ws.send(buildMsg(config.messageType.MT_Connected,getUsername()))
    }

    //接收到消息的回调方法
    ws.onmessage = function (event) {
        noticeMsg(event.data);
        showMsg(event.data)
    }

    //连接关闭的回调方法
    ws.onclose = function (evt) {
        noticeMsg("WebSocket connection closed: " + evt.code);
        // closeWebSocket()
    }

    //监听窗口关闭事件，当窗口关闭时，主动去关闭ws连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function () {
        closeWebSocket();
    }
}

function showMsg(msg) {
    // console.log(msg);
    // console.log(msg.User);
    // var msg2 = JSON.stringify(msg)
    var jsmsg = JSON.parse(msg)
    // console.log(jsmsg.User);

    if (jsmsg.MT == 4) {
        username.value = jsmsg.User
        return
    }
    var msgReal = "["+jsmsg.User +" "+jsmsg.SendAt+ "] " + jsmsg.Msg
    if (msgList.length > config.showMsgListLength) {
        msgList.shift()
    }
    msgList.push(msgReal)
    msgBox.value = msgList.join("\n")

    msgBox.scrollTop = msgBox.scrollHeight
}

//将发送和提示消息显示在网页上
function noticeMsg(text) {
    noticeNo++
    var tmpList = [buildNoticeMsg(text)]
    for (var i = 0; i < config.sendMsgListLength; i++) {
        if (noticeList.length >= i) {
            tmpList.push(noticeList[i])
        }
    }
    noticeList = tmpList
    notice.innerHTML = tmpList.join("<br>")
}

function buildNoticeMsg(text) {
    return noticeNo + " -- " + text;
}

//关闭WebSocket连接
function closeWebSocket() {
    if (ws!=null) {
        ws.close();
    }
}

function sendRandMsg() {
    var msg = randomString(8)
    message.value = msg
    sendMsg(msg)
}

function randomString(charlen) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var result = '';
    for (var i = charlen; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

//发送消息
function sendMsg() {
    if (!checkWs()) {
        return false
    }
    if (!checkMsg()) {
        return false
    }
    var msgs = buildMsg(config.messageType.MT_Broadcast, getMsg())
    ws.send(msgs);
    message.value = ""
}

function getUsername() {
    return username.value
}
function getMsg() {
    return message.value
}
function checkMsg() {
    var uname = getUsername()
    var msg = getMsg()

    // console.log(uname);
    if (uname == null || uname == "") {
        noticeMsg("username can't be empty")
        return false
    }
    if (msg == null || msg == "") {
        noticeMsg("message can't be empty")
        return false
    }
    return true
}

function buildMsg(messageType, msg) {
    return JSON.stringify({
        MT: messageType,
        Msg: msg,
    })
}

function checkWs() {
    if (ws == null || ws.readyState === ws.CLOSED) {
        noticeMsg("WebSocket do not connect")
        return false;
    }
    return true
}

function genUsername(id) {
    if (ws!=null) {
        ws.close()
        ws = null
    }
    msgList = []
    if (id==1) {
        getConfig()
    } else {
        wsInit()
    }
}