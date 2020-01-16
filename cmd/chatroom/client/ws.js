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
    var msg = greet()
    message.value = msg
    sendMsg(msg)
}

// function randomString(charlen) {
//     var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
//     var result = '';
//     for (var i = charlen; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
//     return result;
// }

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


function greet() {
    var slice = [youmo,hejiu,mingyanzhuangbi,englishGreeting,laoshi,movieMingyan]

    var idx = randomNum(0,slice.length-1)

    return slice[idx]()
}
//生成从minNum到maxNum的随机数
function randomNum(minNum,maxNum){
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
            break;
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
            break;
        default:
            return 0;
            break;
    }
}

function englishGreeting() {
    var slice = [
        "hello !!!",
        "hi !!!",
        "hello guys",
        "hello every one",
        "what a fine day",
        "today is a fine day",
        "nice to meet you",
        "hi, long time no see",
        "nice talking to you",
    ]
    return slice[randomNum(0,slice.length-1)]
}

function youmo() {
    var slice = ["瘦不了的永远在骚动，吃不胖的都有恃无恐。",
"只是因为在人群中多看了你一眼，后来便瞎了眼。",
"扔硬币：正面就去上网、反面就去睡觉，立起来就去写作业。",
"你连姚明都不知道，我怎么和你踢足球呢？你真搞笑。",
"这世界上妖怪越来越多了，唐僧越来越少了。",
"真怀念小时候啊，天热的时候我也可以像男人一样光膀子！",
"我本来想给生活一个吻，而现实却给了我两巴掌，你说作为回报，我能不踹他一脚么？",
"脸乃身外之物，可要可不要，钱乃必要之物，不得不要。",
"远看一座庙，近看咱母校，三百多尼姑，一万多老道。",
"只要锄头舞的好，哪有墙角挖不倒？",
"人如果靠吃饭活着，那饭不叫饭，叫饲料。",
"所谓自然醒，其实是被尿憋醒的。一点点语录网",
"你长的外形不准，比例没打好。",
"母牛撞上高压线，真是牛逼带闪电。",
"接下来为您表演家传绝技，大石碎胸口。",
"一时的冲动，子孙的危机！",
"这年头做女人真难，你开放点人家说你骚，你传统点人家说你装。",
"考试时，本想要咸鱼翻锅的，他奶奶的，没想到粘锅了。",
"其实，我不是胖，只是懒得瘦。",
"少女诚可贵、少妇价更高、若有富婆在、二者皆可抛。",
"步步高打火机，哪里不会点哪里。",
"这种穿一件衣服，就要回被窝里裹个五分钟，缓冲一下的心情谁能懂？",
"你别总日啊日的，你家老母狗都快怀孕了。",
"班主任是什么：就是一个破坏完你友情，再破坏你爱情，还不放过你亲情的人。",
"贱也是一种艺术，让我们一起将这门艺术搞好吧！",
"我妈从小就教育我，学海无涯，回头是岸。",
"如果有下辈子，我一定要做你的心脏，因为我不跳，你就得死。",
"如果不能美得惊人，那就丑得勾魂吧！",
"装逼只是瞬间，不要脸才是永恒。",
"给你扔老虎笼子里，老虎都不敢吃你都嫌你牙碜。",
"在猪圈里，你不必讲究人类的礼仪",
"人之初，性本善，你掏钱，我吃饭。",
"当初我看上你，因为我脑子进水了，现在我脑子抖干了。",
"你的矮是终生的，我的胖却是暂时的。",
"和你擦肩而过你却不知道是我，因为我把头扭过去了。",
"从前有人在我空间里跑堂，不到两秒钟，嘎的一下就死了。",
"不要乐观的像个屁一样，自以为能惊天动地。",
"睡着睡着，就睡出了理想和口水。",
"昨天去市里参加放鸽子比赛，结果就我一个人去了。",
"风刮的真大，把我移动的手机信号都刮成联通的啦！",
"如果我死了，我的第一句话是：老子终于不用怕鬼了。",
"春色满园关不住，我诱红杏出墙来。",
"我不但手气好，脚气也不错。",
"甜的、香的、辣的、酸的、苦的、这么多味道……你却偏偏喜欢骚的。",
"开往地狱的火车，已启程，请勿扰。",
"自从人晒黑了，脸色好看了，牙齿变白了，喝酒都不脸红了。",
"瘦不了的永远在骚动，吃不胖的都有恃无恐。",
"我娘说浪子回头金不换，谁给我金子?我换。",
"不是实行男女平等了吗？凭什么哥就不能上女厕所？"]
    return slice[randomNum(0,slice.length-1)]
}

function mingyanzhuangbi() {
    var slice = ["你走了真好，不然总担心你要走。——张小娴",
"我不怕黑。可我怕躲在黑暗中的人。——尼尔·盖曼 《美国众神》",
"哪个更痛苦，努力还是后悔?——凯尔特人队训",
"把自己交给繁忙，得到的是踏实，却不是真实。——《无问西东》",
"人生是一场旅程。我们经历了几次轮回，才换来这个旅程。而这个旅程很短，因此不妨大胆一些，不妨大胆一些去爱一个人，去攀一座山，去追一个梦……有很多事我都不明白。但我相信一件事。上天让我们来到这个世上，就是为了让我们创造奇迹。——《大鱼海棠》",
"我们使用时间的方式就是我们塑造自己的方式。——《逻辑思维》",
"这一生只有两件事能报复你，一是努力不够的辜负，二是不好好照顾身体留下的后患。——《逻辑思维》",
"人这一生，自私很容易，爱自己却很难。——杨绛",
"自由固不是钱所能买到的，但能够为钱而卖掉。——鲁迅",
"生活最沉重的负担不是生活，而是无聊。——罗曼罗兰",
"运气不过是机会碰到了你的努力。——李笑来",
"当四周的浪大了，稳定的船又有什么用?——马薇薇",
"美好的回忆来自适时的分离。——张小娴",
"明明是我们看错了世界，却说世界欺骗了我们。——张小娴",
"别人稍一注意你，你就敞开心扉，你觉得这是坦率，其实这是孤独。——马东"]
    return slice[randomNum(0,slice.length-1)]
}

function hejiu() {
    var slice = ["宁可胃上烂个洞，不叫感情裂条缝。",
"酒逢知己饮，诗向会人吟。",
"百川到东海，何时再干杯，现在不喝酒，将来徒伤悲。",
"商品经济大流通，开放搞活喝两盅。",
"一喝就倒，官位难保。",
"男人不喝酒活的象条狗，男人不抽烟活的象太监，女人不化妆白活在世上，女人不抽烟白活在人间。",
"主人举杯对在座的说道：“女人大点口，男人全进去。”",
"一喝九量，重点培养。",
"东风吹，战鼓雷，今天喝酒谁怕谁!",
"喝得群众翻白眼，喝得单位缺经费;喝得老婆流眼泪，晚上睡觉背靠背，一状告到纪委会，书记听了手一挥：能喝不喝也不对，我们也是天天醉!",
"两腿一站，喝了不算。",
"女士劝酒：激动的心，颤抖的手，我给领导倒杯酒，领导不喝嫌我丑。",
"不会喝酒，前途没有。",
"只要心里有，茶水也当酒。",
"市场经济搞竞争，快将美酒喝一盅。"]
    return slice[randomNum(0,slice.length-1)]
}

function movieMingyan() {
    var slice = ["Yesterday is history, tomorrow is a mystery, but today is a gift, that is why it’s called present！ (昨天已成为历史，明天是未知的，而今天是上天赐予我们的礼物，这就是为什么我们把它叫做现在！——《功夫熊猫》)",
        "If there’s any kind of magic in the world, it must be the attempt of understanding someone or share something. (如果世上真的有什么奇迹，那么一定是去理解他人和与人分享。——《日出之前》)",
        "I promise you, if God had gifted me with wealth and beauty, I would make it as hard for you to leave me now as it is for me to leave you. (告诉你吧，如果上帝赐予我财富和美貌，我会让您难以离开我，就像我现在难以离开您。——《简·爱》)",
        "Time erodes all such beauty, but what it cannot diminish… is the wonderful workings of your mind. Your humor, your kindness… and your moral courage. (时间可以吞噬一切,但它丝毫不能减少的是你伟大的思想,你的幽默,你的善良,还有你的勇气。——《小妇人》)",
        "I was blessed to have you in my life. When I look back on these days, I’ll look and see your face.You were right there for me. (在我的生命中有你是多么幸运,当我回忆过去, 眼前就会浮现你的脸庞 ,你总会在那守候着我。——《珍珠港》)",
        "I guess our love story will never be seen on the big wide silver screen, but it hurt just as badly when I had to watch you go. (我想，我们的故事永远不会出现在银幕上，可是当我看着你离去，我的心一样的痛楚。 ——《卡萨布兰卡》)",
        "If you really love someone, the whole life will not be enough. You need time to know, to forgive and to love. All this needs a very big mind. (爱的次数不需多，只需真爱。真爱需要时间去经营，需要用心去了解，需要胸襟去包容。——《初恋50次》)",
        "Some people hear their own inner voices with great clearness. And they live by what they hear.Such people become crazy,or they become legends … (有些人能清楚地听到自己内心深处的声音，并以此行事。这些人要么变成了疯子，要么成为传奇。——《秋日传奇》)",
        "To be a princess, you have to believe you are one. You’ve got to walk the way you think a princess would walk. Smile and wave, and just have fun. (要想成为公主，你得相信自己就是一个公主。你应该像你所想象中的公主那般为人处世。高瞻远嘱，从容不迫，笑对人生。——《公主日记》)",
        "You got a dream,you gotta protect it.People can’t do something themselves,they wanna tell you you can’t do it.If you want something,go get it. (不要别人告诉你该做什么，有梦想，就得保护。他人做不成什么事情，就跟你说你也做不成。如果你想要什么，就要去争取。——《当幸福来敲门》)",
        "We never had the chance to explore the outside world because of my dad's one rule:New is always bad. Never not be afraid!  (我们从没机会探索外面的世界，是因为我爸爸的那条规则：新事物是不好的，永远要小心!——《疯狂原始人》)",
        "This path has been placed before you. The choice is yours alone.  (路就在你脚下，你自己决定。——《星球大战－首部曲》)",
        "Nothing just happens,it's all part of a plan. (没有事情随随便便发生，都是计划的一部分。)",
        "It takes a strong man to save himself, and a great man to save another. (坚强的人只能救赎自己，伟大的人才能拯救他人。)",
        "Hope is a good thing, maybe the best of things, and no good thing ever dies. (希望是美好的，也许是人间至善，而美好的事物永不消逝.)",
        "Some birds aren't meant to be caged, that's all. Their feathers are just too bright... (有的鸟是不会被关住的，因为它们的羽毛太美丽了！)",
        "Fear can hold you prisoner. Hope can set you free. A strong man can save himself. A greatman can save another. (懦怯囚禁人的灵魂，希望可以感受自由。强者自救，圣者渡人。 --《肖申克的救赎》)",
        "Your story may not have a happy beginning, but that doesn't make you who you are, it is restof your story, who you choose to be. (你或许没有一个幸福的开始，但是这并不能够代表你的所有，接下来你的生活取决于你的选择。 --《功夫熊猫2》)",
        "When you choose to become others, you will lose yourself. (当你选择成为别人时，你将失去你自己。 --《纳尼亚传奇3》)",]
    return slice[randomNum(0,slice.length-1)]
}

function laoshi() {
    var slice = ["你们是我教过的学生中最差的一届",
"这又是一道送分题",
"你们一人浪费一分钟，这一节课就过去了",
"看我干嘛？看书啊.、看书干嘛？看黑板啊、看黑板干嘛？看我啊",
"上初中时:等你们高中了就轻松了. 上高中时：等你们大学了就轻松了",
"我就耽误大家一分钟，这道题讲完就下课",
"这题还有没有不懂的？好，我们来看下一道题",
"体育老师今天有事，这节课我来上",
"你晚上打鬼去啦？这么一点作业都没做完！给我滚到外面去补",
"没人举手是吧？那我点名了"]
    return slice[randomNum(0,slice.length-1)]
}