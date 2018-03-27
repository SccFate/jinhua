import { EILSEQ } from "constants";

cc.Class({
    extends: cc.Component,

    properties: {
        personZhanjiPre: {
            default:
                null,
            type: cc.Prefab,
        },
        juleItemPre:
            {
                default: null,
                type: cc.Prefab
            },
        chengyuanPre:
            {
                default: null,
                type: cc.Prefab
            },
        juleMsgPre:
            {
                default: null,
                type: cc.Prefab
            },
        juleRoomItemPre:
            {
                default: null,
                type: cc.Prefab
            },
        zhanjiPre:
            {
                default: null,
                type: cc.Prefab
            },
        dnZhanjiPre:
            {
                default: null,
                type: cc.Prefab
            },
        huiyuanItemPre:
            {
                default: null,
                type: cc.Prefab
            },
        buyPre:
            {
                default: null,
                type: cc.Prefab
            },

        vipItemPre:
            {
                default: null,
                type: cc.Prefab
            },
        dailiItemPre:
            {
                default: null,
                type: cc.Prefab
            },
        bottomList:
            {
                default: [],
                type: cc.Node
            }

    },
    // use this for initialization
    onLoad: function () {
        cc.view.setResolutionPolicy(cc.ResolutionPolicy.EXACT_FIT);
        this.audioControl = this.node.getChildByName("audioManager").getComponent("audioControl");
        this.net = cc.find("Canvas/netNode").getComponent("netControl");
        this.net.init(this.netCallBack, this);
        cc.userid = this.net.userid;
        cc.temp = {};
        cc.createState = "liangzhang";
        Global.roomNum = null;
        this.yqm = "";
        var self = this;
        this.userInfo = null;
        var loadNode = cc.find("Canvas/loadNode");
        loadNode.active = false;
        /*
        this.net.getPersonInfo(this.net.userid);
        self.net.getNotice();
        this.schedule(function () {
            self.net.getNotice();
        }, 60);*/
        this.audioControl.init();
        this.audioControl.playBGM("dtbg");
        /*
        setTimeout(function () {
            //self.net.getPersonInfo(self.net.userid);
            self.net.getNotice();
        }, 1000);*/
        this.initDialogData();
        this.host = "ws://182.61.58.129:2019";
        this.initWebSocket();
        //self.showToast(jsb.fileUtils.getWritablePath());

    },
    initDialogData: function () {
        if (cc.creDialogInfo) {
            if (cc.creDialogInfo.OpenState + "" == "2") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/kaifangTip/kaifangTo/toggle1").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/kaifangTip/kaifangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle1/New Label").getComponent(cc.Label).string = "x2";
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle2/New Label").getComponent(cc.Label).string = "x2";
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle3/New Label").getComponent(cc.Label).string = "x6";
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle4/New Label").getComponent(cc.Label).string = "x8";

            }
            else {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/kaifangTip/kaifangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/kaifangTip/kaifangTo/toggle2").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle1/New Label").getComponent(cc.Label).string = "x1";
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle2/New Label").getComponent(cc.Label).string = "x1";
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle3/New Label").getComponent(cc.Label).string = "x3";
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle4/New Label").getComponent(cc.Label).string = "x4";

            }
            if (cc.creDialogInfo.JoinType + "" == "1") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/jiaruTip/jiaruTo/toggle1").getComponent(cc.Toggle).isChecked = true;
            }
            else {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/jiaruTip/jiaruTo/toggle1").getComponent(cc.Toggle).isChecked = false;
            }

            if (cc.creDialogInfo.Card235 + "" == "1") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/spTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
            }
            else {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/spTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = true;
            }

            if (cc.creDialogInfo.Quan + "" == "12") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.creDialogInfo.Quan + "" == "18") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.creDialogInfo.Quan + "" == "24") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = true;
            }
            if (cc.creDialogInfo.GameNum + "" == "4") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle1").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.creDialogInfo.GameNum + "" == "8") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle2").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.creDialogInfo.GameNum + "" == "16") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle3").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle4").getComponent(cc.Toggle).isChecked = true;
            }

            if (cc.creDialogInfo.LookNum + "" == "0") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.creDialogInfo.LookNum + "" == "1") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.creDialogInfo.LookNum + "" == "3") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = true;
            }

            if (cc.creDialogInfo.BaoMoney + "" == "0") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.creDialogInfo.BaoMoney + "" == "5") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.creDialogInfo.BaoMoney + "" == "10") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = true;
            }




































            if (cc.creDialogInfo.ShunMoney + "" == "0") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.creDialogInfo.ShunMoney + "" == "2") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.creDialogInfo.ShunMoney + "" == "5") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = true;
            }


            if (cc.creDialogInfo.Money235 + "" == "0") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.creDialogInfo.Money235 + "" == "5") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.creDialogInfo.Money235 + "" == "10") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = true;
            }


























            if (cc.creDialogInfo.TimeOut + "" == "15") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.creDialogInfo.TimeOut + "" == "30") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.creDialogInfo.TimeOut + "" == "45") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = true;
            }


            if (cc.creDialogInfo.BiBei + "" == "1") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bipaiTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bipaiTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.creDialogInfo.BiBei + "" == "2") {
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bipaiTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bipaiTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = true;
            }
        }



































        if (cc.juleCreDialogInfo) {
            if (cc.juleCreDialogInfo.OpenState + "" == "2") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/kaifangTip/kaifangTo/toggle1").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/kaifangTip/kaifangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle1/New Label").getComponent(cc.Label).string = "x2";
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle2/New Label").getComponent(cc.Label).string = "x2";
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle3/New Label").getComponent(cc.Label).string = "x6";
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle4/New Label").getComponent(cc.Label).string = "x8";

            }
            else {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/kaifangTip/kaifangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/kaifangTip/kaifangTo/toggle2").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle1/New Label").getComponent(cc.Label).string = "x1";
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle2/New Label").getComponent(cc.Label).string = "x1";
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle3/New Label").getComponent(cc.Label).string = "x3";
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle4/New Label").getComponent(cc.Label).string = "x4";

            }
            if (cc.juleCreDialogInfo.JoinType + "" == "1") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/jiaruTip/jiaruTo/toggle1").getComponent(cc.Toggle).isChecked = true;
            }
            else {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/jiaruTip/jiaruTo/toggle1").getComponent(cc.Toggle).isChecked = false;
            }

            if (cc.juleCreDialogInfo.Card235 + "" == "1") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/spTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
            }
            else {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/spTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = true;
            }

            if (cc.juleCreDialogInfo.Quan + "" == "12") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.juleCreDialogInfo.Quan + "" == "18") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.juleCreDialogInfo.Quan + "" == "24") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/quanshuLimitTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = true;
            }
            if (cc.juleCreDialogInfo.GameNum + "" == "4") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle1").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.juleCreDialogInfo.GameNum + "" == "8") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle2").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.juleCreDialogInfo.GameNum + "" == "16") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle3").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle4").getComponent(cc.Toggle).isChecked = true;
            }

            if (cc.juleCreDialogInfo.LookNum + "" == "0") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.juleCreDialogInfo.LookNum + "" == "1") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.juleCreDialogInfo.LookNum + "" == "3") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bimenQuanTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = true;
            }

            if (cc.juleCreDialogInfo.BaoMoney + "" == "0") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.juleCreDialogInfo.BaoMoney + "" == "5") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.juleCreDialogInfo.BaoMoney + "" == "10") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/baoziTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = true;
            }




































            if (cc.juleCreDialogInfo.ShunMoney + "" == "0") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.juleCreDialogInfo.ShunMoney + "" == "2") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.juleCreDialogInfo.ShunMoney + "" == "5") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/shunjinTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = true;
            }


            if (cc.juleCreDialogInfo.Money235 + "" == "0") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.juleCreDialogInfo.Money235 + "" == "5") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.juleCreDialogInfo.Money235 + "" == "10") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/235Tip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = true;
            }


























            if (cc.juleCreDialogInfo.TimeOut + "" == "15") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.juleCreDialogInfo.TimeOut + "" == "30") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.juleCreDialogInfo.TimeOut + "" == "45") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = false;
            }
            else {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle3").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/tuoguanTip/xuanzhuangTo/toggle4").getComponent(cc.Toggle).isChecked = true;
            }


            if (cc.juleCreDialogInfo.BiBei + "" == "1") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bipaiTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = true;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bipaiTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = false;
            }
            else if (cc.juleCreDialogInfo.BiBei + "" == "2") {
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bipaiTip/xuanzhuangTo/toggle1").getComponent(cc.Toggle).isChecked = false;
                cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/bipaiTip/xuanzhuangTo/toggle2").getComponent(cc.Toggle).isChecked = true;
            }






















        }

    },
    roomPasteButtonClick: function () {


    },
    julebuButtonClick: function () {
        cc.find("Canvas/mask").pauseSystemEvents(true);
        cc.find("Canvas/julebuDialogNode").active = true;
        cc.socket.sendMessage(6, {});
    },
    joinRoomButtonClick: function () {
        var roomNum = cc.find("Canvas/joinDialogNode/dialog/keyLabelNode").getComponent("keyLabelControl").getStr();
        if (roomNum.length == 6) {
            cc.socket.sendMessage(2, {
                RoomID: roomNum
            });
            //window.location.href="http://game.ycluck.top/game/?userid="+this.net.userid+"&roomNum="+roomNum;
            //this.net.JoinRoom(this.net.userid, roomNum);
        }
        else {
            this.showToast("请输入6位房间号码");
        }



    },

    initWebSocket: function () {
        var self = this;
        cc.log(this.host);
        cc.socket = new WebSocket(this.host);
        cc.socket.sendMessage = function (state, infoArray) {
            try {
                var jsInfo = {
                    state: "9999999",
                    UserID: cc.userid
                }
                jsInfo.state = state;
                for (var k in infoArray) {
                    jsInfo[k] = infoArray[k];
                }
                cc.log("send " + JSON.stringify(jsInfo));
                cc.socket.send(JSON.stringify(jsInfo));

            }
            catch (err) {
                cc.log(err);
            }
        },
            cc.socket.onopen = function (evt) {
                self.closeAlert();
                cc.log("connect ok");
                if (self.reconing) {
                    cc.socket.sendMessage(0, {});
                    cc.socket.sendMessage(5, {});
                }
                else {
                    cc.socket.sendMessage(0, {});
                    cc.socket.sendMessage(5, {});
                }
                self.reconing = false;

            };
        cc.socket.onclose = function (evt) {
            self.showAlert("正在重连中。。。");
            self.reconing = true;
            setTimeout(function () {


                self.initWebSocket();


            }, 2000);

        };
        cc.socket.onmessage = function (evt) {
            cc.log("connect msg " + evt.data);

            if (evt.data.length > 0) {
                var info = JSON.parse(evt.data);
                var msg = "";
                info.state = parseInt(info.state);

                switch (info.state) {
                    case 0:
                        self.netCallBack("userinfo", info, self);
                        if (info.State == "0") {
                            cc.find("Canvas/juleDialogNode/dialog/msg").active = false;
                            cc.find("Canvas/mask/centerNode/topNode/sendButton").active = false;

                        }
                        else if (parseInt(info.State) > 0) {
                            cc.find("Canvas/mask/centerNode/topNode/sendButton").active = true;
                            self.isDaili = true;
                            cc.find("Canvas/juleDialogNode/dialog/msg").active = true;
                        }
                        var gps = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getGps", "(Ljava/lang/String;)Ljava/lang/String;", "ok");
                        if (gps != "null" && typeof gps != "undefined") {
                            var x = gps.split(",")[1];
                            var y = gps.split(",")[0];
                            cc.socket.sendMessage(22, { X: x, Y: y });
                        }
                        break;
                    case 5:
                        self.netCallBack("notice", info, self);
                        cc.temp.msgMsg = info.Msg;
                        cc.find("Canvas/msgDialogNode/dialog/scroll/view/content").getComponent(cc.Label).string = cc.temp.msgMsg;
                        break;
                    case 16:
                        cc.temp.zhaomuMsg = info.ZM;
                        cc.temp.dingzhiMsg = info.DZ;
                        break;
                    case 3:
                        info.data = info.Data;
                        self.netCallBack("zhanji", info, self);
                        break;
                    case 2:
                        if (info.Roler == "1") {
                            cc.roomNum = info.RoomNum;

                            // self.showToast(info.RoomNum + " 加入成功");
                            self.loadGame("zjhGameScene");

                        }
                        else if (info.Roler == "0") {
                            self.showToast("房间不存在");
                        }
                        else if (info.Roler == "2") {
                            self.showToast("牌局已开始不允许加入");
                        }
                        else if (info.Roler == "3") {
                            self.showToast("房卡不足");
                        }
                        else {
                            self.showToast("加入房间失败");
                        }
                        break;
                    case 1:
                        if (info.Roler == "1") {

                            // self.showToast(info.RoomID + " 创建成功");
                            if (cc.find("Canvas/createDialogNode").active) {
                                cc.roomNum = info.RoomID;
                                self.loadGame("zjhGameScene");
                            }
                            else {
                                self.showToast(info.RoomID + " 创建成功");
                                self.dialogClose("null", "juleCreate");
                                self.juleRefreshRoomClick();

                            }

                        }
                        else if (info.Roler == "2") {
                            self.showToast("房卡不足");
                        }
                        else {
                            self.showToast("创建失败");
                        }
                        break;
                    case 7:
                        // var zhanjiNode=cc.find("Canvas/zhanjiDialogNode/topNode/jifenLabel");
                        //  zhanjiNode.getComponent(cc.Label).string=info.Info+"";
                        var jiluNode = cc.find("Canvas/julebuDialogNode/dialog/juleRoomScroll/view/content/list");
                        jiluNode.removeAllChildren();
                        var height = 0;
                        if (info.IsOwner == "1") {
                            cc.find("Canvas/juleSetDialogNode/button/tip").getComponent(cc.Label).string = "解散俱乐部";
                            cc.find("Canvas/julebuDialogNode/dialog/hasmsg").active=false;
                            cc.find("Canvas/julebuDialogNode/dialog/nomsg").active=true;
                        }
                        else {
                            cc.find("Canvas/juleSetDialogNode/button/tip").getComponent(cc.Label).string = "退出俱乐部";
                            cc.find("Canvas/julebuDialogNode/dialog/nomsg").active=false;
                            cc.find("Canvas/julebuDialogNode/dialog/hasmsg").active=false;
                        }
                        for (var i = 0; i < info.Data.length; i++) {
                            (
                                function (k) {
                                    var pre = cc.instantiate(self.juleRoomItemPre);
                                    height = (pre.scaleX * pre.height);
                                    pre.getChildByName("roomOwner").getComponent(cc.Label).string = "房主ID:" + info.Data[k].OwnerID + "";
                                    pre.getChildByName("roomId").getComponent(cc.Label).string = "房号:" + info.Data[k].RoomID + "";
                                    pre.getChildByName("roomPersonNum").getComponent(cc.Label).string = "人数:" + info.Data[k].UserSum + "/9";
                                    var state = "";
                                    if (info.Data[i].State == "0") {
                                        pre.getChildByName("roomStateOff").active = true;
                                        pre.getChildByName("roomStateOn").active = false;
                                    }
                                    else if (info.Data[i].State == "1") {
                                        pre.getChildByName("roomStateOff").active = false;
                                        pre.getChildByName("roomStateOn").active = true;
                                    }
                                    else {
                                        state = "已结束";
                                    }
                                    pre.getChildByName("zhu").getChildByName("label").getComponent(cc.Label).string = info.Data[k].Hang + "分";
                                    pre.getChildByName("bei").getChildByName("label").getComponent(cc.Label).string = info.Data[k].BiBei + "倍";
                                    pre.getChildByName("time").getChildByName("label").getComponent(cc.Label).string = info.Data[k].TimeOut + "秒";

                                    pre.getChildByName("te").getChildByName("baozi").getComponent(cc.Label).string = "豹子喜钱(" + info.Data[k].BaoMoney + "分)";
                                    pre.getChildByName("te").getChildByName("235").getComponent(cc.Label).string = "235喜钱(" + info.Data[k].BaoMoney + "分)";
                                    pre.getChildByName("te").getChildByName("shunjin").getComponent(cc.Label).string = "顺金喜钱(" + info.Data[k].ShunMoney + "分)";
                                    pre.getChildByName("te").getChildByName("bimen").getComponent(cc.Label).string = "必闷圈数(" + info.Data[k].LookNum + "圈)";
                                    pre.getChildByName("te").getChildByName("quan").getComponent(cc.Label).string = "圈数上限(" + info.Data[k].Quan + "圈)";
                                    if (info.Data[k].Card235 == "0") {
                                        pre.getChildByName("te").getChildByName("235Da").getComponent(cc.Label).string = "235打豹子(是)";
                                    }
                                    else {
                                        pre.getChildByName("te").getChildByName("235Da").getComponent(cc.Label).string = "235打豹子(否)";
                                    }
                                    pre.info = info.Data[k];
                                    cc.loader.load({ url: info.Data[k].Photo, type: 'png' }, function (err, texture) {
                                        pre.getChildByName("head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                                    });
                                    /*
                                    for (var k = 0; k < 6; k++) {
                                        pre.getChildByName("room").getChildByName("person").getChildByName("person" + (k + 1)).active = false;
                                    }
                                    for (var k = 0; k < info.data[i].list.length; k++) {
                                        (
                                            function (q) {
                                                var perPre = pre.getChildByName("room").getChildByName("person").getChildByName("person" + (q + 1));
                                                perPre.active = true;
                                                perPre.getChildByName("name").getComponent(cc.Label).string = info.data[i].list[q].NickName;
                                                perPre.getChildByName("coin").getComponent(cc.Label).string = info.data[i].list[q].Points;
                                                cc.loader.load({ url: info.data[i].list[q].Photo, type: 'png' }, function (err, texture) {
                                                    perPre.getChildByName("head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                                                });
                                            }
                                        )(k);
                                    }*/
                                    jiluNode.addChild(pre);
                                    pre.setPosition(0, -k * height);
                                    pre.on('click', self.juleRoomItemClick, self);
                                }
                            )(i);
                        }
                        jiluNode.parent.height = info.Data.length * height;

                        break;
                    case 6:
                        // var zhanjiNode=cc.find("Canvas/zhanjiDialogNode/topNode/jifenLabel");
                        //  zhanjiNode.getComponent(cc.Label).string=info.Info+"";
                        var jiluNode = cc.find("Canvas/julebuDialogNode/dialog/juleScroll/view/content/list");
                        jiluNode.removeAllChildren();
                        var height = 0;
                        for (var i = 0; i < info.Data.length; i++) {
                            (
                                function (k) {
                                    var pre = cc.instantiate(self.juleItemPre);
                                    height = (pre.scaleX * pre.height);
                                    pre.getChildByName("name").getComponent(cc.Label).string = info.Data[k].ClubName + "";
                                    pre.getChildByName("num").getComponent(cc.Label).string = info.Data[k].UserCount + "";
                                    pre.info = info.Data[k];
                                    cc.loader.load({ url: info.Data[k].Photo, type: 'png' }, function (err, texture) {
                                        pre.getChildByName("head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                                    });
                                    /*
                                    for (var k = 0; k < 6; k++) {
                                        pre.getChildByName("room").getChildByName("person").getChildByName("person" + (k + 1)).active = false;
                                    }
                                    for (var k = 0; k < info.data[i].list.length; k++) {
                                        (
                                            function (q) {
                                                var perPre = pre.getChildByName("room").getChildByName("person").getChildByName("person" + (q + 1));
                                                perPre.active = true;
                                                perPre.getChildByName("name").getComponent(cc.Label).string = info.data[i].list[q].NickName;
                                                perPre.getChildByName("coin").getComponent(cc.Label).string = info.data[i].list[q].Points;
                                                cc.loader.load({ url: info.data[i].list[q].Photo, type: 'png' }, function (err, texture) {
                                                    perPre.getChildByName("head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                                                });
                                            }
                                        )(k);
                                    }*/
                                    jiluNode.addChild(pre);
                                    pre.setPosition(0, -k * height);
                                    pre.on('click', self.juleItemClick, self);
                                }
                            )(i);
                        }
                        jiluNode.parent.height = info.Data.length * height;
                        if (info.Data.length > 0) {
                            cc.socket.sendMessage(7, { ClubID: info.Data[0].ClubID });
                            cc.socket.sendMessage(12, { ClubID: info.Data[0].ClubID });
                            cc.temp.ClubID = info.Data[0].ClubID;
                            cc.find("Canvas/julebuDialogNode/dialog/juleName").getComponent(cc.Label).string = "俱乐部:" + info.Data[0].ClubName;
                            cc.find("Canvas/julebuDialogNode/dialog/juleId").getComponent(cc.Label).string = "俱乐部ID:" + info.Data[0].ClubID;
                        }
                        else
                        {
                            cc.temp.ClubID=null;
                            var jiluNode = cc.find("Canvas/julebuDialogNode/dialog/juleRoomScroll/view/content/list");
                            jiluNode.removeAllChildren();
                            cc.find("Canvas/julebuDialogNode/dialog/juleName").getComponent(cc.Label).string = "";
                            cc.find("Canvas/julebuDialogNode/dialog/juleId").getComponent(cc.Label).string = "";

                        }
                        break;
                    case 8:
                        if (info.Roler == "1") {
                            self.showToast("创建成功");
                            cc.socket.sendMessage(6, {});
                            self.closeJuleCreClick();

                        }
                        else if (info.Roler == "2") {
                            self.showToast("不是群主或代理无法创建俱乐部");
                        }
                        else if (info.Roler == "3") {
                            self.showToast("您的代理级别创建俱乐部数量超限");
                        }
                        else if (info.Roler == "5") {
                            self.showToast("俱乐部名字已存在");
                        }
                        else {
                            self.showToast("创建失败");
                        }
                        break;
                    case 9:
                        if (info.Roler == "1") {
                            self.showToast("请求成功等待管理员审核");
                            self.closeJuleJoinClick();

                        }
                        else if (info.Roler == "0") {
                            self.showToast("俱乐部不存在");
                        }
                        else if (info.Roler == "2") {
                            self.showToast("已经申请过等待管理员审核");
                        }
                        else {
                            self.showToast("加入失败");
                        }
                        break;
                    case 10:
                        if(info.Roler=="1")
                        {
                            self.showToast("操作成功");
                            cc.socket.sendMessage(12,{ClubID:cc.temp.ClubID});
                        }
                        else if (info.Roler == "2") {
                            self.showToast("已经申请过等待管理员审核");
                        }
                        else
                        {
                            self.showToast("操作失败");
                        }

                        break;
                    case 11:
                        var jiluNode = cc.find("Canvas/chengyuanDialogNode/dialog/scroll/view/content/list");
                        jiluNode.removeAllChildren();
                        var height = 0;
                        for (var i = 0; i < info.Data.length; i++) {
                            (
                                function (k) {
                                    var pre = cc.instantiate(self.chengyuanPre);
                                    height = (pre.scaleX * pre.height);
                                    pre.getChildByName("name").getComponent(cc.Label).string = info.Data[k].NickName + "";
                                    pre.getChildByName("num").getComponent(cc.Label).string = (k + 1) + "";
                                    pre.info = info.Data[k];
                                    if (info.Data[i].Photo.length > 0) {
                                        cc.loader.load({ url: info.Data[k].Photo, type: 'png' }, function (err, texture) {
                                            pre.getChildByName("head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                                        });
                                    }
                                    if (self.isDaili) {
                                        pre.getChildByName("removeButton").active = true;
                                        pre.getChildByName("removeButton").on('click', self.removeJulePersonClick, self);
                                    }
                                    /*
                                    for (var k = 0; k < 6; k++) {
                                        pre.getChildByName("room").getChildByName("person").getChildByName("person" + (k + 1)).active = false;
                                    }
                                    for (var k = 0; k < info.data[i].list.length; k++) {
                                        (
                                            function (q) {
                                                var perPre = pre.getChildByName("room").getChildByName("person").getChildByName("person" + (q + 1));
                                                perPre.active = true;
                                                perPre.getChildByName("name").getComponent(cc.Label).string = info.data[i].list[q].NickName;
                                                perPre.getChildByName("coin").getComponent(cc.Label).string = info.data[i].list[q].Points;
                                                cc.loader.load({ url: info.data[i].list[q].Photo, type: 'png' }, function (err, texture) {
                                                    perPre.getChildByName("head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                                                });
                                            }
                                        )(k);
                                    }*/
                                    jiluNode.addChild(pre);
                                    pre.setPosition(0, -k * height);
                                    //pre.on('click', self.weiguanClick, self);
                                }
                            )(i);
                        }
                        jiluNode.parent.height = info.Data.length * height;
                        break;
                    case 12:
                        var jiluNode = cc.find("Canvas/juleMsgDialogNode/dialog/scroll/view/content/list");
                        jiluNode.removeAllChildren();
                        var height = 0;
                        if(cc.find("Canvas/juleSetDialogNode/button/tip").getComponent(cc.Label).string == "解散俱乐部")
                        {
                            if(info.Data.length>0)
                            {
                                cc.find("Canvas/julebuDialogNode/dialog/hasmsg").active=true;
                                cc.find("Canvas/julebuDialogNode/dialog/nomsg").active=false;

                            }
                            else
                            {
                                cc.find("Canvas/julebuDialogNode/dialog/hasmsg").active=false;
                                cc.find("Canvas/julebuDialogNode/dialog/nomsg").active=true;
                            }


                        }
                        else
                        {
                            cc.find("Canvas/julebuDialogNode/dialog/hasmsg").active=false;
                            cc.find("Canvas/julebuDialogNode/dialog/nomsg").active=false;
                        }
                        for (var i = 0; i < info.Data.length; i++) {
                            (
                                function (k) {
                                    var pre = cc.instantiate(self.juleMsgPre);
                                    height = (pre.scaleX * pre.height);
                                    pre.getChildByName("name").getComponent(cc.Label).string = info.Data[k].NickName + "";
                                    pre.getChildByName("num").getComponent(cc.Label).string = (k + 1) + "";
                                    pre.info = info.Data[k];

                                    if (info.Data[i].Photo.length > 0) {
                                        cc.loader.load({ url: info.Data[k].Photo, type: 'png' }, function (err, texture) {
                                            pre.getChildByName("head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                                        });
                                    }
                                    pre.getChildByName("confirmButton").on('click', self.setIsJoinJuleClick, self);
                                    pre.getChildByName("refuseButton").on('click', self.setIsJoinJuleClick, self);
                                    /*
                                    for (var k = 0; k < 6; k++) {
                                        pre.getChildByName("room").getChildByName("person").getChildByName("person" + (k + 1)).active = false;
                                    }
                                    for (var k = 0; k < info.data[i].list.length; k++) {
                                        (
                                            function (q) {
                                                var perPre = pre.getChildByName("room").getChildByName("person").getChildByName("person" + (q + 1));
                                                perPre.active = true;
                                                perPre.getChildByName("name").getComponent(cc.Label).string = info.data[i].list[q].NickName;
                                                perPre.getChildByName("coin").getComponent(cc.Label).string = info.data[i].list[q].Points;
                                                cc.loader.load({ url: info.data[i].list[q].Photo, type: 'png' }, function (err, texture) {
                                                    perPre.getChildByName("head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                                                });
                                            }
                                        )(k);
                                    }*/
                                    jiluNode.addChild(pre);
                                    pre.setPosition(0, -k * height);
                                    //pre.on('click', self.weiguanClick, self);
                                }
                            )(i);
                        }
                        jiluNode.parent.height = info.Data.length * height;
                        break;
                    case 13:
                        if (info.Roler == "1") {
                            self.showToast("退出成功");
                            cc.socket.sendMessage(6, {});

                        }
                        else {
                            self.showToast("退出失败");
                        }
                        self.juleSetClose();



                        break;
                    case 14:
                        if (info.Roler == "1") {
                            self.showToast("解散成功");
                            cc.socket.sendMessage(6, {});

                        }
                        else {
                            self.showToast("解散失败");
                        }
                        self.juleSetClose();

                        break;
                    case 15:
                        if (info.Roler == "1") {
                            self.showToast("移除成功");
                            cc.socket.sendMessage(11, { ClubID: cc.temp.ClubID });

                        }
                        else {
                            self.showToast("移除失败");
                        }


                        break;
                    case 19:
                        for (var i = 0; i < info.data.length; i++) {
                            var item = cc.find("Canvas/rewardDialogNode/dialog/item" + (i + 1));
                            item.getChildByName("title").getComponent(cc.Label).string = info.data[i].Title;
                            item.getChildByName("content").getComponent(cc.Label).string = info.data[i].Info;

                            item.info = info.data[i];
                            if (info.data[i].IsGet == "1") {
                                item.getChildByName("get").active = false;
                                item.getChildByName("getok").active = true;
                            }
                            else {
                                item.getChildByName("getok").active = false;
                                item.getChildByName("get").active = true;
                            }
                        }
                        break;
                    case 20:
                        if (info.Type == "0") {
                            self.showToast("已到账请查收");
                        }
                        if (info.Type == "1") {
                            self.showToast("请联系客服兑奖");
                        }
                        if (info.Type == "2") {
                            self.showToast("请联系客服兑奖");
                        }
                        break;
                    case 21:
                        self.showToast("发送成功");
                        self.dialogClose("null", "fankui");
                        break;
                    case 23:
                        if (info.Roler == "1") {
                            self.showToast("赠送成功");
                            cc.socket.sendMessage(0, {});

                        }
                        else if (info.Roler == "3") {
                            self.showToast("赠送对象被禁用");
                        }
                        else if (info.Roler == "5") {
                            self.showToast("您的房卡不足");
                        }
                        else if (info.Roler == "4") {
                            self.showToast("会员数据丢失");
                        }
                        else if (info.Roler == "2") {
                            self.showToast("赠送对象不存在");
                        }
                        else {
                            self.showToast("赠送失败");
                        }
                        break;
                    case 24:
                        var personNode = cc.find("Canvas/personDialogNode/dialog")
                        personNode.getChildByName("ip").getComponent(cc.Label).string = info.IP;
                        personNode.getChildByName("address").getComponent(cc.Label).string = info.add;
                        break;

                }
            }
        };
        cc.socket.onerror = function (evt) {
            cc.log("connect error");

        };
    },
    lingquButtonCLick: function (e, msg) {
        var n = e.target.parent;
        var self = this;
        if (n.info.IsGet == "1" && n.info.Get == "0") {
            cc.socket.sendMessage(20, { Type: n.info.Type });
        }
        else {
            if (n.info.Get == "1") {
                self.showToast("不能重复领取");
            }
            if (n.info.IsGet == "0") {
                self.showToast("未完成任务");
            }

        }

    },
    juleItemClick: function (e) {
        var n = e.detail.node;
        cc.socket.sendMessage(7, { ClubID: n.info.ClubID });
        cc.temp.ClubID = n.info.ClubID;
        cc.find("Canvas/julebuDialogNode/dialog/juleName").getComponent(cc.Label).string = "俱乐部:" + n.info.ClubName;
        cc.find("Canvas/julebuDialogNode/dialog/juleId").getComponent(cc.Label).string = "俱乐部ID:" + n.info.ClubID;

    },
    removeJulePersonClick: function (e) {
        var n = e.detail.node.parent;
        if (cc.temp.ClubID) {
            cc.socket.sendMessage(15, { ClubID: cc.temp.ClubID, ObjID: n.info.UserID });
        }
        else {
            this.showToast("移除失败");
        }

    },
    setIsJoinJuleClick: function (e) {
        var n = e.detail.node.parent;
        if (cc.temp.ClubID) {
            
            if(e.detail.node.getChildByName("tip").getComponent(cc.Label).string=="同意")
            {
                cc.socket.sendMessage(10, { ClubID: cc.temp.ClubID, ObjID: n.info.UserID ,Result:"1"});
            }
            else
            {
                cc.socket.sendMessage(10, { ClubID: cc.temp.ClubID, ObjID: n.info.UserID ,Result:"0"});
            }
        }
        else {
            this.showToast("操作失败");
        }

    },
    juleRoomItemClick: function (e) {
        var n = e.detail.node;
        cc.log(n.info);
        cc.socket.sendMessage(2, {
            RoomID: n.info.RoomID
        });
        //cc.socket.sendMessage(7, { ClubID: n.info.ClubID });
        //cc.temp.ClubID = n.info.ClubID;

    },
    createRoomClick: function () {
        cc.find("Canvas/mask").pauseSystemEvents(true);
        cc.find("Canvas/createDialogNode").active = true;
        // this.net.checkHasRoom(this.net.userid);
    },
    createDialogClick: function () {

        cc.socket.sendMessage(1, cc.creDialogInfo);
    },
    juleCreateDialogClick: function () {
        cc.socket.sendMessage(1, cc.juleCreDialogInfo);
    },
    dnCreaDialogShow: function () {
        cc.find("Canvas/chooseDialogNode").active = false;
        cc.find("Canvas/mask").pauseSystemEvents(true);
        cc.find("Canvas/createDnDialogNode").active = true;
        cc.find("Canvas/createDnDialogNode").getComponent(cc.Animation).play("dialogSee");
    },
    zjhCreaDialogShow: function () {
        cc.find("Canvas/chooseDialogNode").active = false;
        cc.find("Canvas/mask").pauseSystemEvents(true);
        cc.find("Canvas/createDialogNode").active = true;
        cc.find("Canvas/createDialogNode").getComponent(cc.Animation).play("dialogSee");
    },
    createDnDialogClick: function () {

        this.net.createDnNetRoom(this.creDnDialogInfo);
    },
    gameChooseClick: function (e, msg) {
        if (msg == "jinsanshun") {

        }

        if (msg == "pingshi") {
            this.showToast("敬请期待");
        }

        if (msg == "add") {

        }
    },
    zhanjiButtonCLick: function () {
        cc.find("Canvas/mask").pauseSystemEvents(true);
        cc.find("Canvas/zhanjiDialogNode").active = true;
        cc.socket.sendMessage(3, {});
    },
    yqmButtonClick: function () {
        this.net.checkYqm(this.net.userid);
    },
    jButtonClick: function () {

        cc.find("Canvas/mask").pauseSystemEvents(true);
        cc.find("Canvas/joinDialogNode").active = true;
        //this.net.checkHasRoom(this.net.userid);
    },
    shareButtonClick: function () {
        // window.location.href="http://wap.ycluck.top/SendTo.html?state=0";
        cc.find("Canvas/mask").pauseSystemEvents(true);
        cc.find("Canvas/shareDialogNode").active = true;
    },
    settingButtonClick: function () {
        cc.find("Canvas/mask").pauseSystemEvents(true);
        var node = cc.find("Canvas/settingDialogNode");
        node.active = true;
    },

    sendCardButtonClick: function () {
        var num = cc.find("Canvas/sendDialogNode/dialog/num").getComponent(cc.EditBox).string;
        var id = cc.find("Canvas/sendDialogNode/dialog/id").getComponent(cc.EditBox).string;
        if (num.length <= 0) {
            this.showToast("请输入赠送数量");
            return;
        }
        if (id.length <= 0) {
            this.showToast("请输入赠送ID");
            return;
        }
        cc.socket.sendMessage(23, { ObjID: id, Num: num });
    },
    sendButtonClick: function () {
        cc.find("Canvas/mask").pauseSystemEvents(true);
        cc.find("Canvas/sendDialogNode").active = true;

    },
    menuClick: function (e, msg) {
        if (msg == "myHuiyuan") {
            cc.find("Canvas/mask/woNode/menuNode").active = false;
            cc.find("Canvas/mask/woNode/huiyuanListNode").active = true;
            this.net.getHuiyuanList(this.net.userid);
        }
        if (msg == "recharge") {
            cc.find("Canvas/mask/woNode/menuNode/oneLevelNode").active = false;
            cc.find("Canvas/mask/woNode/menuNode/oneRolerLevelNode").active = false;
            cc.find("Canvas/mask/woNode/menuNode/rechargeLevelNode").active = true;

        }
        if (msg == "dailiCoin") {
            cc.find("Canvas/mask").pauseSystemEvents(true);
            cc.find("Canvas/dailiCoinDialogNode").active = true;
            cc.find("Canvas/dailiCoinDialogNode").getComponent(cc.Animation).play("dialogSee");
            this.net.getDailiCoinList(this.net.userid);
        }
        if (msg == "vipCoin") {
            cc.find("Canvas/mask").pauseSystemEvents(true);
            cc.find("Canvas/vipCoinDialogNode").active = true;
            cc.find("Canvas/vipCoinDialogNode").getComponent(cc.Animation).play("dialogSee");
            this.net.getVipCoinList(this.net.userid);
        }
        if (msg == "setting") {
            var str = cc.find("Canvas/mask/woNode/menuNode/oneLevelNode/settingCenter/yaoqingmaLabel").getComponent(cc.Label).string + "";

            if (str.length > 0) {

            }
            else {
                cc.find("Canvas/mask").pauseSystemEvents(true);
                cc.find("Canvas/yaoqingmaDialogNode").active = true;
            }

        }
        if (msg == "about") {
            this.aboutButtonClick();
        }
        if (msg == "zuanshi") {

        }
        if (msg == "fangka") {
            cc.find("Canvas/mask").pauseSystemEvents(true);
            cc.find("Canvas/fangkaRechargeDialogNode").active = true;
            cc.find("Canvas/fangkaRechargeDialogNode").getComponent(cc.Animation).play("dialogSee");
        }

    },
    dialogClose: function (e, msg) {
        if (msg == "juleCreate") {
            cc.find("Canvas/" + msg + "DialogNode").active = false;
            cc.find("Canvas/julebuDialogNode").resumeSystemEvents(true);
        }
        else {
            cc.find("Canvas/mask").resumeSystemEvents(true);
            cc.find("Canvas/" + msg + "DialogNode").active = false;
        }
    },
    backButton: function (e, msg) {
        cc.find("Canvas/mask/woNode/menuNode").active = true;
        cc.find("Canvas/mask/woNode/menuNode/oneLevelNode").active = false;
        cc.find("Canvas/mask/woNode/menuNode/oneRolerLevelNode").active = false;
        cc.find("Canvas/mask/woNode/menuNode/rechargeLevelNode").active = false;
        cc.find("Canvas/mask/woNode/huiyuanListNode").active = false;
        this.net.getPersonInfo(this.net.userid);
    },
    dialogCreateClick: function () {
        this.net.createNetRoom(this.creDialogInfo);


    },
    dialogToClick: function (e, msg) {
        if (cc.find("Canvas/createDialogNode").active) {

            var info = msg.split(":");
            var head = info[0];
            cc.log(head);
            if (head == "JoinType" || head == "Card235") {
                cc.log("head " + cc.creDialogInfo[head]);
                cc.creDialogInfo[head] = Math.abs(parseInt(cc.creDialogInfo[head] + "") - 1);
            }
            else if (head == "OpenState") {
                cc.creDialogInfo[head] = parseInt(info[1]);
                if (info[1] == "2") {
                    cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle1/New Label").getComponent(cc.Label).string = "x2";
                    cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle2/New Label").getComponent(cc.Label).string = "x2";
                    cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle3/New Label").getComponent(cc.Label).string = "x6";
                    cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle4/New Label").getComponent(cc.Label).string = "x8";

                }
                else {
                    cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle1/New Label").getComponent(cc.Label).string = "x1";
                    cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle2/New Label").getComponent(cc.Label).string = "x1";
                    cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle3/New Label").getComponent(cc.Label).string = "x3";
                    cc.find("Canvas/createDialogNode/dialog/bottom/" + cc.createState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle4/New Label").getComponent(cc.Label).string = "x4";
                }

            }
            else {
                cc.creDialogInfo[head] = parseInt(info[1]);
            }
            cc.log(JSON.stringify(cc.creDialogInfo));
        }
        else {
            var info = msg.split(":");
            var head = info[0];
            cc.log(head);
            if (head == "JoinType" || head == "Card235") {
                cc.log("head " + cc.juleCreDialogInfo[head]);
                cc.juleCreDialogInfo[head] = Math.abs(parseInt(cc.juleCreDialogInfo[head] + "") - 1);
            }
            else if (head == "OpenState") {
                cc.juleCreDialogInfo[head] = parseInt(info[1]);
                if (info[1] == "2") {
                    cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createJuleState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle1/New Label").getComponent(cc.Label).string = "x2";
                    cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createJuleState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle2/New Label").getComponent(cc.Label).string = "x2";
                    cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createJuleState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle3/New Label").getComponent(cc.Label).string = "x6";
                    cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createJuleState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle4/New Label").getComponent(cc.Label).string = "x8";

                }
                else {
                    cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createJuleState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle1/New Label").getComponent(cc.Label).string = "x1";
                    cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createJuleState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle2/New Label").getComponent(cc.Label).string = "x1";
                    cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createJuleState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle3/New Label").getComponent(cc.Label).string = "x3";
                    cc.find("Canvas/juleCreateDialogNode/dialog/bottom/" + cc.createJuleState + "/on/scroll/view/content/Panel/gameNumTip/gameNumTo/toggle4/New Label").getComponent(cc.Label).string = "x4";
                }

            }
            else {
                cc.juleCreDialogInfo[head] = parseInt(info[1]);
            }
            cc.log(JSON.stringify(cc.juleCreDialogInfo));
        }
    },
    dialogDnToClick: function (e, msg) {
        var info = msg.split(":");
        var head = info[0];
        this.creDnDialogInfo[head] = parseInt(info[1]);
    },

    netCallBack: function (e, info, p) {
        if (e == "err") {
            p.showToast(info);
        }
        else {
            if (e == "createroom") {
                Global.roomNum = info.RoomNum;
                Global.userid = p.net.userid;
                p.audioControl.stopBGM();
                if (info.RoomType == "0") {
                    p.loadGame("liangzhangGameScene");
                }
                if (info.RoomType == "1") {
                    p.loadGame("sizhangGameScene");
                }
                if (info.RoomType == "2") {
                    p.loadGame("jiaguoGameScene");
                }

            }
            if (e == "zhanji") {
                if (info.data.length > 0) {
                    cc.find("Canvas/zhanjiDialogNode/tip").active = false;
                    // var zhanjiNode=cc.find("Canvas/zhanjiDialogNode/topNode/jifenLabel");
                    //  zhanjiNode.getComponent(cc.Label).string=info.Info+"";
                    var jiluNode = cc.find("Canvas/zhanjiDialogNode/jiluNode/scroll/view/content/list");
                    jiluNode.removeAllChildren();
                    var height = 0;
                    for (var i = 0; i < info.data.length; i++) {
                        var pre = cc.instantiate(p.zhanjiPre);
                        height = (pre.scaleX * pre.height + 10);
                        pre.getChildByName("roomLabel").getComponent(cc.Label).string = "房间号:" + info.data[i].RoomID + "";
                        pre.getChildByName("score").getComponent(cc.Label).string = info.data[i].Point + "";
                        pre.getChildByName("timeLabel").getComponent(cc.Label).string = "时间:" + info.data[i].Date + "";
                        /*
                        for (var k = 0; k < 6; k++) {
                            pre.getChildByName("room").getChildByName("person").getChildByName("person" + (k + 1)).active = false;
                        }
                        for (var k = 0; k < info.data[i].list.length; k++) {
                            (
                                function (q) {
                                    var perPre = pre.getChildByName("room").getChildByName("person").getChildByName("person" + (q + 1));
                                    perPre.active = true;
                                    perPre.getChildByName("name").getComponent(cc.Label).string = info.data[i].list[q].NickName;
                                    perPre.getChildByName("coin").getComponent(cc.Label).string = info.data[i].list[q].Points;
                                    cc.loader.load({ url: info.data[i].list[q].Photo, type: 'png' }, function (err, texture) {
                                        perPre.getChildByName("head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                                    });
                                }
                            )(k);
                        }*/
                        jiluNode.addChild(pre);
                        pre.setPosition(0, -i * height);
                    }
                    jiluNode.parent.height = info.data.length * height;
                }
                else {
                    cc.find("Canvas/zhanjiDialogNode/tip").active = true;
                }
            }
            if (e == "userinfo") {
                var meNode = cc.find("Canvas/mask/woNode/meInfoNode");
                var setNode = cc.find("Canvas/settingDialogNode/dialog");
                var personNode = cc.find("Canvas/personDialogNode/dialog")
                meNode.getChildByName("name").getComponent(cc.Label).string = info.NickName;
                setNode.getChildByName("name").getComponent(cc.Label).string = info.NickName;
                // setNode.getChildByName("ip").getComponent(cc.Label).string = info.IP;
                // setNode.getChildByName("address").getComponent(cc.Label).string = info.Address;
                personNode.getChildByName("name").getComponent(cc.Label).string = info.NickName;
                //  personNode.getChildByName("ip").getComponent(cc.Label).string = info.IP;
                // personNode.getChildByName("address").getComponent(cc.Label).string = info.Address;
                meNode.getChildByName("roomCardNode").getChildByName("cardNumLabel").getComponent(cc.Label).string = info.CardNum + "";
                meNode.getChildByName("idNode").getChildByName("cardNumLabel").getComponent(cc.Label).string = p.net.userid + "";
                setNode.getChildByName("idNode").getChildByName("cardNumLabel").getComponent(cc.Label).string = p.net.userid + "";
                personNode.getChildByName("idNode").getChildByName("cardNumLabel").getComponent(cc.Label).string = p.net.userid + "";
                cc.loader.load({ url: info.Photo, type: 'png' }, function (err, texture) {
                    meNode.getChildByName("head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                    setNode.getChildByName("head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                    personNode.getChildByName("head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                });
            }
            if (e == "huiyuanlist") {

                if (info.Data.length > 0) {
                    cc.find("Canvas/mask/woNode/huiyuanListNode/tip").active = false;
                    var jiluNode = cc.find("Canvas/mask/woNode/huiyuanListNode/huiyuanNode/scroll/view/content/list");
                    jiluNode.removeAllChildren();
                    var height = 0;
                    for (var i = 0; i < info.Data.length; i++) {
                        var pre = cc.instantiate(p.huiyuanItemPre);
                        height = pre.height;
                        pre.userid = "" + info.Data[i].UserID;
                        cc.log(info.Data[i].State);
                        if (info.Data[i].State == 0) {
                            pre.getChildByName("settingButton").state = "setting";

                            pre.getChildByName("settingButton").getChildByName("tip").getComponent(cc.Label).string = "设置VIP";
                        }
                        else {
                            pre.getChildByName("settingButton").state = "cancel";
                            pre.getChildByName("settingButton").getChildByName("tip").getComponent(cc.Label).string = "取消VIP";
                        }

                        pre.getChildByName("settingButton").on('click', p.settingButtonClick, p);
                        pre.getChildByName("sendButton").on('click', p.sendButtonClick, p);
                        pre.getChildByName("nameLabel").getComponent(cc.Label).string = info.Data[i].NickName + "";
                        jiluNode.addChild(pre);
                        pre.setPosition(0, -i * height);
                        cc.loader.load({ url: info.Data[i].Photo, type: 'png' }, function (err, texture) {
                            pre.getChildByName("head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                        });
                    }
                    jiluNode.parent.height = info.Data.length * height;
                }
                else {
                    cc.find("Canvas/mask/woNode/huiyuanListNode/tip").active = true;
                }
            }
            if (e == "vipcoinlist") {
                cc.log(info.Data.length);
                if (info.Data.length > 0) {
                    cc.find("Canvas/vipCoinDialogNode/dialog/tip").active = false;
                    cc.find("Canvas/vipCoinDialogNode/dialog/currJiesuan/coinLabel").getComponent(cc.Label).string = info.Info;
                    var jiluNode = cc.find("Canvas/vipCoinDialogNode/dialog/jiluNode/scroll/view/content/list");
                    jiluNode.removeAllChildren();
                    var height = 0;
                    if (info.Data.length > 30) {
                        info.Data.length = 30;
                    }
                    for (var i = 0; i < info.Data.length; i++) {
                        var pre = cc.instantiate(p.vipItemPre);
                        height = pre.height;
                        pre.getChildByName("nameLabel").getComponent(cc.Label).string = info.Data[i].NickName + "";
                        pre.getChildByName("roomNode").getChildByName("roomLabel").getComponent(cc.Label).string = info.Data[i].RoomNum + "";
                        pre.getChildByName("jushuNode").getChildByName("jushuLabel").getComponent(cc.Label).string = info.Data[i].Screenings + "";
                        pre.getChildByName("jifenNode").getChildByName("jifenLabel").getComponent(cc.Label).string = info.Data[i].Point + "";
                        pre.getChildByName("biliNode").getChildByName("biliLabel").getComponent(cc.Label).string = info.Data[i].GuaMoney + "";
                        pre.getChildByName("yingjiesuanNode").getChildByName("coinLabel").getComponent(cc.Label).string = info.Data[i].Money + "";

                        jiluNode.addChild(pre);
                        pre.setPosition(0, -i * height);
                        cc.loader.load({ url: info.Data[i].Photo, type: 'png' }, function (err, texture) {
                            pre.getChildByName("head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                        });
                    }
                    jiluNode.parent.height = info.Data.length * height;
                }
                else {
                    cc.find("Canvas/vipCoinDialogNode/dialog/tip").active = true;
                }
            }
            if (e == "dailicoinlist") {
                if (info.Data.length > 0) {
                    cc.find("Canvas/dailiCoinDialogNode/dialog/tip").active = false;
                    cc.find("Canvas/dailiCoinDialogNode/dialog/noGainCoin/coinLabel").getComponent(cc.Label).string = info.Info;
                    cc.find("Canvas/dailiCoinDialogNode/dialog/hejiNode/hejiLabel").getComponent(cc.Label).string = info.Info;
                    var jiluNode = cc.find("Canvas/dailiCoinDialogNode/dialog/jiluNode/scroll/view/content/list");
                    jiluNode.removeAllChildren();
                    var height = 0;
                    if (info.Data.length > 30) {
                        info.Data.length = 30;
                    }
                    for (var i = 0; i < info.Data.length; i++) {
                        var pre = cc.instantiate(p.dailiItemPre);
                        height = pre.height + 10;
                        pre.getComponent(cc.Label).string = info.Data[i].CreateTime + "";
                        pre.getChildByName("coinLabel").getComponent(cc.Label).string = info.Data[i].UserMoney + "";
                        jiluNode.addChild(pre);
                        pre.setPosition(0, -i * height);
                    }
                    jiluNode.parent.height = info.Data.length * height;
                }
                else {
                    cc.find("Canvas/dailiDialogNode/dialog/tip").active = true;
                }
            }
            if (e == "yqm") {
                if (info.state == "0") {
                    p.showToast("数据丢失");
                }
                else if (info.state == "1") {
                    cc.find("Canvas/yaoqingmaDialogNode").active = true;
                    cc.find("Canvas/mask").pauseSystemEvents(true);
                }
                else {
                    p.showToast("你的邀请码是" + info.state);
                }

            }
            if (e == "bdyaoqingma") {
                p.showToast("绑定成功");
            }
            if (e == "setvip") {
                if (info.state == 0) {
                    p.showToast("设置失败");
                }
                else {
                    p.showToast("设置成功");
                    p.net.getHuiyuanList(p.net.userid);
                }
            }
            if (e == "cancelvip") {
                if (info.state == 0) {
                    p.showToast("取消失败");
                }
                else {
                    p.showToast("取消成功");
                    p.net.getHuiyuanList(p.net.userid);
                }
            }
            if (e == "sendcard") {
                if (info.state == 0) {
                    p.showToast("赠送失败");
                }
                if (info.state == 1) {
                    i
                    p.showToast("赠送成功");
                    p.net.getPersonInfo(p.net.userid);
                    p.dialogClose("", "send");
                }
                if (info.state == 3) {
                    i
                    p.showToast("赠送失败");
                }
                if (info.state == 2) {
                    i
                    p.showToast("房卡不足");

                }
            }
            if (e == "inform") {
                p.dialogClose("", "create");
                //window.location.href="http://game.ycluck.top/game/?userid="+p.net.userid+"&roomNum="+info;
                Global.userid = p.net.userid;
                Global.roomNum = info;
                p.audioControl.stopBGM();
                p.loadGame();
            }
            if (e == "login") {
                p.creDialogInfo = {
                    OpenCard: 0,
                    userid: parseInt(p.net.userid),
                    Hang: 2,
                    StuffyNum: 1,
                    BottomLimit: 10,
                    ThecardNum: 1,
                    GameNum: 10
                };
                p.creDnDialogInfo = {
                    OpenCard: 0,
                    userid: parseInt(this.net.userid),
                    RoomType: 0,
                    Screenings: 10,
                    BottomLimit: 1,
                    ThecardNum: 0,
                    PeopleNum: 6,
                    CardRoler: 0,
                    isJoin: 1
                };
                p.net.getPersonInfo(p.net.userid);
            }
            if (e == "joinroom") {
                Global.roomNum = info.RoomNum;
                Global.userid = info.UserID;
                p.audioControl.stopBGM();
                if (info.RoomType == "0") {
                    p.loadGame("liangzhangGameScene");
                }
                if (info.RoomType == "1") {
                    p.loadGame("sizhangGameScene");
                }
                if (info.RoomType == "2") {
                    p.loadGame("jiaguoGameScene");
                }
            }
            if (e == "joineroom") {
                p.showToast("正在跳转到已经加入的房间" + info.roomNum);
                setTimeout(function () {
                    Global.roomNum = info.RoomNum;
                    Global.userid = p.net.userid;
                    p.audioControl.stopBGM();
                    if (info.RoomType == "0") {
                        p.loadGame("liangzhangGameScene");
                    }
                    if (info.RoomType == "1") {
                        p.loadGame("sizhangGameScene");
                    }
                    if (info.RoomType == "2") {
                        p.loadGame("jiaguoGameScene");
                    }
                }, 2000);
            }
            if (e == "joindneroom") {
                p.showToast("正在跳转到已经加入的房间" + info.roomNum);
                setTimeout(function () {
                    Global.roomNum = info.roomNum;
                    Global.userid = info.userid;
                    p.creDnDialogInfo.PeopleNum = parseInt(info.PeopleNum);
                    p.creDnDialogInfo.isJoin = 1;
                    Global.dnRoomInfo = p.creDnDialogInfo;
                    p.audioControl.stopBGM();
                    p.loadDnGame();
                }, 2000);
            }
            if (e == "creatednroom") {
                Global.roomNum = info.RoomID;
                Global.userid = p.net.userid;
                p.creDnDialogInfo.isJoin = 0;
                Global.dnRoomInfo = p.creDnDialogInfo;
                p.audioControl.stopBGM();
                p.loadDnGame();
            }
            if (e == "joindnroom") {
                Global.roomNum = info.roomNum;
                Global.userid = info.userid;
                p.creDnDialogInfo.PeopleNum = parseInt(info.PeopleNum);
                p.creDnDialogInfo.isJoin = 1;
                Global.dnRoomInfo = p.creDnDialogInfo;
                p.audioControl.stopBGM();
                p.loadDnGame(); q
            }
            if (e == "noJoinedRoom") {
                cc.log("no joinroom");
            }
            if (e == "nonoJoinedRoom") {
                cc.find("Canvas/mask").pauseSystemEvents(true);
                cc.find("Canvas/joinDialogNode").active = true;
                cc.find("Canvas/joinDialogNode").getComponent(cc.Animation).play("dialogSee");
            }
            if (e == "notice") {

                cc.find("Canvas/mask/centerNode/topNode/noticeNode/noticeBack/mask/noticeLabel").getComponent("paomaLight").setData(info.Content);
                cc.find("Canvas/mask/centerNode/topNode/weixinLabel").getComponent(cc.Label).string = (info.LineUser);
                cc.find("Canvas/mask/centerNode/topNode/gonggaoLabel").getComponent(cc.Label).string = (info.Info);
                if (info.Msg.length > 0) {
                    cc.find("Canvas/mask/centerNode/topNode/nonoticeButton").active = false;
                    cc.find("Canvas/mask/centerNode/topNode/hasnoticeButton").active = true;
                }
                else {
                    cc.find("Canvas/mask/centerNode/topNode/nonoticeButton").active = true;
                    cc.find("Canvas/mask/centerNode/topNode/hasnoticeButton").active = false;

                }


            }
            if (e == "shangchenginfo") {
                for (var i = 0; i < info.data.length; i++) {
                    cc.find("Canvas/shangchengDialogNode/dialog/dou" + (i + 1) + "/price").getComponent(cc.Label).string = "$" + info.data[i].Price;
                    cc.find("Canvas/shangchengDialogNode/dialog/dou" + (i + 1) + "/douNum").getComponent(cc.Label).string = "" + info.data[i].DouNum;
                }
            }
            if (e == "payinfo") {
                if (info.data.length > 0) {
                    cc.find("Canvas/shangchengDialogNode").pauseSystemEvents(true);
                    cc.find("Canvas/buyInfoDialogNode/tip").active = false;
                    cc.find("Canvas/buyInfoDialogNode").active = true;
                    var jiluNode = cc.find("Canvas/buyInfoDialogNode/dialog/scroll/view/content/list");
                    jiluNode.removeAllChildren();
                    var height = 0;
                    for (var i = 0; i < info.data.length; i++) {
                        var pre = cc.instantiate(p.buyPre);
                        height = (pre.height + 10);
                        pre.getChildByName("num").getComponent(cc.Label).string = (i + 1) + "";
                        pre.getChildByName("time").getComponent(cc.Label).string = info.data[i].time + "";
                        pre.getChildByName("title").getComponent(cc.Label).string = info.data[i].title + "";
                        jiluNode.addChild(pre);
                        pre.setPosition(0, -i * height);
                    }
                    jiluNode.parent.height = info.data.length * height;
                }
                else {
                    cc.find("Canvas/shangchengDialogNode").pauseSystemEvents(true);
                    cc.find("Canvas/buyInfoDialogNode/tip").active = true;
                    cc.find("Canvas/buyInfoDialogNode").active = true;
                }

            }
            if (e == "pay") {
                /*
                
                cc.find("Canvas/mask").pauseSystemEvents(true);
                cc.find("Canvas/webDialogNode").active=true;
                cc.find("Canvas/webDialogNode/dialog/webview").getComponent(cc.WebView).url=info.url;
                */
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "openUrl", "(Ljava/lang/String;)V", info.url);
            }
        }
    },
    buyHisClose: function () {
        cc.find("Canvas/shangchengDialogNode").resumeSystemEvents(true);
        cc.find("Canvas/buyInfoDialogNode").active = false;
    },
    noticeButtonClick: function () {
        cc.socket.sendMessage("16", {});
        cc.find("Canvas/msgDialogNode").active = true;
        cc.find("Canvas/mask").pauseSystemEvents(true);
    },
    msgButtonClick: function () {
        cc.find("Canvas/msgDialogNode/dialog/scroll/view/content").getComponent(cc.Label).string = cc.temp.msgMsg;
    },
    gameDingzhiButtonClick: function () {
        cc.find("Canvas/msgDialogNode/dialog/scroll/view/content").getComponent(cc.Label).string = cc.temp.dingzhiMsg;
    },
    zhaomuButtonClick: function () {
        cc.find("Canvas/msgDialogNode/dialog/scroll/view/content").getComponent(cc.Label).string = cc.temp.zhaomuMsg;
    },
    loadGame: function (sce) {
        this.audioControl.stopBGM();
        var loadNode = cc.find("Canvas/loadNode");
        loadNode.active = true;
        loadNode.getChildByName("load").getComponent(cc.Animation).play("load");
        cc.director.loadScene(sce);
    },


    showAlert: function (msg) {
        cc.find("Canvas/toastNode").active = true;
        cc.find("Canvas/toastNode/label").getComponent(cc.Label).string = msg;
        cc.find("Canvas/toastNode/back").width = (msg.length + 2) * 40;
    },
    closeAlert: function () {
        cc.find("Canvas/toastNode").active = false;
    },
    showToast: function (msg) {
        cc.find("Canvas/toastNode").active = true;
        cc.find("Canvas/toastNode/label").getComponent(cc.Label).string = msg;
        cc.find("Canvas/toastNode/back").width = (msg.length + 2) * 40;
        setTimeout(function () {
            cc.find("Canvas/toastNode").active = false;
        }, 1500);
    },
    aboutButtonClick: function () {
        this.showAlert("客服QQ:644399996\n\n客服微信:chinahua227");
    },
    exitButtonCLick: function () {
        cc.director.end();
    },
    addButtonCLick: function () {
        this.showToast("请联系群主");
    },
    bdyaoqingmaButtonClick: function () {
        var code = cc.find("Canvas/yaoqingmaDialogNode/dialog/keyLabelNode").getComponent("keyLabelControl").getStr();
        if (code.length > 0) {
            this.net.bdYaoqingma(this.net.userid, code);
            cc.find("Canvas/yaoqingmaDialogNode").active = false;
            cc.find("Canvas/mask").resumeSystemEvents(true);
        }
        else {
            this.showToast("请输入邀请码");
        }
    },
    qiehuanButtonmClick: function () {
        this.audioControl.stopBGM();
        cc.sys.localStorage.setItem("userid", "");
        cc.director.loadScene("loginScene");

    },
    myInfoShow: function () {
        cc.find("Canvas/mask").pauseSystemEvents(true);
        cc.find("Canvas/personDialogNode").active = true;
        cc.socket.sendMessage(24, {});
    },
    helpButtonClick: function () {
        cc.find("Canvas/mask").pauseSystemEvents(true);
        cc.find("Canvas/helpDialogNode").active = true;
    },
    bottomButtonClick: function (e, msg) {
        this.createState = msg;

        if (msg == "sizhang") {
            this.creDialogInfo = this.cresizhangDialogInfo;
            this.creDialogInfo.RoomType = "1";
        }
        if (msg == "liangzhang") {
            this.creDialogInfo = this.creliangzhangDialogInfo;
            this.creDialogInfo.RoomType = "0";
        }
        if (msg == "jiaguo") {
            this.creDialogInfo = this.crejiaguoDialogInfo;
            this.creDialogInfo.RoomType = "2";
        }
        for (var i = 0; i < this.bottomList.length; i++) {
            if (this.bottomList[i].name == msg) {
                this.bottomList[i].getChildByName("on").active = true;
                this.bottomList[i].getChildByName("off").active = false;
            }
            else {
                this.bottomList[i].getChildByName("on").active = false;
                this.bottomList[i].getChildByName("off").active = true;
            }
        }

    },
    buyHisButtonClick: function () {
        this.net.getPayInfo(this.net.userid);
    },
    shangchengButtonClick: function () {
        cc.find("Canvas/mask").pauseSystemEvents(true);
        cc.find("Canvas/shangchengDialogNode").active = true;
        this.net.getShangchengInfo(this.net.userid);
    },
    weixinShare: function (e, msg) {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "shareWebPage", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", msg + "", "幸运赢三张", "最经典的赢三张的手游，超低流量，免费下载，完成牌局赢【现金红包】，点击开始吧！", "http://fir.im/luac");

    },
    buyCoinClick: function (e, msg) {
        var price = e.target.getChildByName("price").getComponent(cc.Label).string;
        this.dialogClose("null", "shangcheng");
        cc.find("Canvas/mask").pauseSystemEvents(true);
        cc.find("Canvas/payChooseDialogNode").active = true;
        cc.find("Canvas/payChooseDialogNode").price = price;
    },
    payChooseClick: function (e, msg) {
        this.dialogClose("null", "payChoose");
        this.net.getPayUrl(this.net.userid, msg, cc.find("Canvas/payChooseDialogNode").price.substring(1));

    },
    JuleAddButtonClick: function () {
        cc.find("Canvas/julebuDialogNode/dialog").pauseSystemEvents(true);
        cc.find("Canvas/julebuDialogNode/juleCreDialog").active = true;

    },
    myJuleButtonClick: function () {
        cc.find("Canvas/julebuDialogNode/dialog").pauseSystemEvents(true);
        cc.find("Canvas/julebuDialogNode/juleCreDialog").active = true;
    },
    juleAddClose: function () {
        cc.find("Canvas/julebuDialogNode/dialog").resumeSystemEvents(true);
        cc.find("Canvas/julebuDialogNode/juleCreDialog").active = false;

    },
    juleCreClick: function () {
        cc.find("Canvas/julebuDialogNode/juleCreDialog").active = false;
        cc.find("Canvas/julebuDialogNode/juleCreInfoDialog").active = true;

    },
    joinJuleClick: function () {

    },
    juleCreRoomClick: function () {
        if (cc.temp.ClubID) {
            cc.juleCreDialogInfo.ClubID = cc.temp.ClubID;
            cc.find("Canvas/julebuDialogNode").pauseSystemEvents(true);
            cc.find("Canvas/juleCreateDialogNode").active = true;
        }
        else {
            this.showToast("请选择俱乐部");
        }




    },
    juleRefreshRoomClick: function () {
        if (cc.temp.ClubID) {
            cc.socket.sendMessage(6, {});
            cc.socket.sendMessage(7, { ClubID: cc.temp.ClubID });
        }
        else {
            this.showToast("请选择俱乐部");
        }
    },
    juleJoinRoomlick: function () {

    },
    confirmCreJuleClick: function () {
        var str = cc.find("Canvas/julebuDialogNode/juleCreInfoDialog/edit").getComponent(cc.EditBox).string;
        if (str.length > 0) {
            cc.socket.sendMessage(8, { Name: str });

        }
        else {
            this.showToast("请输入俱乐部名字");
        }
    },
    closeJuleCreClick: function () {
        cc.find("Canvas/julebuDialogNode/dialog").resumeSystemEvents(true);
        cc.find("Canvas/julebuDialogNode/juleCreInfoDialog").active = false;

    },
    juleJoinClick: function () {
        this.juleAddClose();
        cc.find("Canvas/julebuDialogNode/dialog").pauseSystemEvents(true);
        cc.find("Canvas/julebuDialogNode/juleJoinInfoDialog").active = true
    },
    closeJuleJoinClick: function () {
        cc.find("Canvas/julebuDialogNode/dialog").resumeSystemEvents(true);
        cc.find("Canvas/julebuDialogNode/juleJoinInfoDialog").active = false;

    },
    confirmJoinJuleClick: function () {
        var str = cc.find("Canvas/julebuDialogNode/juleJoinInfoDialog/keyLabelNode").getComponent("keyLabelControl").getStr();
        if (str.length > 0) {
            cc.socket.sendMessage(9, { ClubID: str });

        }
        else {
            this.showToast("请输入俱乐部ID");
        }

    },
    rewardButtonClick: function () {
        cc.find("Canvas/mask").pauseSystemEvents(true);
        cc.find("Canvas/rewardDialogNode").active = true;
        cc.socket.sendMessage(19, {});
    },
    fankuiButtonClick: function () {
        cc.find("Canvas/mask").pauseSystemEvents(true);
        cc.find("Canvas/fankuiDialogNode").active = true;
    },
    fankuiConfirmButtonClick: function () {
        var str = cc.find("Canvas/fankuiDialogNode/dialog/edit").getComponent(cc.EditBox).string;
        if (str.length > 0) {
            cc.socket.sendMessage(21, { txt: str });

        }
        else {
            this.showToast("请输入反馈内容");
        }

    },
    moreButtonClick: function () {
        this.showToast("敬请期待");
    },
    screenShot: function () {
        //注意，EditBox，VideoPlayer，Webview 等控件无法被包含在截图里面
        //因为这是 OpenGL 的渲染到纹理的功能，上面提到的控件不是由引擎绘制的
        //如果待截图的场景中含有 mask，请使用下面注释的语句来创建 renderTexture
        var renderTexture = cc.RenderTexture.create(1280, 720, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
        //var renderTexture = cc.RenderTexture.create(1280, 640);

        //实际截屏的代码
        renderTexture.begin();
        //this.richText.node 是我们要截图的节点，如果要截整个屏幕，可以把 this.richText 换成 Canvas 切点即可
        cc.find("Canvas")._sgNode.visit();
        renderTexture.end();
        renderTexture.saveToFile("demo.png", cc.ImageFormat.PNG, true, function () {
            cc.log("capture screen successfully!");
        });
        //打印截图路径
        return jsb.fileUtils.getWritablePath() + "demo.png";

    },
    chengyuanClose: function () {

        cc.find("Canvas/julebuDialogNode/dialog").resumeSystemEvents(true);
        cc.find("Canvas/chengyuanDialogNode").active = false;
    },
    chengyuanButtonClick: function () {
        if (cc.temp.ClubID) {
            cc.socket.sendMessage(11, { ClubID: cc.temp.ClubID });

            cc.find("Canvas/julebuDialogNode/dialog").pauseSystemEvents(true);
            cc.find("Canvas/chengyuanDialogNode").active = true

        }
        else {
            this.showToast("请选择俱乐部");
        }
    },
    juleSetButtonClick: function () {
        cc.find("Canvas/julebuDialogNode/dialog").pauseSystemEvents(true);
        cc.find("Canvas/juleSetDialogNode").active = true
    },
    juleMsgButtonClick: function () {
        if (cc.temp.ClubID) {
            cc.socket.sendMessage(12, { ClubID: cc.temp.ClubID });

            cc.find("Canvas/julebuDialogNode/dialog").pauseSystemEvents(true);
            cc.find("Canvas/juleMsgDialogNode").active = true

        }
        else {
            this.showToast("请选择俱乐部");
        }
    },
    juleMsgCloseClick: function () {
        cc.find("Canvas/julebuDialogNode/dialog").resumeSystemEvents(true);
        cc.find("Canvas/juleMsgDialogNode").active = false;
    },
    juleSetClick: function () {
        if (cc.temp.ClubID) {
            if (cc.find("Canvas/juleSetDialogNode/button/tip").getComponent(cc.Label).string == "解散俱乐部") {
                cc.socket.sendMessage(14, { ClubID: cc.temp.ClubID });

            }
            else {
                cc.socket.sendMessage(13, { ClubID: cc.temp.ClubID });
            }

        }
        else {
            this.showToast("请选择俱乐部");
        }
    },
    juleSetClose: function () {

        cc.find("Canvas/julebuDialogNode/dialog").resumeSystemEvents(true);
        cc.find("Canvas/juleSetDialogNode").active = false;
    },



    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

    },
});
