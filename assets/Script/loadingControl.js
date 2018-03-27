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
        userid: ""
    },
    onLoad: function () {
        cc.view.setResolutionPolicy(cc.ResolutionPolicy.EXACT_FIT);
       this.load();
    },
    // use this for initialization
    load: function () {
        cc.creDialogInfo = {
            OpenState: 2,
            JoinType: 1,
            Quan: 12,
            GameNum: 4,
            LookNum: 0,
            BaoMoney: 0,
            ShunMoney: 0,
            Money235: 0,
            TimeOut: 15,
            BiBei: 1,
            Card235: 0,
            Type: 0,
            Hang: 1
        };
        cc.juleCreDialogInfo = {
            ClubID: "000000",
            OpenState: 2,
            JoinType: 1,
            Quan: 12,
            GameNum: 4,
            LookNum: 0,
            BaoMoney: 0,
            ShunMoney: 0,
            Money235: 0,
            TimeOut: 15,
            BiBei: 1,
            Card235: 0,
            Type: 1,
            Hang: 1
        };
       // cc.sys.localStorage.setItem("userid",225894+this.getRandNum(4)+"");
        this.net = cc.find("Canvas/netNode").getComponent("netControl");
        this.net.init(null, null);
        if (this.net.isWechatLogin()) {
            Global.userid = this.net.userid;
            cc.director.loadScene("hallScene");
        }
        else {
            cc.director.loadScene("loginScene");
        }

    },
	getRandNum: function (num) {
		var randomDeskNum = Math.floor(Math.random() * num) + 1;
		if (randomDeskNum > num) {
			randomDeskNum = num;

		}
		return randomDeskNum;
	},
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
