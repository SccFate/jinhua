cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        cc.view.setResolutionPolicy(cc.ResolutionPolicy.EXACT_FIT);
        this.http = require("HTTP");
        this.net = cc.find("Canvas/netNode").getComponent("netControl");
        this.net.init(this.loginCallBack,this);
        var self=this;
        cc.login = function (code) {
           // cc.find("Canvas/edit").getComponent(cc.EditBox).string=code+"";
            self.net.codeToUserid(code);
        };
    },
    loginClick: function () {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "setWXLogin", "(Ljava/lang/String;)V", "ok");
    },
    showToast: function (msg) {
        cc.find("Canvas/toastNode").active = true;
        cc.find("Canvas/toastNode/label").getComponent(cc.Label).string = msg;
        cc.find("Canvas/toastNode/back").width = (msg.length + 2) * 40;
        setTimeout(function () {
            cc.find("Canvas/toastNode").active = false;
        }, 1000);
    },
    loginCallBack:function(e,info,p)
    {
        if(e=="err")
        {
            p.showToast(info);
        }
        else
        {
            if(e=="login")
            {
                Global.userid=info;
                p.loadGame("hallScene");
               
            }

        }
    },
    exitButtonClick: function () {
        cc.director.end();
    },
    loadGame:function(sce)
    {
        cc.find("Canvas/btnWX").pauseSystemEvents(true);
        var loadNode=cc.find("Canvas/loadNode");
        loadNode.active=true;
        loadNode.getChildByName("load").getComponent(cc.Animation).play("load");
        cc.director.loadScene(sce);  
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
