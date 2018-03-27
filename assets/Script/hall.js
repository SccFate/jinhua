cc.Class({
    extends: cc.Component,

    properties: {
		personZhanjiPre: {
		default:
			null,
			type: cc.Prefab,
		},
		
        zhanjiPre:
        {
            default:null,
            type:cc.Prefab
        },
        dnZhanjiPre:
        {
            default:null,
            type:cc.Prefab
        },
        huiyuanItemPre:
        {
            default:null,
            type:cc.Prefab
        },
        buyPre:
        {
            default:null,
            type:cc.Prefab
        },
        
        vipItemPre:
        {
            default:null,
            type:cc.Prefab
        },
        dailiItemPre:
        {
            default:null,
            type:cc.Prefab
        },
        bottomList:
        {
            default:[],
            type:cc.Node
        }
        
    },
    // use this for initialization
    onLoad: function () {
       // cc.view.setResolutionPolicy(cc.ResolutionPolicy.EXACT_FIT);
        this.audioControl = this.node.getChildByName("audioManager").getComponent("audioControl");
        this.net=cc.find("Canvas/netNode").getComponent("netControl");
        this.net.init(this.netCallBack,this);
        this.net.userid=Global.userid;
        this.createState="liangzhang";
        Global.roomNum=null;
        this.yqm="";
        var self=this;
        this.userInfo=null;
        this.creDialogInfo={
            
            UserID:parseInt(this.net.userid),
            GameNum:12,
            HangType:0,
            CardType:1,
            SpecialCard:"1",
            RoomType:0,
            RoadNum:1,
            MaxHang:10,
            JoinType:0,
            Hang:1,
            BankType:0
        };
        this.creliangzhangDialogInfo={
            
            UserID:parseInt(this.net.userid),
            GameNum:12,
            HangType:0,
            CardType:1,
            SpecialCard:"1",
            RoomType:0,
            RoadNum:1,
            MaxHang:10,
            JoinType:0,
            Hang:1,
            BankType:0
        };
        this.cresizhangDialogInfo={
            
            UserID:parseInt(this.net.userid),
            GameNum:12,
            HangType:0,
            CardType:1,
            SpecialCard:"1",
            RoomType:0,
            RoadNum:1,
            MaxHang:10,
            JoinType:0,
            Hang:1,
            BankType:0
        };
        this.crejiaguoDialogInfo={
            
            UserID:parseInt(this.net.userid),
            GameNum:12,
            HangType:0,
            CardType:1,
            SpecialCard:"1",
            RoomType:0,
            RoadNum:1,
            MaxHang:10,
            JoinType:0,
            Hang:20,
            BankType:0
        };
        
        
        
        
        var loadNode=cc.find("Canvas/loadNode");
        loadNode.active=false;
        this.net.getPersonInfo(this.net.userid);
        self.net.getNotice();
        this.schedule(function()
        {
            self.net.getNotice();
        },60);
        this.audioControl.init();
		this.audioControl.playBGM("bgplay");
    },
    joinRoomButtonClick:function()
    {
        var roomNum=cc.find("Canvas/joinDialogNode/dialog/keyLabelNode").getComponent("keyLabelControl").getStr();
        if(roomNum.length==6)
        {
            //window.location.href="http://game.ycluck.top/game/?userid="+this.net.userid+"&roomNum="+roomNum;
            this.net.JoinRoom(this.net.userid,roomNum);
        }
        else
        {
            this.showToast("请输入房间号码");
        }
        
        
        
    },
    
    createRoomClick:function()
    {
        cc.find("Canvas/mask").pauseSystemEvents(true);
        cc.find("Canvas/createDialogNode").active=true;
        this.net.checkHasRoom(this.net.userid);
    },
    createDialogClick:function()
    {
        
        this.net.createNetRoom(this.creDialogInfo);
    },
    dnCreaDialogShow:function()
    {
        cc.find("Canvas/chooseDialogNode").active=false;
        cc.find("Canvas/mask").pauseSystemEvents(true);
               cc.find("Canvas/createDnDialogNode").active=true;
               cc.find("Canvas/createDnDialogNode").getComponent(cc.Animation).play("dialogSee");
    },
    zjhCreaDialogShow:function()
    {
         cc.find("Canvas/chooseDialogNode").active=false;
        cc.find("Canvas/mask").pauseSystemEvents(true);
               cc.find("Canvas/createDialogNode").active=true;
               cc.find("Canvas/createDialogNode").getComponent(cc.Animation).play("dialogSee");
    },
    createDnDialogClick:function()
    {
        
        this.net.createDnNetRoom(this.creDnDialogInfo);
    },
    gameChooseClick:function(e,msg)
    {
       if(msg=="jinsanshun")
       {
           
       }
       
       if(msg=="pingshi")
       {
           this.showToast("敬请期待");
       }
       
       if(msg=="add")
       {
           
       }
    },
    zhanjiButtonCLick:function()
    {
        this.net.getPersonZhanji(this.net.userid);   
    },
    yqmButtonClick:function()
    {
        if(this.yqm.length>0)
        {
            this.showToast("你的邀请码是:"+this.yqm)
        }
        else
        {
            cc.find("Canvas/mask").pauseSystemEvents(true);
            cc.find("Canvas/yaoqingmaDialogNode").active=true;
        }
    },
    jButtonClick:function()
    {

        cc.find("Canvas/mask").pauseSystemEvents(true);
        cc.find("Canvas/joinDialogNode").active=true;
        this.net.checkHasRoom(this.net.userid);
    },
    /*
    bottomButtonClick:function(e,msg)
    {
       for(var i=0;i<this.bottomList.length;i++)
       {
           var bNode=cc.find("Canvas/mask/bottomNode/buttonList/"+this.bottomList[i]+"Button");
           var pNode=cc.find("Canvas/mask/"+this.bottomList[i]+"Node");
           if(this.bottomList[i]==msg)
           {
              bNode.getChildByName("lightImage").active=true;
              pNode.active=true;
              if(msg=="wo")
              {
              cc.find("Canvas/mask/woNode/menuNode").active=true;
              cc.find("Canvas/mask/woNode/menuNode/oneLevelNode").active=false;
              cc.find("Canvas/mask/woNode/menuNode/oneRolerLevelNode").active=false; 
              cc.find("Canvas/mask/woNode/menuNode/rechargeLevelNode").active=false;
              cc.find("Canvas/mask/woNode/huiyuanListNode").active=false;
              this.net.getPersonInfo(this.net.userid);
              this.net.getYaoqingma(this.net.userid);
              }
              if(msg=="zhanji")
              {
              this.net.getPersonZhanji(this.net.userid);   
                  
                  
              }
           }
           else
           {
               
              bNode.getChildByName("lightImage").active=false;  
              pNode.active=false;
           }
       }
    },
    */
    shareButtonClick:function()
    {
       // window.location.href="http://wap.ycluck.top/SendTo.html?state=0";
                cc.find("Canvas/mask").pauseSystemEvents(true);
                cc.find("Canvas/shareDialogNode").active=true;
    },
    settingButtonClick:function()
    {
         cc.find("Canvas/mask").pauseSystemEvents(true);
        var node=cc.find("Canvas/settingDialogNode");
        node.active=true;
    },

    sendCardButtonClick:function()
    {
        var num=cc.find("Canvas/sendDialogNode/dialog/numEdit").getComponent(cc.EditBox).string;
        if(num.length<=0)
        {
            this.showToast("请输入赠送数量");
        }
        else
        {
            this.net.sendCard(this.net.userid,cc.find("Canvas/sendDialogNode").userid,num);
            
        }
    },
    sendButtonClick:function(e)
    {
        var node=e.detail.node;
        var id=node.parent.userid;
        cc.find("Canvas/mask").pauseSystemEvents(true);
        cc.find("Canvas/sendDialogNode").userid=id;
        cc.find("Canvas/sendDialogNode").active=true;
        
    },
    menuClick:function(e,msg)
    {
        if(msg=="myHuiyuan")
        {
            cc.find("Canvas/mask/woNode/menuNode").active=false;
            cc.find("Canvas/mask/woNode/huiyuanListNode").active=true;
            this.net.getHuiyuanList(this.net.userid);
        }
        if(msg=="recharge")
        {
            cc.find("Canvas/mask/woNode/menuNode/oneLevelNode").active=false;
            cc.find("Canvas/mask/woNode/menuNode/oneRolerLevelNode").active=false; 
            cc.find("Canvas/mask/woNode/menuNode/rechargeLevelNode").active=true;
            
        }
        if(msg=="dailiCoin")
        {
            cc.find("Canvas/mask").pauseSystemEvents(true);
            cc.find("Canvas/dailiCoinDialogNode").active=true;
             cc.find("Canvas/dailiCoinDialogNode").getComponent(cc.Animation).play("dialogSee");
             this.net.getDailiCoinList(this.net.userid);
        }
        if(msg=="vipCoin")
        {
            cc.find("Canvas/mask").pauseSystemEvents(true);
            cc.find("Canvas/vipCoinDialogNode").active=true;
            cc.find("Canvas/vipCoinDialogNode").getComponent(cc.Animation).play("dialogSee");
            this.net.getVipCoinList(this.net.userid);
        }
        if(msg=="setting")
        {
             var str=cc.find("Canvas/mask/woNode/menuNode/oneLevelNode/settingCenter/yaoqingmaLabel").getComponent(cc.Label).string+"";
             
            if(str.length>0)
            {
                
            }
            else
            {
                cc.find("Canvas/mask").pauseSystemEvents(true);
                cc.find("Canvas/yaoqingmaDialogNode").active=true;
            }
            
        }
        if(msg=="about")
        {
            this.aboutButtonClick();
        }
        if(msg=="zuanshi")
        {
            
        }
        if(msg=="fangka")
        {
            cc.find("Canvas/mask").pauseSystemEvents(true);
            cc.find("Canvas/fangkaRechargeDialogNode").active=true;
            cc.find("Canvas/fangkaRechargeDialogNode").getComponent(cc.Animation).play("dialogSee");
        }
    
    },
    dialogClose:function(e,msg)
    {
         cc.find("Canvas/mask").resumeSystemEvents(true);
         cc.find("Canvas/"+msg+"DialogNode").active=false;
    },
    backButton:function(e,msg)
    {
        cc.find("Canvas/mask/woNode/menuNode").active=true;
        cc.find("Canvas/mask/woNode/menuNode/oneLevelNode").active=false;
        cc.find("Canvas/mask/woNode/menuNode/oneRolerLevelNode").active=false; 
        cc.find("Canvas/mask/woNode/menuNode/rechargeLevelNode").active=false;
        cc.find("Canvas/mask/woNode/huiyuanListNode").active=false;
        this.net.getPersonInfo(this.net.userid);
    },
    dialogCreateClick:function()
    {
        this.net.createNetRoom(this.creDialogInfo);
        
        
    },
    dialogToClick:function(e,msg)
    {
        var info=msg.split(":");
        var head=info[0];
        cc.log(head);
        if(head=="JoinType")
        {
            cc.log("join"+this.creDialogInfo[head]);
            this.creDialogInfo[head]=Math.abs(parseInt(this.creDialogInfo[head]+"")-1)+"";
        }
        else if(head=="SpecialCard")
        {
            var i=this.creDialogInfo[head].indexOf(info[1]);
            if(i>=0)
            {
                if(this.creDialogInfo[head].length==1)
                {
                    this.creDialogInfo[head]="";
                }
                else
                {
                    cc.log(i);
                    if(i+1<this.creDialogInfo[head].length)
                    {
                    this.creDialogInfo[head]=this.creDialogInfo[head].substring(i+1)+this.creDialogInfo[head].substring(0,i);
                    }
                    else
                    {
                    this.creDialogInfo[head]=this.creDialogInfo[head].substring(0,i)
                    }
                
                }
            }
            else
            {
                this.creDialogInfo[head]+=info[1];
            }
            
        }
        else if(head=="HangType")
            {
                this.creDialogInfo[head]=parseInt(info[1]);
                if(info[1]=="1")
                {
                    cc.find("Canvas/createDialogNode/dialog/bottom/"+this.createState+"/on/Panel/zidingyiNode").active=true;
                     cc.find("Canvas/createDialogNode/dialog/bottom/"+this.createState+"/on/Panel/gudingNode").active=false;
                    
                }
                else
                {
                    cc.find("Canvas/createDialogNode/dialog/bottom/"+this.createState+"/on/Panel/zidingyiNode").active=false;
                    cc.find("Canvas/createDialogNode/dialog/bottom/"+this.createState+"/on/Panel/gudingNode").active=true;
                }
                
            }
        else
        {
        this.creDialogInfo[head]=parseInt(info[1]);
        }
        cc.log(JSON.stringify(this.creDialogInfo));
    },
    dialogDnToClick:function(e,msg)
    {
        var info=msg.split(":");
        var head=info[0];
        this.creDnDialogInfo[head]=parseInt(info[1]);
    },
    
    netCallBack:function(e,info,p)
    {
        if(e=="err")
        {
            p.showAlert(info);
        }
        else
        {
            if(e=="createroom")
            {
                Global.roomNum=info.RoomNum;
                Global.userid=p.net.userid;
                p.audioControl.stopBGM();
                if(info.RoomType=="0")
                {
                p.loadGame("liangzhangGameScene");
                }
                if(info.RoomType=="1")
                {
                p.loadGame("sizhangGameScene");
                }
                if(info.RoomType=="2")
                {
                p.loadGame("jiaguoGameScene");
                }
                
            }
            if(e=="zhanji")
            {
                if(info.data.length>0)
                {
                cc.find("Canvas/zhanjiDialogNode/tip").active=false;
               // var zhanjiNode=cc.find("Canvas/zhanjiDialogNode/topNode/jifenLabel");
              //  zhanjiNode.getComponent(cc.Label).string=info.Info+"";
                cc.find("Canvas/mask").pauseSystemEvents(true);
                cc.find("Canvas/zhanjiDialogNode").active=true;
                var jiluNode=cc.find("Canvas/zhanjiDialogNode/jiluNode/scroll/view/content/list");
                jiluNode.removeAllChildren();
                var height=0;
                for(var i=0;i<info.data.length;i++)
                {
                    var pre=cc.instantiate(p.zhanjiPre);
                    height=(pre.scaleX*pre.height+10);
                    pre.getChildByName("roomLabel").getComponent(cc.Label).string="房间号:"+info.data[i].RoomNum+"";
                    pre.getChildByName("type").getComponent(cc.Label).string=info.data[i].info+"";
                    pre.getChildByName("timeLabel").getComponent(cc.Label).string="时间:"+info.data[i].Time+"";
                    for(var k=0;k<6;k++)
                    {
                        pre.getChildByName("room").getChildByName("person").getChildByName("person"+(k+1)).active=false;
                    }
                    for(var k=0;k<info.data[i].list.length;k++)
                    {
                        (
                        function(q)
                        {
                        var perPre=pre.getChildByName("room").getChildByName("person").getChildByName("person"+(q+1));
                        perPre.active=true;
                        perPre.getChildByName("name").getComponent(cc.Label).string=info.data[i].list[q].NickName;
                        perPre.getChildByName("coin").getComponent(cc.Label).string=info.data[i].list[q].Points;
                    cc.loader.load({url: info.data[i].list[q].Photo, type: 'png'}, function (err, texture) {
               	        perPre.getChildByName("head").getComponent(cc.Sprite).spriteFrame=new cc.SpriteFrame(texture);
                    });
                        }
                        )(k);
                    }
                    jiluNode.addChild(pre);
                    pre.setPosition(0,-i*height);
                }
                jiluNode.parent.height=info.data.length*height;
                }
                else
                {
                cc.find("Canvas/zhanjiDialogNode/tip").active=true;
                }
            }
            if(e=="userinfo")
            {
                var meNode=cc.find("Canvas/mask/woNode/meInfoNode");
                var setNode=cc.find("Canvas/settingDialogNode/dialog");
                var personNode=cc.find("Canvas/personDialogNode/dialog")
                meNode.getChildByName("name").getComponent(cc.Label).string=info.NickName;
                setNode.getChildByName("name").getComponent(cc.Label).string=info.NickName;
                setNode.getChildByName("ip").getComponent(cc.Label).string=info.IP;
                setNode.getChildByName("address").getComponent(cc.Label).string=info.Address;
                personNode.getChildByName("name").getComponent(cc.Label).string=info.NickName;
                personNode.getChildByName("ip").getComponent(cc.Label).string=info.IP;
                personNode.getChildByName("address").getComponent(cc.Label).string=info.Address;
                meNode.getChildByName("roomCardNode").getChildByName("cardNumLabel").getComponent(cc.Label).string=info.CardNum+"";
                meNode.getChildByName("idNode").getChildByName("cardNumLabel").getComponent(cc.Label).string=p.net.userid+"";
                setNode.getChildByName("idNode").getChildByName("cardNumLabel").getComponent(cc.Label).string=p.net.userid+"";
                personNode.getChildByName("idNode").getChildByName("cardNumLabel").getComponent(cc.Label).string=p.net.userid+"";
                cc.loader.load({url: info.Photo, type: 'png'}, function (err, texture) {
                meNode.getChildByName("head").getComponent(cc.Sprite).spriteFrame=new cc.SpriteFrame(texture);
                setNode.getChildByName("head").getComponent(cc.Sprite).spriteFrame=new cc.SpriteFrame(texture);
                personNode.getChildByName("head").getComponent(cc.Sprite).spriteFrame=new cc.SpriteFrame(texture);
                });
            }
            if(e=="huiyuanlist")
            {
               
                if(info.Data.length>0)
                {
                cc.find("Canvas/mask/woNode/huiyuanListNode/tip").active=false;
                var jiluNode=cc.find("Canvas/mask/woNode/huiyuanListNode/huiyuanNode/scroll/view/content/list");
                jiluNode.removeAllChildren();
                var height=0;
                for(var i=0;i<info.Data.length;i++)
                {
                    var pre=cc.instantiate(p.huiyuanItemPre);
                    height=pre.height;
                    pre.userid=""+info.Data[i].UserID;
                    cc.log(info.Data[i].State);
                    if(info.Data[i].State==0)
                    {
                        pre.getChildByName("settingButton").state="setting";
                        
                        pre.getChildByName("settingButton").getChildByName("tip").getComponent(cc.Label).string="设置VIP";
                    }
                    else
                    {
                        pre.getChildByName("settingButton").state="cancel";
                        pre.getChildByName("settingButton").getChildByName("tip").getComponent(cc.Label).string="取消VIP";
                    }
                    
                    pre.getChildByName("settingButton").on('click', p.settingButtonClick, p);
                    pre.getChildByName("sendButton").on('click', p.sendButtonClick, p);
                    pre.getChildByName("nameLabel").getComponent(cc.Label).string=info.Data[i].NickName+"";
                    jiluNode.addChild(pre);
                    pre.setPosition(0,-i*height);
                    cc.loader.load({url: info.Data[i].Photo, type: 'png'}, function (err, texture) {
               	        pre.getChildByName("head").getComponent(cc.Sprite).spriteFrame=new cc.SpriteFrame(texture);
                    });
                }
                jiluNode.parent.height=info.Data.length*height;
                }
                else
                {
                cc.find("Canvas/mask/woNode/huiyuanListNode/tip").active=true;    
                }
            }
            if(e=="vipcoinlist")
            {
                cc.log(info.Data.length);
                if(info.Data.length>0)
                {
                cc.find("Canvas/vipCoinDialogNode/dialog/tip").active=false;
                cc.find("Canvas/vipCoinDialogNode/dialog/currJiesuan/coinLabel").getComponent(cc.Label).string=info.Info;
                var jiluNode=cc.find("Canvas/vipCoinDialogNode/dialog/jiluNode/scroll/view/content/list");
                jiluNode.removeAllChildren();
                var height=0;
                if(info.Data.length>30)
                {
                   info.Data.length=30; 
                }
                for(var i=0;i<info.Data.length;i++)
                {
                    var pre=cc.instantiate(p.vipItemPre);
                    height=pre.height;
                    pre.getChildByName("nameLabel").getComponent(cc.Label).string=info.Data[i].NickName+"";
                    pre.getChildByName("roomNode").getChildByName("roomLabel").getComponent(cc.Label).string=info.Data[i].RoomNum+"";
                    pre.getChildByName("jushuNode").getChildByName("jushuLabel").getComponent(cc.Label).string=info.Data[i].Screenings+"";
                    pre.getChildByName("jifenNode").getChildByName("jifenLabel").getComponent(cc.Label).string=info.Data[i].Point+"";
                    pre.getChildByName("biliNode").getChildByName("biliLabel").getComponent(cc.Label).string=info.Data[i].GuaMoney+"";
                    pre.getChildByName("yingjiesuanNode").getChildByName("coinLabel").getComponent(cc.Label).string=info.Data[i].Money+"";
                    
                    jiluNode.addChild(pre);
                    pre.setPosition(0,-i*height);
                    cc.loader.load({url: info.Data[i].Photo, type: 'png'}, function (err, texture) {
               	       pre.getChildByName("head").getComponent(cc.Sprite).spriteFrame=new cc.SpriteFrame(texture);
                    });
                }
                jiluNode.parent.height=info.Data.length*height;
                }
                else
                {
                cc.find("Canvas/vipCoinDialogNode/dialog/tip").active=true;    
                }
            }
           if(e=="dailicoinlist")
            {
                if(info.Data.length>0)
                {
                cc.find("Canvas/dailiCoinDialogNode/dialog/tip").active=false;
                cc.find("Canvas/dailiCoinDialogNode/dialog/noGainCoin/coinLabel").getComponent(cc.Label).string=info.Info;
                cc.find("Canvas/dailiCoinDialogNode/dialog/hejiNode/hejiLabel").getComponent(cc.Label).string=info.Info;
                var jiluNode=cc.find("Canvas/dailiCoinDialogNode/dialog/jiluNode/scroll/view/content/list");
                jiluNode.removeAllChildren();
                var height=0;
                if(info.Data.length>30)
                {
                   info.Data.length=30; 
                }
                for(var i=0;i<info.Data.length;i++)
                {
                    var pre=cc.instantiate(p.dailiItemPre);
                    height=pre.height+10;
                    pre.getComponent(cc.Label).string=info.Data[i].CreateTime+"";
                    pre.getChildByName("coinLabel").getComponent(cc.Label).string=info.Data[i].UserMoney+"";
                    jiluNode.addChild(pre);
                    pre.setPosition(0,-i*height);
                }
                jiluNode.parent.height=info.Data.length*height;
                }
                else
                {
                cc.find("Canvas/dailiDialogNode/dialog/tip").active=true;    
                }
            }
            if(e=="yaoqingma")
            {
                if(info.state==0)
                {
                    p.yqm="";
                }
                else
                {
                    p.yqm=info.Data+"";
                }
                
            }
            if(e=="bdyaoqingma")
            {
                if(info.state==0)
                {
                p.showToast("绑定失败");
                }
                else
                {
                p.showToast("绑定成功");
                p.net.getYaoqingma(p.net.userid);
                }
            }
            if(e=="setvip")
            {
                if(info.state==0)
                {
                p.showToast("设置失败");
                }
                else
                {
                p.showToast("设置成功");
                p.net.getHuiyuanList(p.net.userid);
                }
            }
            if(e=="cancelvip")
            {
                if(info.state==0)
                {
                p.showToast("取消失败");
                }
                else
                {
                p.showToast("取消成功");
                p.net.getHuiyuanList(p.net.userid);
                }
            }
            if(e=="sendcard")
            {
                if(info.state==0)
                {
                p.showToast("赠送失败");
                }
                if(info.state==1)
                {
                i
                p.showToast("赠送成功");
                p.net.getPersonInfo(p.net.userid);
                p.dialogClose("","send");
                }
                if(info.state==3)
                {
                i
                p.showToast("赠送失败");
                }
                if(info.state==2)
                {
                i
                p.showToast("房卡不足");
                
                }
            }
            if(e=="inform")
            {
                p.dialogClose("","create");
                //window.location.href="http://game.ycluck.top/game/?userid="+p.net.userid+"&roomNum="+info;
                Global.userid=p.net.userid;
                Global.roomNum=info;
                p.audioControl.stopBGM();
                p.loadGame();
            }
            if(e=="login")
            {
            p.creDialogInfo={
            OpenCard:0,
            userid:parseInt(p.net.userid),
            Hang:2,
            StuffyNum:1,
            BottomLimit:10,
            ThecardNum:1,
            GameNum:10
           };
        p.creDnDialogInfo={
            OpenCard:0,
            userid:parseInt(this.net.userid),
            RoomType:0,
            Screenings:10,
            BottomLimit:1,
            ThecardNum:0,
            PeopleNum:6,
            CardRoler:0,
            isJoin:1
        };
           p.net.getPersonInfo(p.net.userid);
            }
            if(e=="joinroom")
            {
                Global.roomNum=info.RoomNum;
                Global.userid=info.UserID;
                p.audioControl.stopBGM();
                if(info.RoomType=="0")
                {
                p.loadGame("liangzhangGameScene");
                }
                if(info.RoomType=="1")
                {
                p.loadGame("sizhangGameScene");
                }
                if(info.RoomType=="2")
                {
                p.loadGame("jiaguoGameScene");
                }
            }
            if(e=="joineroom")
            {
                p.showToast("正在跳转到已经加入的房间"+info.roomNum);
                setTimeout(function(){
                Global.roomNum=info.RoomNum;
                Global.userid=p.net.userid;
                p.audioControl.stopBGM();
                if(info.RoomType=="0")
                {
                p.loadGame("liangzhangGameScene");
                }
                if(info.RoomType=="1")
                {
                p.loadGame("sizhangGameScene");
                }
                if(info.RoomType=="2")
                {
                p.loadGame("jiaguoGameScene");
                }
                },2000);
            }
            if(e=="joindneroom")
            {
                p.showToast("正在跳转到已经加入的房间"+info.roomNum);
                setTimeout(function(){
                Global.roomNum=info.roomNum;
                Global.userid=info.userid;
                p.creDnDialogInfo.PeopleNum=parseInt(info.PeopleNum);
                p.creDnDialogInfo.isJoin=1;
                Global.dnRoomInfo= p.creDnDialogInfo;
                p.audioControl.stopBGM();
                p.loadDnGame();
                },2000);
            }
            if(e=="creatednroom")
            {
                Global.roomNum=info.RoomID;
                Global.userid=p.net.userid;
                p.creDnDialogInfo.isJoin=0;
                Global.dnRoomInfo= p.creDnDialogInfo;
                p.audioControl.stopBGM();
                p.loadDnGame();
            }
            if(e=="joindnroom")
            {
                Global.roomNum=info.roomNum;
                Global.userid=info.userid;
                p.creDnDialogInfo.PeopleNum=parseInt(info.PeopleNum);
                p.creDnDialogInfo.isJoin=1;
                Global.dnRoomInfo= p.creDnDialogInfo;
                p.audioControl.stopBGM();
                p.loadDnGame();q
            }
            if(e=="noJoinedRoom")
            {
                cc.log("no joinroom");
            }
            if(e=="nonoJoinedRoom")
            {
            cc.find("Canvas/mask").pauseSystemEvents(true);
            cc.find("Canvas/joinDialogNode").active=true;
            cc.find("Canvas/joinDialogNode").getComponent(cc.Animation).play("dialogSee");
            }
            if(e=="notice")
            {
            
            cc.find("Canvas/mask/centerNode/topNode/noticeNode/noticeBack/mask/noticeLabel").getComponent("paomaLight").setData(info);
            
            
            }
            if(e=="shangchenginfo")
            {
            for(var i=0;i<info.data.length;i++)
            {
                cc.find("Canvas/shangchengDialogNode/dialog/dou"+(i+1)+"/price").getComponent(cc.Label).string="$"+info.data[i].Price;
                cc.find("Canvas/shangchengDialogNode/dialog/dou"+(i+1)+"/douNum").getComponent(cc.Label).string=""+info.data[i].DouNum;
            }
            }
            if(e=="payinfo")
            {
                if(info.data.length>0)
                {
                cc.find("Canvas/shangchengDialogNode").pauseSystemEvents(true);
                cc.find("Canvas/buyInfoDialogNode/tip").active=false;    
                cc.find("Canvas/buyInfoDialogNode").active=true;
                var jiluNode=cc.find("Canvas/buyInfoDialogNode/dialog/scroll/view/content/list");
                jiluNode.removeAllChildren();
                var height=0;
                for(var i=0;i<info.data.length;i++)
                {
                    var pre=cc.instantiate(p.buyPre);
                    height=(pre.height+10);
                    pre.getChildByName("num").getComponent(cc.Label).string=(i+1)+"";
                    pre.getChildByName("time").getComponent(cc.Label).string=info.data[i].time+"";
                    pre.getChildByName("title").getComponent(cc.Label).string=info.data[i].title+"";
                    jiluNode.addChild(pre);
                    pre.setPosition(0,-i*height);
                }
                jiluNode.parent.height=info.data.length*height;
                }
                else
                {
                cc.find("Canvas/shangchengDialogNode").pauseSystemEvents(true);
                cc.find("Canvas/buyInfoDialogNode/tip").active=true;    
                cc.find("Canvas/buyInfoDialogNode").active=true;  
                }
                
            }
        }
    },
    buyHisClose:function()
    {
                cc.find("Canvas/shangchengDialogNode").resumeSystemEvents(true);
                cc.find("Canvas/buyInfoDialogNode").active=false;
    },
    noticeButtonClick:function()
    {
        this.net.getNotice();
    },
    loadGame:function(sce)
    {
        var loadNode=cc.find("Canvas/loadNode");
        loadNode.active=true;
        loadNode.getChildByName("load").getComponent(cc.Animation).play("load");
        cc.director.loadScene(sce);  
    },
    
    showAlert:function(msg)
    {
        cc.find("Canvas/alertDialogNode").active=true;
        cc.find("Canvas/mask").pauseSystemEvents(true);
        cc.find("Canvas/alertDialogNode/dialog/alertLabel").getComponent(cc.Label).string=msg;
        cc.find("Canvas/alertDialogNode").getComponent(cc.Animation).play("dialogSee");
    },
    showToast:function(msg)
    {
        cc.find("Canvas/toastNode").active=true;
        cc.find("Canvas/toastNode/label").getComponent(cc.Label).string=msg;
        cc.find("Canvas/toastNode/back").width=(msg.length+2)*40;
        setTimeout(function() {
            cc.find("Canvas/toastNode").active=false;
        }, 1500);
    },
    aboutButtonClick:function()
    {
        this.showAlert("客服QQ:644399996\n\n客服微信:chinahua227");
    },
    exitButtonCLick:function()
    {
        cc.director.end();
    },
    addButtonCLick:function()
    {
        this.showToast("请联系群主");
    },
    bdyaoqingmaButtonClick:function()
    {
        var code=cc.find("Canvas/yaoqingmaDialogNode/dialog/keyLabelNode").getComponent("keyLabelControl").getStr();
        if(code.length>0)
        {
            this.net.bdYaoqingma(this.net.userid,code);
            cc.find("Canvas/yaoqingmaDialogNode").active=false;
             cc.find("Canvas/mask").resumeSystemEvents(true);
        }
        else
        {
            this.showToast("请输入邀请码");
        }
    },
    qiehuanButtonmClick:function()
    {
        this.audioControl.stopBGM();
        cc.sys.localStorage.setItem("userid","");
        cc.director.loadScene("loginScene");

    },
    myInfoShow:function()
    {
        cc.find("Canvas/mask").pauseSystemEvents(true);
        cc.find("Canvas/personDialogNode").active=true;
    },
    helpButtonClick:function()
    {
        cc.find("Canvas/mask").pauseSystemEvents(true);
        cc.find("Canvas/helpDialogNode").active=true;
    },
    bottomButtonClick:function(e,msg)
    {
        this.createState=msg;
        
        if(msg=="sizhang")
        {
            this.creDialogInfo=this.cresizhangDialogInfo;
            this.creDialogInfo.RoomType="1";
        }
        if(msg=="liangzhang")
        {
            this.creDialogInfo=this.creliangzhangDialogInfo;
            this.creDialogInfo.RoomType="0";
        }
        if(msg=="jiaguo")
        {
            this.creDialogInfo=this.crejiaguoDialogInfo;
            this.creDialogInfo.RoomType="2";
        }
        for(var i=0;i<this.bottomList.length;i++)
        {
            if(this.bottomList[i].name==msg)
            {
                this.bottomList[i].getChildByName("on").active=true;
                this.bottomList[i].getChildByName("off").active=false;
            }
            else
            {
                this.bottomList[i].getChildByName("on").active=false;
                this.bottomList[i].getChildByName("off").active=true;
            }
        }
        
    },
    buyHisButtonClick:function()
    {
        this.net.getPayInfo(this.net.userid);
    },
    shangchengButtonClick:function()
    {
         cc.find("Canvas/mask").pauseSystemEvents(true);
        cc.find("Canvas/shangchengDialogNode").active=true;
        this.net.getShangchengInfo(this.net.userid);
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        
        if(cc.find("Canvas/joinDialogNode/dialog/keyLabelNode").getComponent("keyLabelControl").getStr().length==6)
        {
            this.joinRoomButtonClick();
            cc.find("Canvas/joinDialogNode/dialog/keyBoard").getComponent("keycodeControl").keyCodeClear();
        }

    },
});
