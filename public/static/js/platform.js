var X = handlers = {}

function switchDisplay(display) {
    var app = document.getElementById("app");
    if (app) {
        app.style.display = display;
    }
}

document.addEventListener('deviceready', function () {
    //注册处理器
    cordova.exec(function (task) {
        if (task.length < 2) {
            return;
        }
        var action = task[0];
        var callbackId = task[2];
        //执行处理器
        var handler = window.X[action];
        if (handler) {
            if (callbackId) {
                document.body.style.backgroundColor = "rgba(0,0,0,0)";
                // switchDisplay("none")
            }
            handler(task[1][0], function (err, data) {

                //回调给原生
                cordova.exec(function (ackData) {

                }, function (ackError) {

                }, "XPlatform", "callback", [callbackId, [err, data]]);
                if (callbackId) {
                    setTimeout(function () {
                        document.body.style.backgroundColor = "rgb(255,255,255)"
                        // switchDisplay("block")
                    }, 50)
                }
            })

        }

    }, function (err) {

    }, "XPlatform", "registerHandler", [])
});


