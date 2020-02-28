
var imgshow = $("#imgshow")
imgshow.click(function () {
    $(this).fadeOut(200)
})
function imgShow(obj) {
    imgshow.fadeIn(200)
    imgshow.css("z-index",99999)
    imgshow.find("img").attr("src", $(obj).attr("src"))
}

function login() {
    showModule("friends")
    return false
    var username = $("#username")
    var password = $("#password")

    $.post("/login", {username: username, password: password}, function (resp) {
        if (resp.Code != 200) {
            alert(resp.Msg)
            return false
        }
        // 记录token
        localStorage.setItem("token", resp.data.token)
        localStorage.setItem("userinfo", JSON.stringify(resp.data.userinfo))
        // 展示好友列表
        showModule("friends")
        // 打开websocket连接
        wsInit()
    }, "json")
}

function logout() {
    showModule("login")
}

function showModule(id) {
    $(".module").fadeOut(300)
    $("#" + id).fadeIn()
}

function chat(chat_id) {
    showModule("chat")
    //todo 获取具体的聊天信息

    // 滚动到最下边
    msgBoxSrollToTop()
}

function back() {
    showModule("friends")
}

function add() {
    var head_user = $(".head_user")
    if (head_user.is(":hidden")) {
        head_user.show()
    } else {
        // 提交
        alert("submit...")
        head_user.hide(500)
    }
}