import { EILSEQ } from "constants";
import { parse } from "url";
import { setTimeout } from "timers";

cc.Class({
	extends: cc.Component,
	properties: {
		pokerArray: [],
		playLightRotateArray: {
			default:
				[],
			type: cc.String,
		},
		coinLabel: {
			default:
				null,
			type: cc.Node,
		},
		playArray: {
			default:
				[],
			type: cc.Node,
		},
		pokerPre: {
			default:
				null,
			type: cc.Prefab,
		},
		weiguanPre: {
			default:
				null,
			type: cc.Prefab,
		},
		fontPre: {
			default:
				null,
			type: cc.Prefab,
		},
		qiPokerPre: {
			default:
				null,
			type: cc.Prefab,
		},
		biPokerPre: {
			default:
				null,
			type: cc.Prefab,
		},
		emojiPre: {
			default:
				null,
			type: cc.Prefab,
		},
		resultPre: {
			default:
				null,
			type: cc.Prefab,
		},
		pokerBackPre: {
			default:
				null,
			type: cc.Prefab,
		},
		pokerBackSp: {
			default:
				null,
			type: cc.SpriteFrame,
		},
		coinPre: {
			default:
				null,
			type: cc.Prefab,
		},

		disconnectLabel: {
			default:
				null,
			type: cc.Node,
		},
		gameOverNode: {
			default:
				null,
			type: cc.Node,
		},
		playAgainButton: {
			default:
				null,
			type: cc.Node,
		},
		reconnectButton: {
			default:
				null,
			type: cc.Node,
		},
		alertNode: {
			default:
				null,
			type: cc.Node,
		},
		mainNode: {
			default:
				null,
			type: cc.Node,
		},
		settingNode: {
			default:
				null,
			type: cc.Node,
		},
		deskNum: 0,
		playInfoArray: [],
		infoTexture: [],
		fontTexure: [],
		cardAnalyser: null,
		privateKey: "123456",

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
		var self = this;
		self.heartSchedule = null;
		this.timestamp = 0;
		this.userid = "";
		this.jiaMi = require("crypto");
		this.isOver = false;
		this.HTTP = require("HTTP");
		//this.wx = require("wc");
		this.compre = new this.jiaMi();
		this.audioControl = this.node.getChildByName("audioManager").getComponent("audioControl");
		this.animaControl = this.node.getChildByName("pokerAnimation").getComponent("animaControl");
		this.heartTime = 0;
		this.isConnecting = false;
		this.timeoutNum = 0;
		this.isJoined = false;
		this.isLookPoker = false;
		this.isGameBegin = false;
		this.maxXiazhu = 0.1;
		this.roomCoinArray = [];
		this.roomInfo = {};
		this.currDeskNum = 0;
		this.isGameBegin = false;
		this.mesList = [];
		this.userid = Global.userid;
		this.roomNum = Global.roomNum;
		this.host = "ws://182.61.58.129:2019";
		this.audioControl.init("yx");
		this.audioControl.playBGM("ddbg");
		this.reconing = false;
		self.startListen();
		this.initWebSocket();
		cc.find("Canvas/mainNode/UI/roomInfoNode/roomLabel").getComponent(cc.Label).string = "房间号:" + cc.roomNum;
		cc.loader.loadResDir("/info", cc.SpriteFrame, function (errors, results) {
			var sflist = results;
			// cc.SpriteFrame
			for (var i = 0; i < sflist.length; i++) {
				var sf = sflist[i];
				self.infoTexture[sf.name] = sf;
			}
		});
		cc.loader.loadRes("ddzfont", cc.SpriteAtlas, function (err, assets) {
			var sflist = assets.getSpriteFrames();
			for (var k = 0; k < sflist.length; k++) {
				var frame = sflist[k];
				self.fontTexure[frame.name] = frame;
			}
		});
		cc.loader.loadRes("card", cc.SpriteAtlas, function (err, assets) {

			var sflist = assets.getSpriteFrames();
			// cc.SpriteFrame
			var smallFangzhuan = null;
			var smallMeihua = null;
			var smallHongxin = null;
			var smallHeitao = null;
			var bigFangzhuan = null;
			var bigMeihua = null;
			var bigHongxin = null;
			var bigHeitao = null;
			for (var i = 0; i < sflist.length; i++) {
				var sf = sflist[i];

				if (sf.name == "small_0") {
					cc.log(sf.name);
					smallFangzhuan = sf;
				}
				if (sf.name == "small_1") {
					cc.log(sf.name);
					smallMeihua = sf;
				}
				if (sf.name == "small_2") {
					cc.log(sf.name);
					smallHongxin = sf;
				}
				if (sf.name == "small_3") {
					cc.log(sf.name);
					smallHeitao = sf;
				}
				if (sf.name == "big_0") {
					bigFangzhuan = sf;
				}
				if (sf.name == "big_1") {
					bigMeihua = sf;
				}
				if (sf.name == "big_2") {
					bigHongxin = sf;
				}
				if (sf.name == "big_3") {
					bigHeitao = sf;
				}
				if (sf.name == "dw") {
					self.pokerArray["dawang_100"] = sf;

				}
				if (sf.name == "xw") {
					self.pokerArray["xiaowang_99"] = sf;
				}
			}

			for (var k = 0; k < sflist.length; k++) {
				var frame = sflist[k];
				if (frame.name.indexOf("r") >= 0) {
					self.pokerArray["2-" + frame.name.substring(1)] = {
						num: frame,
						smallHuase: smallHongxin,
						bigHuase: bigHongxin,
					};
					self.pokerArray["4-" + frame.name.substring(1)] = {
						num: frame,
						smallHuase: smallFangzhuan,
						bigHuase: bigFangzhuan,
					};
				}
				if (frame.name.indexOf("b") >= 0) {
					self.pokerArray["3-" + frame.name.substring(1)] = {
						num: frame,
						smallHuase: smallMeihua,
						bigHuase: bigMeihua,
					};
					self.pokerArray["1-" + frame.name.substring(1)] = {
						num: frame,
						smallHuase: smallHeitao,
						bigHuase: bigHeitao,
					};
				}

			}
		});
		/*
        cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function(){
        //处理游戏进入后台的情况
        
        });
        cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function(){
        //处理返回游戏的情况
        if(Global.socket.readyState==WebSocket.CLOSED||Global.socket.readyState==WebSocket.CLOSING)
        {
		        self.heartTime=0;
		        self.resetRoomData();
		        clearTimeout(self.sFun);
		        clearTimeout(self.tFun);
		        clearTimeout(self.rFun);
		        if (!self.isOver) {
		    	self.showAlert("重新连接中。。。");
	            self.reconnectButtonClick();
		        }
        }
        });*/



	},

	initWebSocket: function () {
		var self = this;
		cc.log(this.host);
		//cc.socket = new WebSocket(this.host);
		cc.socket.sendMessage = function (state, infoArray) {
			try {
				var jsInfo = {
					state: "9999999",
					UserID: cc.userid,
					RoomID: cc.roomNum
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
				cc.log("connect ok");
				self.closeAlert();
				if (!self.reconing) {
					cc.socket.sendMessage(101, {});
				}
				self.reconing = false;

			};
		cc.socket.onclose = function (evt) {
			self.showAlert("正在重连中。。。");
			self.reconing = true;
			setTimeout(function () {

				cc.socket = new WebSocket(this.host);
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
					case 126:

					    self.shareTxt = info.People + "/9人正在等待," + pt + ",52张牌," + self.juNum + "局,每局" + self.Quan + "轮," + self.LookNum + "轮后比牌";
						jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "shareWebPage", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", 0 + "", "幸运赢三张 房号:【" + cc.roomNum + "】", self.shareTxt, "https://fir.im/luac");
						
						break;
					case 101:
						self.closeAlert();
						self.initRecoder();
						cc.find("Canvas/mainNode/UI/infoNode/dizhuNode/dizhuLabel").getComponent(cc.Label).string = info.Hang + "";
						self.juNum = info.GameNum;
						self.HangNum = info.HangNum;
						self.Quan = info.Quan;
						self.LookNum=info.LookNum;

						self.timeOut = parseInt(info.TimeOut);
						cc.find("Canvas/mainNode/UI/infoNode/juNumNode/juNumLabel").getComponent(cc.Label).string = "局数:" + info.GameNumNow + "/" + self.juNum;
						cc.find("Canvas/mainNode/UI/infoNode/danzhuNode/danzhuLabel").getComponent(cc.Label).string = info.HangNum + "";
						var pt = "房主付";
						if (info.OpenState == "1") {
							pt = "AA支付";

						}
						self.shareTxt = info.data.length + "/9人正在等待," + pt + ",52张牌," + self.juNum + "局,每局" + self.Quan + "轮," + self.LookNum + "轮后比牌";



						if (info.RoomOwner == cc.userid) {
							self.isRoomer = true;
							cc.find('Canvas/mainNode/UI/startButton').active = true;
							//cc.find('Canvas/mainNode/UI/readyButton').active = false;
						}
						else {
							cc.find('Canvas/mainNode/UI/startButton').active = false;
							//cc.find('Canvas/mainNode/UI/readyButton').active = false;
							self.isRoomer = false;
						}
						for (var i = 0; i < info.data.length; i++) {
							self.onNetMessage("got posRole", JSON.stringify({
								deskNum: parseInt(info.data[i].Pos),
								roleName: info.data[i].NickName,
								coinNum: info.data[i].Point,
								dichi: "0",
								photo: info.data[i].Photo
							}));
							var role = self.getRoleByDeskNum(parseInt(info.data[i].Pos));
							if (role) {
								role.node.getChildByName("ruzuoButton").active = false;
								if (self.isRoomer) {
									role.node.getChildByName("tButton").active = true;
								}
								else {
									role.node.getChildByName("tButton").active = false;
								}
							}

						}
						self.currDeskArray = info.data;
						break;
					case 102:
						if (info.UserID == cc.userid) {
							if (info.Roler == "1") {
								self.showToast("入座成功");
								self.isRuzuo = true;
								for (var k = 0; k < self.playArray.length; k++) {
									var role = self.playArray[k];
									role.getChildByName("roleType").getComponent(cc.Sprite).spriteFrame = self.infoTexture["dface"];
									role.getChildByName("coinLabel").getComponent(cc.Label).string = "";
									role.getChildByName("nameLabel").getComponent(cc.Label).string = "等待加入";
									role.getChildByName("ruzuoButton").active = false;
									role.getChildByName("tButton").active = false;
								}
								self.playInfoArray = [];
								self.onNetMessage("got myRole", JSON.stringify({
									deskNum: parseInt(info.Pos),
									roleName: info.NickName,
									coinNum: info.Point,
									dichi: "0",
									photo: info.Photo
								}));
								for (var i = 0; i < info.data.length; i++) {
									if (info.data[i].Pos != info.Pos) {
										self.onNetMessage("got deskRole", JSON.stringify({
											deskNum: parseInt(info.data[i].Pos),
											roleName: info.data[i].NickName,
											coinNum: info.data[i].Point,
											dichi: "0",
											photo: info.data[i].Photo
										}));
										var role = self.getRoleByDeskNum(parseInt(info.data[i].Pos));
										if (role) {
											if (self.isRoomer) {
												role.node.getChildByName("tButton").active = true;
											}
											else {
												role.node.getChildByName("tButton").active = false;
											}
										}


									}
								}

							}
							else if (info.Roler == "5") {
								self.showToast("牌局正在解散中,不能入座");
							}
							else {
								self.showToast("入座失败");
							}
						}
						else {
							if (info.Roler == "1") {
								if (self.isRuzuo) {
									self.onNetMessage("got deskRole", JSON.stringify({
										deskNum: parseInt(info.Pos),
										roleName: info.NickName,
										coinNum: info.Point,
										dichi: "0",
										photo: info.Photo
									}));
									var role = self.getRoleByDeskNum(parseInt(info.Pos));
									if (role) {
										if (self.isRoomer) {
											role.node.getChildByName("tButton").active = true;
										}
										else {
											role.node.getChildByName("tButton").active = false;
										}
									}
								}
								else {
									self.onNetMessage("got posRole", JSON.stringify({
										deskNum: parseInt(info.Pos),
										roleName: info.NickName,
										coinNum: info.Point,
										dichi: "0",
										photo: info.Photo
									}));
									var role = self.getRoleByDeskNum(parseInt(info.Pos));
									if (role) {
										role.node.getChildByName("ruzuoButton").active = false;
										if (self.isRoomer) {
											role.node.getChildByName("tButton").active = true;
										}
										else {
											role.node.getChildByName("tButton").active = false;
										}
									}
								}
							}


						}





						break;
					case 103:

						if (info.UserID == cc.userid) {
							if (info.Roler == 1) {
								self.showToast("站起围观成功");
								self.isRuzuo = false;
								for (var k = 0; k < self.playArray.length; k++) {
									var role = self.playArray[k];
									role.getChildByName("roleType").getComponent(cc.Sprite).spriteFrame = self.infoTexture["dface"];
									role.getChildByName("coinLabel").getComponent(cc.Label).string = "";
									role.getChildByName("nameLabel").getComponent(cc.Label).string = "等待加入";
									role.getChildByName("ruzuoButton").active = true;
									role.getChildByName("tButton").active = false;
								}
								self.playInfoArray = [];
								for (var i = 0; i < info.data.length; i++) {
									self.onNetMessage("got posRole", JSON.stringify({
										deskNum: parseInt(info.data[i].Pos),
										roleName: info.data[i].NickName,
										coinNum: info.data[i].Point,
										dichi: "0",
										photo: info.data[i].Photo
									}));
									self.playArray[parseInt(info.data[i].Pos) - 1].getChildByName("ruzuoButton").active = false;
								}
							}
							else {
								self.showToast("牌局开始不允许站起");
							}
						}
						else {
							if (info.Roler == 1) {
								self.showToast(info.NickName + "站起围观了");
								for (var k in self.playInfoArray) {
									if (k.indexOf("play") >= 0) {
										if (self.playInfoArray[k].deskNum == parseInt(info.Pos)) {
											var role = self.playInfoArray[k];
											role.node.getChildByName("roleType").getComponent(cc.Sprite).spriteFrame = self.infoTexture["dface"];
											role.node.getChildByName("coinLabel").getComponent(cc.Label).string = "";
											role.node.getChildByName("nameLabel").getComponent(cc.Label).string = "等待加入";

											role.node.getChildByName("tButton").active = false;
											delete self.playInfoArray[k];
											if (!self.isRuzuo) {
												self.playArray[parseInt(info.Pos) - 1].getChildByName("ruzuoButton").active = true;
											}
											else {
												self.playArray[parseInt(info.Pos) - 1].getChildByName("ruzuoButton").active = false;
											}
											break;
										}
									}
								}
							}
							else {

							}

						}
						break;
					case 104:
						if (info.UserID == cc.userid) {
							if (info.Roler == "0") {
								self.showToast("退出失败");
							}
							if (info.Roler == "1") {
								self.isOver = true;
								self.unscheduleAllCallbacks();
								self.heartTime = 0;
								cc.roomNum = "";
								self.audioControl.stopBGM();
								cc.roomNum = null;
								cc.director.loadScene("hallScene");
							}
						} else {
							if (info.Roler == "1" && info.Pos.length > 0) {
								self.onNetMessage("got exitGame", JSON.stringify({
									deskNum: parseInt(info.Pos)
								}));
							}
						}
						break;
					case 105:

						var jiesan = cc.find("Canvas/jiesanChooseNode");
						if (info.Roler == "1") {

							self.showToast("房主解散了房间");
							setTimeout(function () {
								self.isOver = true;
								self.backClick();

							}, 2000);

						} else if (info.Roler == "2") {
							//	if(cc.userid==info.UserID)
							//	{
							self.showToast("牌局未开始,只能由房主发起解散");
							//	}
						}
						else if (info.Roler == "3") {
							jiesan.active = true;
							for (var i = 0; i < info.data.length; i++) {
								var pNode = jiesan.getChildByName("dialog").getChildByName("jiesan" + (i + 1));
								pNode.active = true;
								pNode.getChildByName("name").getComponent(cc.Label).string = info.data[i].Name;
								pNode.getChildByName("head").getComponent(cc.Sprite).spriteFrame = self.getRoleByDeskNum(parseInt(info.data[i].Pos)).node.getChildByName("roleType").getComponent(cc.Sprite).spriteFrame;
								if (info.data[i].State == "1") {
									pNode.getChildByName("isAgree").getComponent(cc.Sprite).spriteFrame = self.infoTexture["agree"]
									if (parseInt(info.data[i].Pos) == self.deskNum) {
										jiesan.getChildByName("dialog").getChildByName("agButton").active = false;
										jiesan.getChildByName("dialog").getChildByName("dagButton").active = false;
									}
								}
								else if (info.data[i].State == "2") {
									pNode.getChildByName("isAgree").getComponent(cc.Sprite).spriteFrame = self.infoTexture["disagree"]
									if (parseInt(info.data[i].Pos) == self.deskNum) {
										jiesan.getChildByName("dialog").getChildByName("agButton").active = false;
										jiesan.getChildByName("dialog").getChildByName("dagButton").active = false;
									}
								}
								else {
									pNode.getChildByName("isAgree").getComponent(cc.Sprite).spriteFrame = null;
									if (parseInt(info.data[i].Pos) == self.deskNum) {
										jiesan.getChildByName("dialog").getChildByName("agButton").active = true;
										jiesan.getChildByName("dialog").getChildByName("dagButton").active = true;
									}
								}
							}
							for (var k = info.data.length + 1; k < 10; k++) {
								var pp = jiesan.getChildByName("dialog").getChildByName("jiesan" + k);
								pp.active = false;


							}

						}
						break;
					case 106:
						var jiesan = cc.find("Canvas/jiesanChooseNode");
						jiesan.active = true;
						for (var i = 0; i < info.data.length; i++) {
							var pNode = jiesan.getChildByName("dialog").getChildByName("jiesan" + (i + 1));
							pNode.active = true;
							pNode.getChildByName("name").getComponent(cc.Label).string = info.data[i].Name;
							pNode.getChildByName("head").getComponent(cc.Sprite).spriteFrame = self.getRoleByDeskNum(parseInt(info.data[i].Pos)).node.getChildByName("roleType").getComponent(cc.Sprite).spriteFrame;
							if (info.data[i].State == "1") {
								pNode.getChildByName("isAgree").getComponent(cc.Sprite).spriteFrame = self.infoTexture["agree"]
								if (parseInt(info.data[i].Pos) == self.deskNum) {
									jiesan.getChildByName("dialog").getChildByName("agButton").active = false;
									jiesan.getChildByName("dialog").getChildByName("dagButton").active = false;
								}
							}
							else if (info.data[i].State == "2") {
								pNode.getChildByName("isAgree").getComponent(cc.Sprite).spriteFrame = self.infoTexture["disagree"]
								if (parseInt(info.data[i].Pos) == self.deskNum) {
									jiesan.getChildByName("dialog").getChildByName("agButton").active = false;
									jiesan.getChildByName("dialog").getChildByName("dagButton").active = false;
								}
							}
							else {
								pNode.getChildByName("isAgree").getComponent(cc.Sprite).spriteFrame = null;
								if (parseInt(info.data[i].Pos) == self.deskNum) {
									jiesan.getChildByName("dialog").getChildByName("agButton").active = true;
									jiesan.getChildByName("dialog").getChildByName("dagButton").active = true;
								}
							}
							//	if (parseInt(info.data[i].Pos) == self.deskNum) {
							//		jiesan.active = false;
							//	}
						}
						for (var k = info.data.length + 1; k < 10; k++) {
							var pp = jiesan.getChildByName("dialog").getChildByName("jiesan" + k);
							pp.active = false;


						}
						break;
					case 1066:
						self.showToast("解散成功");
						self.clearSchedule();
						self.resetRoomData();
						var jiesan = cc.find("Canvas/jiesanChooseNode");
						jiesan.active = false;

						break;
					case 107:
						var jiesan = cc.find("Canvas/jiesanChooseNode");
						jiesan.active = false;
						self.showToast("" + info.NickName + "拒绝了解散请求。");
						break;
					case 108:

						if (info.Roler == "1") {
							cc.find("Canvas/mainNode/UI/shareButton").active = false;
							self.audioControl.stopBGM();
							self.audioControl.playBGM("yxbg");
							self.onNetMessage("got zhuang", JSON.stringify({
								deskNum: parseInt(info.zhuang)
							}));
							//cc.find("Canvas/mainNode/UI/deskTip").active = false;

							for (var k in self.playInfoArray) {
								if (k.indexOf("play") >= 0) {
									if (self.deskNum != self.playInfoArray[k].deskNum) {
										self.playInfoArray[k].node.getChildByName("tButton").active = false;
										//self.playInfoArray[k].node.getChildByName("xiazhu").getComponent(cc.Label).string = "";
									}
									else {
										//self.playInfoArray[k].node.getChildByName("xiazhu").getComponent(cc.Label).string = "";
									}
								}
							}
							cc.find("Canvas/mainNode/UI/allCoinNode/coinLabel").getComponent(cc.Label).string = info.HangSum + "";
							cc.find("Canvas/mainNode/UI/infoNode/danzhuNode/danzhuLabel").getComponent(cc.Label).string = self.HangNum + "";
							cc.find("Canvas/mainNode/UI/infoNode/juNumNode/juNumLabel").getComponent(cc.Label).string = info.GameNumNow + "/" + self.juNum;

							cc.find("Canvas/mainNode/UI/infoNode/lunNumNode/lunNumLabel").getComponent(cc.Label).string = info.QuanNow + "";


							cc.find('Canvas/mainNode/UI/startButton').active = false;
							//cc.find('Canvas/mainNode/UI/readyButton').active = false;
							self.audioControl.playSFX("kaiju");
							self.onNetMessage("game begin", info);
							self.LookNum = parseInt(info.LookNum);
							self.onNetMessage("got currDeskNum", JSON.stringify({
								deskNum: parseInt(info.SayPos),
								currLookNum: parseInt(info.QuanNow)
							}));
							for (var i in info.data) {
								var role = self.getRoleByDeskNum(parseInt(info.data[i].Pos));
								if (role) {
									role.node.getChildByName("coinLabel").getComponent(cc.Label).string = info.data[i].Point;
									role.node.getChildByName("xiazhuCoinNode").getChildByName("coinLabel").getComponent(cc.Label).string = info.data[i].NowPoint;
								}

							}
							//self.MaxHang = parseInt(info.MaxHang);

							//cc.find('Canvas/mainNode/UI/shaizi').active = true;
							//cc.find('Canvas/mainNode/UI/shaizi').getComponent(cc.Animation).play();
							/*
							setTimeout(function () {
								cc.find('Canvas/mainNode/UI/shaizi').getComponent(cc.Animation).stop();
								cc.find('Canvas/mainNode/UI/shaizi/shazi1').rotation = 0;
								cc.find('Canvas/mainNode/UI/shaizi/shazi2').rotation = 0;
								cc.find('Canvas/mainNode/UI/shaizi/shazi1').getComponent(cc.Sprite).spriteFrame = self.infoTexture["shaizi" + info.GuoNum.split("|")[0]];
								cc.find('Canvas/mainNode/UI/shaizi/shazi2').getComponent(cc.Sprite).spriteFrame = self.infoTexture["shaizi" + info.GuoNum.split("|")[1]];
								self.audioControl.playSFX("fapai");
								var f = parseInt(info.Frist);
								var fapaiArr = [];
								for (var q = 1; q < 5; q++) {
									if (q == f) {
										for (var w = q; w < 5; w++) {
											fapaiArr.push(w);
										}
										for (var p = 1; p < q; p++) {
											fapaiArr.push(p);
	
										}
										break;
	
	
	
									}
	
								}
								cc.log(JSON.stringify({
									fapaiArr: fapaiArr
								}));
								self.onNetMessage("fapai", JSON.stringify({
									fapaiArr: fapaiArr
								}));
								setTimeout(function () {
									cc.find('Canvas/mainNode/UI/shaizi').active = false;
	
									//self.startFapai("ok");
									if (info.HangType == "0") {
										for (var i = 0; i < info.data.length; i++) {
											var h = "";
											for (var k = 0; k < parseInt(info.RoadNum); k++) {
												h += info.Hang + "\n";
											}
											h = h.substring(0, h.length - 1);
											cc.log(h);
											if (parseInt(info.data[i].Pos) != parseInt(info.BankerPos)) {
												self.onNetMessage("got roleXiazhu", JSON.stringify({
													deskNum: parseInt(info.data[i].Pos),
													coinNum: info.data[i].Point,
													beishu: h
												}));
											}
										}
									}
									else {
										self.onNetMessage("got canXiaZhu", JSON.stringify({
											zhuang: parseInt(info.BankerPos)
										}));
									}
	
								}, 3000);
							}
								, 1000);
								*/
							/*
							if (info.IsBank == "1") {
								self.onNetMessage("got canRobZhuang", JSON.stringify({
								}));
							}*/
						} else {
							if (self.isRoomer) {
								self.showToast("入座的人数不够");
							}
						}
						break;
					case 109:
						info.NowPoint = info.NewPoint;
						self.onNetMessage("got roleGenzhu", JSON.stringify({
							deskNum: parseInt(info.Pos),
							genzhuCoin: info.HangNum,
							roleDichi: info.NowPoint,
							roleCoin: info.Point
						}));
						//cc.find("Canvas/mainNode/UI/infoNode/danzhuNode/danzhuLabel").getComponent(cc.Label).string = info.Hang + "";
						//cc.find("Canvas/mainNode/UI/allCoinNode/coinLabel").getComponent(cc.Label).string = info.TotalMoney + "";
						cc.find("Canvas/mainNode/UI/allCoinNode/coinLabel").getComponent(cc.Label).string = info.HangSum + "";
						cc.find("Canvas/mainNode/UI/infoNode/lunNumNode/lunNumLabel").getComponent(cc.Label).string = info.QuanNow + "";
						if (info.SayPos != "0") {
							self.onNetMessage("got currDeskNum", JSON.stringify({

								deskNum: parseInt(info.SayPos),
								currLookNum: parseInt(info.QuanNow),
								jiazhuNum: info.Hang,
								canJiazhu: true

							}));
						}

						break;
					case 110:
						if (info.Roler == "1" || info.Roler == "0") {
							if (parseInt(info.Pos) == self.deskNum) {

								self.getButton("genzhuButton").getComponent(cc.Button).interactable = false;
								self.getButton("jiazhuButton").getComponent(cc.Button).interactable = false;
								self.getButton("biPokerButton").getComponent(cc.Button).interactable = false;
							}
							self.onNetMessage("got roleJiazhu", JSON.stringify({
								deskNum: parseInt(info.Pos),
								jiazhuCoin: info.HangNumNow,
								roleDichi: info.NewPoint,
								roleCoin: info.Point
							}));
							cc.find("Canvas/mainNode/UI/jiazhuNode/coin1").color = new cc.Color(255, 255, 255);
							cc.find("Canvas/mainNode/UI/jiazhuNode/coin1").getComponent(cc.Button).interactable = true;
							cc.find("Canvas/mainNode/UI/jiazhuNode/coin2").color = new cc.Color(255, 255, 255);
							cc.find("Canvas/mainNode/UI/jiazhuNode/coin2").getComponent(cc.Button).interactable = true;
							cc.find("Canvas/mainNode/UI/jiazhuNode/coin3").color = new cc.Color(255, 255, 255);
							cc.find("Canvas/mainNode/UI/jiazhuNode/coin3").getComponent(cc.Button).interactable = true;
							if (parseInt(info.HangNum) >= 2) {
								cc.find("Canvas/mainNode/UI/jiazhuNode/coin1").color = new cc.Color(206, 154, 154);
								cc.find("Canvas/mainNode/UI/jiazhuNode/coin1").getComponent(cc.Button).interactable = false;

							}
							if (parseInt(info.HangNum) >= 4) {
								cc.find("Canvas/mainNode/UI/jiazhuNode/coin2").color = new cc.Color(206, 154, 154);
								cc.find("Canvas/mainNode/UI/jiazhuNode/coin2").getComponent(cc.Button).interactable = false;
							}
							if (parseInt(info.HangNum) >= 6) {
								cc.find("Canvas/mainNode/UI/jiazhuNode/coin3").color = new cc.Color(206, 154, 154);
								cc.find("Canvas/mainNode/UI/jiazhuNode/coin3").getComponent(cc.Button).interactable = false;
							}
							cc.find("Canvas/mainNode/UI/infoNode/danzhuNode/danzhuLabel").getComponent(cc.Label).string = info.HangNum + "";
							cc.find("Canvas/mainNode/UI/allCoinNode/coinLabel").getComponent(cc.Label).string = info.HangSum + "";
							cc.find("Canvas/mainNode/UI/infoNode/lunNumNode/lunNumLabel").getComponent(cc.Label).string = info.QuanNow + "";
							//cc.find("Canvas/mainNode/UI/allCoinNode/coinLabel").getComponent(cc.Label).string = info.TotalMoney + "";
							if (info.SayPos != "0") {
								self.onNetMessage("got currDeskNum", JSON.stringify({

									deskNum: parseInt(info.SayPos),
									currLookNum: parseInt(info.QuanNow),
									jiazhuNum: info.Hang,
									canJiazhu: true

								}));
							}
						}
						else {
							if (info.Roler == "2") {
								if (parseInt(info.Pos) == self.deskNum) {
									self.showToast("钻石不足,不能加最大注")
								}
							}
							else {
								self.showToast("加注失败,请重试")
							}

						}
						break;
					case 111:
						self.onNetMessage("got roleQiPoker", JSON.stringify({

							deskNum: parseInt(info.Pos)

						}));
						cc.find("Canvas/mainNode/UI/infoNode/lunNumNode/lunNumLabel").getComponent(cc.Label).string = info.QuanNow + "";
						if (info.SayPos != "0") {
							self.onNetMessage("got currDeskNum", JSON.stringify({

								deskNum: parseInt(info.SayPos),
								currLookNum: parseInt(info.QuanNow),
								jiazhuNum: "9999",
								canJiazhu: true

							}));
						}
						break;
					case 112:
						self.onNetMessage("got roleLookPoker", JSON.stringify({

							deskNum: parseInt(info.Pos),
							pokerArray: info.Card.split("|"),

						}));
						if (parseInt(info.Pos) == self.deskNum) {
							self.audioControl.playSFX("look" + info.CardType);



						}
						break;
					case 113:
						self.onNetMessage("got roleXiazhu", JSON.stringify({
							deskNum: parseInt(info.Pos),
							roleCoin: info.Point,
							genzhuCoin: info.HangNum
						}));
						self.onNetMessage("got roleBiPoker", JSON.stringify({

							deskNum1: parseInt(info.Pos),
							deskNum2: parseInt(info.ObjPos),
							roleDichi: info.NewPoint,
							roleCoin: info.Point

						}));
						cc.find("Canvas/mainNode/UI/infoNode/lunNumNode/lunNumLabel").getComponent(cc.Label).string = info.QuanNow + "";
						cc.find("Canvas/mainNode/UI/allCoinNode/coinLabel").getComponent(cc.Label).string = info.HangSum + "";



						setTimeout(function () {
							self.onNetMessage("got roleQiPoker", JSON.stringify({

								deskNum: parseInt(info.LosePos)

							}));
							if (info.SayPos != "0") {
								self.onNetMessage("got currDeskNum", JSON.stringify({
									deskNum: parseInt(info.SayPos),
									currLookNum: parseInt(info.QuanNow),
									jiazhuNum: "9999",
									canJiazhu: true
								}));
							}

						}, 2000);
						break;
					case 114:
						var role = self.getRoleByDeskNum(parseInt(info.Pos));
						info.type = info.Type;
						info.txt = info.Txt;
						if (info.type == "emoji") {
							if (role) {
								var pre = cc.instantiate(self.emojiPre);
								pre.getComponent("emojiControl").path = "emoji/" + info.txt.substring(0, info.txt.indexOf("-"));
								role.node.getChildByName("emojiNode").removeAllChildren();
								role.node.getChildByName("emojiNode").addChild(pre);
								pre.setPosition(0, 0);
								pre.getComponent("emojiControl").load();
								setTimeout(function () {
									pre.getComponent("emojiControl").clearSchedule();
									role.node.getChildByName("emojiNode").removeAllChildren();
								}, 2000)
							}
						}
						if (info.type == "msg") {
							if (role) {
								role.node.getChildByName("msgNode").active = true;

								setTimeout(function () {
									role.node.getChildByName("msgNode").active = false;
								}, 2000)
							}
							self.audioControl.playSFX("msg" + info.txt);

						}
						if (info.type == "text") {
							if (role) {
								role.node.getChildByName("toastNode").active = true;
								role.node.getChildByName("toastNode").getChildByName("label").getComponent(cc.Label).string = info.txt;
								role.node.getChildByName("toastNode").getChildByName("back").width = role.node.getChildByName("toastNode").getChildByName("label").width + 40;
								setTimeout(function () {
									role.node.getChildByName("toastNode").active = false;
								}, 2000);
							}
						}
						if (info.type == "voice") {
							if (role) {
								role.node.getChildByName("msgNode").active = true;
								setTimeout(function () {
									role.node.getChildByName("msgNode").active = false;
								}, 2000)
							}
							self.playSound(info.txt);
						}
						break;
					case 115:
						self.onNetMessage("game over", JSON.stringify(info));
						break;
					case 116:
						cc.find("Canvas/mainNode/UI/infoNode/lunNumNode/lunNumLabel").getComponent(cc.Label).string = info.QuanNow + "";
						break;
					case 117:
						setTimeout(function () {
							self.isOver = true;
							self.unscheduleAllCallbacks();
							self.resetRoomData();
							self.heartTime = 0;
							var zhanjiNode = cc.find("Canvas/zhanjiNode");
							/*
							var da = new Date();
							var year = da.getFullYear() + '年';
							var month = da.getMonth() + 1 + '月';
							var date = da.getDate() + '日';
							var time = year + month + date;
							zhanjiNode.getChildByName("timeLabel").getComponent(cc.Label).string = time;
							zhanjiNode.getChildByName("roomLabel").getComponent(cc.Label).string = self.roomNum;
							*/

							zhanjiNode.active = true;
							for (var i = 0; i < info.data.length; i++) {
								var res = cc.find("Canvas/zhanjiNode/item" + (i + 1));
								res.active = true;
								res.getChildByName("name").getComponent(cc.Label).string = info.data[i].NickName;
								res.getChildByName("id").getComponent(cc.Label).string = "ID:" + info.data[i].UserID;
								res.getChildByName("zhuang").getChildByName("label").getComponent(cc.Label).string = info.data[i].WinNum;
								res.getChildByName("xi").getChildByName("label").getComponent(cc.Label).string = info.data[i].XINum;
								if (parseInt(info.data[i].Point) >= 0) {
									res.getChildByName("result").color = new cc.Color(0, 255, 255);
									res.getChildByName("result").getComponent(cc.Label).string = "+" + info.data[i].Point;
								} else {
									res.getChildByName("result").color = new cc.Color(0, 0, 200);
									res.getChildByName("result").getComponent(cc.Label).string = info.data[i].Point;
								}
								if (info.data[i].IsWin == "1") {
									//res.getChildByName("win").active = true;
								}
								res.getChildByName("head").getComponent(cc.Sprite).spriteFrame = self.getRoleByDeskNum(info.data[i].Pos).node.getChildByName("roleType").getComponent(cc.Sprite).spriteFrame;
							}
							for (var i = info.data.length + 1; i < 10; i++) {
								cc.find("Canvas/zhanjiNode/item" + (i)).active = false;
							}
							zhanjiNode.getComponent(cc.Animation).play("result");




						}, 4000);
						break;
					case 120:
						var dial = cc.find("Canvas/infoDialogNode");
						var dia = dial.getChildByName("dialog");
						dia.getChildByName("name").getComponent(cc.Label).string = info.NickName;
						dia.getChildByName("ip").getComponent(cc.Label).string = info.IP;
						dia.getChildByName("address").getComponent(cc.Label).string = info.add;
						dia.getChildByName("dis").getComponent(cc.Label).string = info.Long;
						dia.getChildByName("idNode").getChildByName("cardNumLabel").getComponent(cc.Label).string = info.UserID + "";
						cc.loader.load({ url: info.Photo, type: 'png' }, function (err, texture) {
							dia.getChildByName("head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
						});
						dial.active = true;
						break;
					case 121:
						if (info.Roler == "1") {
							self.showToast("成功");
						}
						else if (info.Roler == "0") {
							self.getPosInfo("null", "play1");
						}
						if (info.States == "2") {

							self.onNetMessage("got poker", JSON.stringify({
								deskNum: self.deskNum,
								pokerArray: info.Card.split("|"),
								result: "",
							}));

						}


						break;
					case 1011:
						cc.find("Canvas/mainNode/UI/roomInfoNode/roomWeiguan").getComponent(cc.Label).string = "围观人数:" + info.Sum + "人";

						break;
					case 122:
						var role = self.getRoleByDeskNum(parseInt(info.ObjPos));
						if (role) {
							for (var k in self.playInfoArray) {
								if (k.indexOf("play") >= 0) {
									if (self.playInfoArray[k].deskNum == parseInt(info.ObjPos)) {
										var role = self.playInfoArray[k];
										role.node.getChildByName("roleType").getComponent(cc.Sprite).spriteFrame = self.infoTexture["dface"];
										role.node.getChildByName("coinLabel").getComponent(cc.Label).string = "";
										role.node.getChildByName("nameLabel").getComponent(cc.Label).string = "等待加入";

										role.node.getChildByName("tButton").active = false;
										delete self.playInfoArray[k];
										if (!self.isRuzuo) {
											self.playArray[parseInt(info.ObjPos) - 1].getChildByName("ruzuoButton").active = true;
										}
										else {
											self.playArray[parseInt(info.ObjPos) - 1].getChildByName("ruzuoButton").active = false;
										}
										break;
									}
								}
							}
						}
						if (self.isRoomer) {
							if (info.Roler == "1") {
								self.showToast("踢出成功");




							}
							else {
								self.showToast("踢出失败");
							}


						}
						else {
							if (info.ObjID == cc.userid) {
								self.isOver = true;
								self.showToast("已被踢出房间");
								setTimeout(function () {
									self.backClick();
								}, 1600);



							}
							else {


							}



						}



						break;
					case 123:
						var jiluNode = cc.find("Canvas/weiguanDialogNode/dialog/scroll/view/content/list");

						jiluNode.removeAllChildren();
						var height = 0;
						info.Data = info.data;
						for (var i = 0; i < info.Data.length; i++) {
							(
								function (k) {
									var pre = cc.instantiate(self.weiguanPre);
									height = (pre.scaleX * pre.height);
									pre.getChildByName("name").getComponent(cc.Label).string = info.Data[k].NickName + "";
									pre.getChildByName("num").getComponent(cc.Label).string = (k + 1) + "";
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
									//pre.on('click', self.weiguanClick, self);
								}
							)(i);
						}
						jiluNode.parent.height = info.Data.length * height;
						break;
					case 1022:
						self.onNetMessage("got disGame", JSON.stringify({
							deskNum: parseInt(info.Pos)
						}));
						break;
					case 10111:
						self.onNetMessage("got disGame", JSON.stringify({
							deskNum: parseInt(info.Pos)
						}));
						break;

				}
			}

		}
		cc.socket.onerror = function (evt) {
			cc.log("connect error");

		};
		cc.socket.sendMessage(101, {});
	},
	clickDouble: function () {
		for (var j = 0; j < this.myPokerArray.length; j++) {
			this.myPokerArray[j].isChoosed = false;
		}
		this.adjustMyPokerArrayPosition();
	},
	initUsddderInfo: function (da) {
		this.roleName = da.NickName;
		this.roleSex = "wo";
		this.isRoomer = false;
		this.roomerPos = da.IsmMster;
		if (da.IsmMster == da.Pos) {
			this.isRoomer = true;
		}
		this.playArray[0].getChildByName("nameLabel").getComponent(cc.Label).string = this.roleName;

		this.onNetMessage('got myRole', JSON.stringify({
			deskNum: parseInt(da.Pos),
			roleName: da.NickName,
			coinNum: 0,
			photo: da.Photo
		}));
	},
	getChoosePokerIndex: function (touch) {
		var i = Math.floor((touch + this.mainPlay.getChildByName("pokerGroup").width / 2) / 75);
		if (i > this.myPokerArray.length - 1) {
			i = this.myPokerArray.length - 1;
		}
		if (i < 0) {
			i = 0;
		}
		return i;
	},
	readyButtonClick: function () {
		this.init();
	},
	inidddtd: function () {
		var self = this;
		/*连接成功后向服务器发送创建玩家命令*/
		this.audioControl.init();
		this.audioControl.playBGM("gameback");
		this.startListen();
		var query = {
			userid: this.userid,
			roomNum: this.roomNum
		}
		this.HTTP.get("http://Api.ycluck.top", '/api/http/CheckRoom', query, function (result) {
			cc.log(result);
			if (result == "err") {
				self.showAlert("服务器连接失败");
			} else {
				var info = JSON.parse(result);
				if (info.state == 0) {
					self.showAlert("牌局已结束");
					setTimeout(function () {
						Global.roomNum = null;
						self.audioControl.stopBGM();
						cc.director.loadScene("hallScene");
					}, 2000)
				}
				if (info.state == 1) {
					self.initUserInfo(info.Data);
					self.initWebSocket();
				}
				if (info.state == 2) {
					self.showAlert("账号已禁用");
					setTimeout(function () {
						Global.roomNum = null;
						self.audioControl.stopBGM();
						cc.director.loadScene("hallScene");
					}, 2000)
				}
				if (info.state == 3) {
					self.showAlert("用户数据丢失");
					setTimeout(function () {
						Global.roomNum = null;
						self.audioControl.stopBGM();
						cc.director.loadScene("hallScene");
					}, 2000)
				}
				if (info.state == 4) {
					self.showAlert("房间已满");
					setTimeout(function () {
						Global.roomNum = null;
						self.audioControl.stopBGM();
						cc.director.loadScene("hallScene");
					}, 2000)
				}
				if (info.state == 5) {
					self.showAlert("房间不存在");
					setTimeout(function () {
						Global.roomNum = null;
						self.audioControl.stopBGM();
						cc.director.loadScene("hallScene");
					}, 2000)
				}
				if (info.state == 6) {
					self.showAlert("房卡不足");
					setTimeout(function () {
						Global.roomNum = null;
						self.audioControl.stopBGM();
						cc.director.loadScene("hallScene");
					}, 2000)
				}
			}

		});
	},
	initWssssebSocket: function () {
		var self = this;
		cc.log("ws://API.ycluck.top/API.ashx?userID=" + this.userid + "&RoomNum=" + this.roomNum);
		Global.socket = new WebSocket("ws://API.ycluck.top/API.ashx?userID=" + this.userid + "&RoomNum=" + this.roomNum);
		Global.socket.onopen = function (evt) {
			self.closeAlert();
			Global.socket.send("2@&@" + self.userid + "@&@" + self.roomNum);
			self.sendMessage("6");
			self.startHeart();
		};
		Global.socket.onclose = function (evt) {
			self.heartTime = 0;
			self.resetRoomData();
			clearTimeout(self.sFun);
			clearTimeout(self.tFun);
			clearTimeout(self.rFun);
			if (!self.isOver) {
				self.showAlert("重新连接中。。。");
				self.reconnectButtonClick();
			}
		};
		Global.socket.onmessage = function (evt) {
			cc.log(evt.data);
			if (evt.data.length > 0) {
				var info = JSON.parse(evt.data);
				var msg = "";
				var data = [];
				info.state = parseInt(info.state);
				cc.find("Canvas/reconButton").active = false;
				switch (info.state) {

					case 0:
						self.onNetMessage("got lineGame", JSON.stringify({
							deskNum: info.pos
						}));
						break;
					case 1:
						self.onNetMessage("got disGame", JSON.stringify({
							deskNum: info.pos
						}));

						break;
					case 2:
						self.closeAlert();
						cc.find("Canvas/reconButton").active = false;
						self.sendMessage("4");
						for (var i = 0; i < info.data.length; i++) {
							self.onNetMessage("got deskRole", JSON.stringify({
								deskNum: parseInt(info.data[i].pos),
								roleName: info.data[i].NickName,
								dichi: info.data[i].NowMoney,
								coinNum: info.data[i].Point,
								isLine: info.data[i].Line,
								photo: info.data[i].Photo,
								cardstate: info.data[i].cardstate
							}));

						}
						if (self.isRoomer && info.isstart == "0") {
							cc.find('Canvas/mainNode/UI/startButton').active = true;
						}
						if (info.isstart == "2") {
							self.showAlert("游戏已经结束");

						}
						if (info.saypos != "0") {
							cc.find("Canvas/mainNode/UI/shareButton").active = false;
							if (info.roler != "2") {
								self.onNetMessage("game begin", "ok");
							}
							self.onNetMessage("got currDeskNum", JSON.stringify({
								deskNum: parseInt(info.saypos)
							}));
						}
						break;
					case 3:
						if (info.data == "1") {
							cc.find('Canvas/mainNode/UI/startButton').active = false;
							cc.find('Canvas/mainNode/UI/shareButton').active = false;
							if (self.isRoomer) {
								self.sendMessage("5");
							}
						} else {
							if (self.isRoomer) {
								self.showAlert("人数不足3人");
								setTimeout(function () {

									self.closeAlert();

								}, 2000);
							}
						}
						break;
					case 4:
						self.onNetMessage("got deskRole", JSON.stringify({
							deskNum: parseInt(info.Pos),
							roleName: info.NickName,
							coinNum: info.Point,
							dichi: "0",
							photo: info.Photo
						}));

						break;
					case 5:
						cc.find("Canvas/reconButton").active = false;
						self.onNetMessage("game begin", "ok");
						self.sendMessage("6");
						self.sendMessage("7");
						if (info.Banker.length > 0 && info.Banker != "0") {
							self.onNetMessage("got zhuang", JSON.stringify({
								deskNum: parseInt(info.Banker)
							}));
						}
						for (var i = 0; i < info.data.length; i++) {
							self.onNetMessage("got roleXiazhu", JSON.stringify({
								deskNum: parseInt(info.data[i].Pos),
								genzhuCoin: info.data[i].Money,
								roleCoin: info.data[i].Point
							}));
						}
						break;
					case 6:
						cc.find("Canvas/reconButton").active = false;
						self.roomInfo = {
							roomNum: info.RoomNum,
							GameNum: info.MaxScreenings,
							BiCard: info.BiCard,
							Hang: info.Hang,
							StuffyNum: info.LookNum,
							Bottomlimit: info.MaxPlayNum
						}
						cc.find("Canvas/mainNode/UI/roomInfoNode/roomLabel").getComponent(cc.Label).string = "游戏房间:" + info.RoomNum;
						cc.find("Canvas/mainNode/UI/roomInfoNode/juLabel").getComponent(cc.Label).string = "当前局数:" + info.Screenings + "/" + info.MaxScreenings;
						cc.find("Canvas/mainNode/UI/roomInfoNode/beiLabel").getComponent(cc.Label).string = "比牌倍数:" + info.BiCard;
						cc.find("Canvas/mainNode/UI/roomInfoNode/bimenLabel").getComponent(cc.Label).string = "必闷圈数:" + info.LookNum;
						cc.find("Canvas/mainNode/UI/infoNode/dizhuNode/dizhuLabel").getComponent(cc.Label).string = info.Hang + "";
						cc.find("Canvas/mainNode/UI/infoNode/danzhuNode/danzhuLabel").getComponent(cc.Label).string = info.HangMoney + "";
						cc.find("Canvas/mainNode/UI/allCoinNode/coinLabel").getComponent(cc.Label).string = info.TotalMoney + "";
						self.showAlert("已完成" + info.LookNum + "轮必闷");
						setTimeout(function () {
							self.closeAlert();
						}, 2000);
						break;
					case 8:
						self.onNetMessage("got roleGenzhu", JSON.stringify({
							deskNum: parseInt(info.pos),
							roleCoin: info.money,
							genzhuCoin: info.point,
							roleDichi: info.NowMoney
						}));
						cc.find("Canvas/mainNode/UI/infoNode/danzhuNode/danzhuLabel").getComponent(cc.Label).string = info.HangMoney + "";
						cc.find("Canvas/mainNode/UI/allCoinNode/coinLabel").getComponent(cc.Label).string = info.TotalMoney + "";
						if (info.saypos != "0") {
							if (info.gentype == "1") {
								self.onNetMessage("got currDeskNum", JSON.stringify({

									deskNum: parseInt(info.saypos),
									jiazhuNum: info.HangMoney,
									canJiazhu: true

								}));
							} else {
								self.onNetMessage("got currDeskNum", JSON.stringify({

									deskNum: parseInt(info.saypos),
									jiazhuNum: info.HangMoney,
									canJiazhu: false

								}));
							}
						}

						break;
					case 9:
						self.onNetMessage("got roleJiazhu", JSON.stringify({
							deskNum: parseInt(info.pos),
							roleCoin: info.money,
							jiazhuCoin: info.point,
							roleDichi: info.NowMoney,
							dizhu: info.Hang
						}));
						cc.find("Canvas/mainNode/UI/infoNode/danzhuNode/danzhuLabel").getComponent(cc.Label).string = info.HangMoney + "";
						cc.find("Canvas/mainNode/UI/allCoinNode/coinLabel").getComponent(cc.Label).string = info.TotalMoney + "";
						if (info.saypos != "0") {
							if (info.gentype == "1") {
								self.onNetMessage("got currDeskNum", JSON.stringify({

									deskNum: parseInt(info.saypos),
									jiazhuNum: info.HangMoney,
									canJiazhu: true

								}));
							} else {
								self.onNetMessage("got currDeskNum", JSON.stringify({

									deskNum: parseInt(info.saypos),
									jiazhuNum: info.HangMoney,
									canJiazhu: false

								}));
							}
						}

						break;
					case 7:
						if (info.gentype == "1") {
							self.onNetMessage("got currDeskNum", JSON.stringify({

								deskNum: parseInt(info.SayPos),
								jiazhuNum: info.HangMoney,
								canJiazhu: true

							}));
						} else {
							self.onNetMessage("got currDeskNum", JSON.stringify({

								deskNum: parseInt(info.SayPos),
								jiazhuNum: info.HangMoney,
								canJiazhu: false
							}));
						}
						break;
					case 11:
						if (info.data.length > 0) {
							self.onNetMessage("got poker", JSON.stringify({

								deskNum: self.deskNum,
								pokerArray: info.data.split("|"),
								result: "",
								jiazhuNum: info.HangMoney,
							}));
						}
						break;
					case 14:
						self.canDoTime = false;
						//self.closeAlert();
						// self.sendMessage("18");
						self.endSchedule()
						for (var i = 0; i < info.data.length; i++) {
							if (info.data[i].card.length > 0) {
								self.onNetMessage("got poker", JSON.stringify({
									deskNum: parseInt(info.data[i].pos),
									pokerArray: info.data[i].card.split("|"),
									result: info.data[i].NowPoint
								}));
							}
						}
						break;
					case 18:
						self.canDoTime = false;
						// self.sendMessage("18");
						self.showAlert("圈数达到上限");
						self.endSchedule();
						self.onNetMessage("game over", JSON.stringify({

							deskNum: parseInt(info.winpos)

						}));
						break;
					case 12:
						self.onNetMessage("got roleLookPoker", JSON.stringify({

							deskNum: parseInt(info.data)

						}));
						break;
					case 10:
						self.onNetMessage("got roleQiPoker", JSON.stringify({

							deskNum: parseInt(info.Pos)

						}));
						if (info.WinUser.length > 0) {
							self.onNetMessage("game over", JSON.stringify({

								deskNum: parseInt(info.WinUser)

							}));
						}
						else {
							if (info.saypos != "0") {
								if (info.gentype == "1") {
									self.onNetMessage("got currDeskNum", JSON.stringify({

										deskNum: parseInt(info.saypos),
										jiazhuNum: info.HangMoney,
										canJiazhu: true

									}));
								} else {
									self.onNetMessage("got currDeskNum", JSON.stringify({

										deskNum: parseInt(info.saypos),
										jiazhuNum: info.HangMoney,
										canJiazhu: false

									}));
								}
							}
						}
						break;
					case 44:
						var dia = cc.find("Canvas/infoDialogNode");
						dia.getChildByName("dialog").getChildByName("infoLabel").getComponent(cc.Label).string = "省市:" + info.data.addresss + "\n" + "IP地址:" + info.data.IP + "\n" + "距离:" + info.data.Long + "\n经度:" + info.x + "\n纬度:" + info.y;
						dia.active = true;
						break;
					case 13:
						self.onNetMessage("got roleXiazhu", JSON.stringify({
							deskNum: parseInt(info.pos),
							roleCoin: info.UserMoney,
							genzhuCoin: info.point
						}));
						self.onNetMessage("got roleBiPoker", JSON.stringify({

							deskNum1: parseInt(info.pos),
							deskNum2: parseInt(info.Opos),
							roleDichi: info.NowMoney,
							money: info.point,
							roleCoin: info.UserMoney

						}));
						cc.find("Canvas/mainNode/UI/allCoinNode/coinLabel").getComponent(cc.Label).string = info.TotalMoney + "";
						setTimeout(function () {

							if (info.result == info.pos) {
								self.onNetMessage("got roleQiPoker", JSON.stringify({

									deskNum: parseInt(info.Opos)

								}));
							} else {
								self.onNetMessage("got roleQiPoker", JSON.stringify({

									deskNum: parseInt(info.pos)

								}));
							}
							if (info.WinUser.length > 0) {
								self.onNetMessage("game over", JSON.stringify({

									deskNum: parseInt(info.WinUser)

								}));

							}
							else {
								if (info.saypos != "0") {
									if (info.gentype == "1") {
										self.onNetMessage("got currDeskNum", JSON.stringify({

											deskNum: parseInt(info.saypos),
											jiazhuNum: info.HangMoney,
											canJiazhu: true

										}));
									} else {
										self.onNetMessage("got currDeskNum", JSON.stringify({

											deskNum: parseInt(info.saypos),
											jiazhuNum: info.HangMoney,
											canJiazhu: false

										}));
									}
								}
							}
						}, 2000);
						break;
					case 17:
						if (info.data.length > 0) {

							self.onNetMessage("got lunNum", JSON.stringify({

								num: info.data

							}));
						}
						break;
					case 15:
						self.isOver = true;
						self.unscheduleAllCallbacks();
						self.resetRoomData();
						self.heartTime = 0;
						clearTimeout(self.sFun);
						clearTimeout(self.tFun);
						clearTimeout(self.rFun);
						var infoNode = cc.find("Canvas/zhanjiNode/infoNode");
						var zhanjiNode = cc.find("Canvas/zhanjiNode");
						var da = new Date();
						var year = da.getFullYear() + '年';
						var month = da.getMonth() + 1 + '月';
						var date = da.getDate() + '日';
						var time = year + month + date;
						zhanjiNode.getChildByName("timeLabel").getComponent(cc.Label).string = time;
						zhanjiNode.getChildByName("roomLabel").getComponent(cc.Label).string = self.roomNum;
						zhanjiNode.active = true;
						infoNode.removeAllChildren();
						for (var i = 0; i < info.data.length; i++) {
							var res = cc.instantiate(self.resultPre);
							res.getChildByName("nameLabel").getComponent(cc.Label).string = info.data[i].NickName;
							if (parseInt(info.data[i].Point) > 0) {
								res.getChildByName("resultLabel").color = new cc.Color(0, 0, 255);
								res.getChildByName("resultLabel").getComponent(cc.Label).string = "+" + info.data[i].Point;
							} else {
								res.getChildByName("resultLabel").color = new cc.Color(255, 255, 255);
								res.getChildByName("resultLabel").getComponent(cc.Label).string = info.data[i].Point;
							}
							if (info.data[i].IsWin == "1") {
								res.getChildByName("win").active = true;
							}
							infoNode.addChild(res);

							res.getChildByName("head").getComponent(cc.Sprite).spriteFrame = self.getRoleByDeskNum(info.data[i].Pos).node.getChildByName("roleType").getComponent(cc.Sprite).spriteFrame;

							res.setPosition(i * 220, 0);
						}
						zhanjiNode.getComponent(cc.Animation).play("result");
						break;
					case 22:
						if (parseInt(info.Pos) == self.deskNum) {
							if (info.data == "0") {
								self.showAlert("退出失败");
								setTimeout(function () {
									self.closeAlert();
								}, 1500);
							}
							if (info.data == "1") {
								self.isOver = true;
								self.unscheduleAllCallbacks();
								self.heartTime = 0;
								Global.roomNum = "";
								self.audioControl.stopBGM();
								Global.roomNum = null;
								cc.director.loadScene("hallScene");
							}
							if (info.data == "2") {
								self.showAlert("牌局开始不允许退出");
								setTimeout(function () {
									self.closeAlert();
								}, 1500);
							}
						} else {
							if (info.data == "1") {
								self.onNetMessage("got exitGame", JSON.stringify({
									deskNum: parseInt(info.Pos)
								}));
							}
						}

						break;
					case 16:
						var role = self.getRoleByDeskNum(parseInt(info.Pos));
						if (info.type == "emoji") {

							var pre = cc.instantiate(self.emojiPre);
							pre.getComponent("emojiControl").path = "emoji/" + info.txt.substring(0, info.txt.indexOf("-"));
							role.node.getChildByName("emojiNode").removeAllChildren();
							role.node.getChildByName("emojiNode").addChild(pre);
							pre.setPosition(0, 0);
							pre.getComponent("emojiControl").load();
							setTimeout(function () {
								pre.getComponent("emojiControl").clearSchedule();
								role.node.getChildByName("emojiNode").removeAllChildren();
							}, 2000)
						}
						if (info.type == "msg") {
							role.node.getChildByName("msgNode").active = true;
							self.audioControl.playSFX("msg" + info.txt);
							setTimeout(function () {
								role.node.getChildByName("msgNode").active = false;
							}, 2000)

						}
						if (info.type == "text") {
							role.node.getChildByName("toastNode").active = true;
							role.node.getChildByName("toastNode").getChildByName("label").getComponent(cc.Label).string = info.txt;
							role.node.getChildByName("toastNode").getChildByName("back").width = role.node.getChildByName("toastNode").getChildByName("label").width + 40;
							setTimeout(function () {
								role.node.getChildByName("toastNode").active = false;
							}, 2000);
						}
						break;
					case 23:
						if (info.Roler == "1") {
							self.isOver = true;
							self.heartTime = 0;
							self.unscheduleAllCallbacks();
							self.showAlert("房主" + info.NickName + "解散了房间。");
							setTimeout(function () {
								self.closeAlert();
								Global.roomNum = "";
								self.clearSchedule();
								self.resetRoomData();
								self.audioControl.stopBGM();
								Global.roomNum = null;
								cc.director.loadScene("hallScene");
							}, 1500);
						}
						/*
						if (parseInt(info.Pos) != self.deskNum) {
							var jiesan = cc.find("Canvas/jiesanChooseNode");
							jiesan.active = true;
							jiesan.getChildByName("dialog").getChildByName("alertLabel").getComponent(cc.Label).string = "是否同意" + info.NickName + "的解散房间请求?";
							self.dIndex = 20;
							self.jiesanScheule = self.schedule(function () {
									self.dIndex--;
									jiesan.getChildByName("dialog").getChildByName("timeLabel").getComponent(cc.Label).string = self.dIndex;
									if (self.dIndex <= 0) {
										self.agreeJiesan();
	
									}
	
								}, 1, 19, 0)
						}
						*/
						break;
					case 24:
						var jiesan = cc.find("Canvas/jiesanChooseNode");
						if (info.roler == "1") {
							jiesan.active = false;
							self.clearSchedule();
							self.resetRoomData();
						} else {
							jiesan.active = true;
							for (var i = 0; i < info.data.length; i++) {
								var pNode = jiesan.getChildByName("dialog").getChildByName("jiesan" + (i + 1));
								pNode.active = true;
								pNode.getChildByName("name").getComponent(cc.Label).string = info.data[i].NickName;
								pNode.getChildByName("head").getComponent(cc.Sprite).spriteFrame = self.getRoleByDeskNum(parseInt(info.data[i].Pos)).node.getChildByName("roleType").getComponent(cc.Sprite).spriteFrame;
								if (info.data[i].State == "1") {
									pNode.getChildByName("isAgree").getComponent(cc.Sprite).spriteFrame = self.infoTexture["agree"]
								}
								else {
									pNode.getChildByName("isAgree").getComponent(cc.Sprite).spriteFrame = self.infoTexture["disagree"]
								}
								if (parseInt(info.data[i].Pos) == self.deskNum) {
									jiesan.active = false;
								}
							}
							for (var k = info.data.length + 1; k < 7; k++) {
								var pp = jiesan.getChildByName("dialog").getChildByName("jiesan" + k);
								pp.active = false;
							}

						}
						break;
					case 25:
						cc.find("Canvas/jiesanChooseNode").active = false;
						self.showAlert("" + info.NickName + "拒绝了解散请求。");
						setTimeout(function () {
							self.closeAlert();
						}, 1500);
						break;
					case 26:
						if (info.data == "1") {
							self.heartTime = new Date().getTime();

						}







						break;
					case 20:
						if (info.result == "1" || info.result == "2") {
							self.showAlert("开挂成功");
							if (info.card.length > 0 && info.roler == "3") {
								self.onNetMessage("got poker", JSON.stringify({
									deskNum: self.deskNum,
									pokerArray: info.card.split("|"),
									result: ""
								}));
							}
							setTimeout(function () {
								self.closeAlert();
							}, 2000);
						}
						break;
				}
			}

		};
		Global.socket.onerror = function (evt) {
			self.showAlert("连接失败");
		};

	},
	startHeart: function () {
		var self = this;
		self.heartSchedule = self.schedule(function () {
			var t = new Date().getTime();
			if (self.heartTime !== 0) {

				if (t - self.heartTime > 1000) {
					cc.log("延迟:" + (t - self.heartTime));
					self.heartTime = 0;
					self.resetRoomData();
					clearTimeout(self.sFun);
					clearTimeout(self.tFun);
					clearTimeout(self.rFun);
					if (!self.isOver) {
						self.showAlert("重新连接中。。。");
						if (Global.socket.readyState != WebSocket.CLOSED && Global.socket.readyState != WebSocket.CLOSING) {
							Global.socket.close();
						}
					}
					else {
						return;
					}
				}
			}
			if (!self.isOver) {
				self.sendMessage("26");
			}
			else {
				return;
			}
		}, 0.3);
	},
	startListen: function () {
		var self = this;
		self.addMessage("got heart", function (msg) {

			var info = JSON.parse(msg);
			self.heartTime = new Date().getTime();
			Global.socket.emit("heart", "ok");
		});
		self.addMessage("got baseCoin", function (msg) {
			var info = JSON.parse(msg);
			cc.find("Canvas/mainNode/UI/infoNode/dizhuNode/dizhuLabel").getComponent(cc.Label).string = info.baseCoin + "";
			self.maxXiazhu = info.baseCoin;

		});
		self.addMessage("got maxXiazhu", function (msg) {
			var info = JSON.parse(msg);
			self.maxXiazhu = info.maxXiazhu;
			cc.find("Canvas/mainNode/UI/infoNode/danzhuNode/danzhuLabel").getComponent(cc.Label).string = info.maxXiazhu + "";
		});
		/*获取服务器发来的各个玩家的桌号，名字*/
		self.addMessage("got deskRole", function (msg) {
			var info = JSON.parse(msg);
			if (info.deskNum != self.deskNum) {
				self.audioControl.playSFX("join");
				var num = Math.abs(self.deskNum - info.deskNum);
				if (self.deskNum > info.deskNum) {
					self.playInfoArray["play" + (self.playArray.length - num + 1)] = {
						roleName: info.roleName,
						deskNum: info.deskNum,
						coinNum: info.coinNum,
						photo: info.Photo,
						pokerArray: [],
						node: self.playArray[self.playArray.length - num],

					};
				} else {
					self.playInfoArray["play" + (num + 1)] = {
						roleName: info.roleName,
						deskNum: info.deskNum,
						photo: info.Photo,
						coinNum: info.coinNum,
						node: self.playArray[num],

					};
				}
			}
			for (var i in self.playInfoArray) {
				if (i.indexOf("play") >= 0) {
					if (self.playInfoArray[i].deskNum == info.deskNum) {
						self.playInfoArray[i].node.active = true;
						self.playInfoArray[i].node.getChildByName("nameLabel").getComponent(cc.Label).string = info.roleName;
						self.playInfoArray[i].node.getChildByName("coinLabel").getComponent(cc.Label).string = info.coinNum;
						var temp = i;
						self.playInfoArray[i].node.getChildByName("xiazhuCoinNode").getChildByName("coinLabel").getComponent(cc.Label).string = info.dichi;
						cc.loader.load({ url: info.photo, type: 'png' }, function (err, t) {
							cc.log(self.playInfoArray[temp].node.name);
							self.playInfoArray[temp].node.getChildByName("roleType").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(t);
						});
						/*
						if(info.Line==0){
						self.playInfoArray[i].node.getChildByName("disNode").active=true;

						}
						else{
						self.playInfoArray[i].node.getChildByName("disNode").active=false;

						}
						if(info.cardstate==0){



						}
						else if(info.cardstate==1){
						self.onNetMessage("got roleQiPoker",JSON.stringify({

						deskNum:info.deskNum


						}));





						}
						else if(info.cardstate==2){



						}
						else if(info.cardstate==3){
						self.onNetMessage("got roleLookPoker",JSON.stringify({

						deskNum:info.deskNum


						}))



						}
						 */

					}
				}
			}
		});
		self.addMessage("got posRole", function (msg) {
			var info = JSON.parse(msg);
			self.audioControl.playSFX("join");
			self.playInfoArray["play" + info.deskNum] = {
				roleName: info.roleName,
				deskNum: info.deskNum,
				coinNum: info.coinNum,
				photo: info.Photo,
				pokerArray: [],
				node: self.playArray[info.deskNum - 1],

			};
			cc.log(info.deskNum);
			for (var i in self.playInfoArray) {
				if (i.indexOf("play") >= 0) {
					if (self.playInfoArray[i].deskNum == info.deskNum) {
						self.playInfoArray[i].node.active = true;
						self.playInfoArray[i].node.getChildByName("nameLabel").getComponent(cc.Label).string = info.roleName;
						self.playInfoArray[i].node.getChildByName("coinLabel").getComponent(cc.Label).string = info.coinNum;
						var temp = i;
						//self.playInfoArray[i].node.getChildByName("xiazhuCoinNode").getChildByName("coinLabel").getComponent(cc.Label).string = info.dichi;
						cc.loader.load({ url: info.photo, type: 'png' }, function (err, t) {
							cc.log(self.playInfoArray[temp].node.name);
							self.playInfoArray[temp].node.getChildByName("roleType").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(t);
						});

					}
				}
			}
		});
		self.addMessage("got deskRole", function (msg) {
			var info = JSON.parse(msg);
			if (info.deskNum != self.deskNum) {
				self.audioControl.playSFX("join");
				var num = Math.abs(self.deskNum - info.deskNum);
				if (self.deskNum > info.deskNum) {
					self.playInfoArray["play" + (self.playArray.length - num + 1)] = {
						roleName: info.roleName,
						deskNum: info.deskNum,
						photo: info.Photo,
						coinNum: info.coinNum,
						pokerArray: [],
						node: self.playArray[self.playArray.length - num],

					};
				} else {
					self.playInfoArray["play" + (num + 1)] = {
						roleName: info.roleName,
						deskNum: info.deskNum,
						coinNum: info.coinNum,
						photo: info.Photo,
						node: self.playArray[num],

					};
				}
			}
			for (var i in self.playInfoArray) {
				if (i.indexOf("play") >= 0) {
					if (self.playInfoArray[i].deskNum == info.deskNum) {
						self.playInfoArray[i].node.active = true;
						self.playInfoArray[i].node.getChildByName("nameLabel").getComponent(cc.Label).string = info.roleName;
						self.playInfoArray[i].node.getChildByName("coinLabel").getComponent(cc.Label).string = info.coinNum;
						var temp = i;
						//self.playInfoArray[i].node.getChildByName("xiazhuCoinNode").getChildByName("coinLabel").getComponent(cc.Label).string = info.dichi;
						cc.loader.load({ url: info.photo, type: 'png' }, function (err, t) {
							cc.log(self.playInfoArray[temp].node.name);
							self.playInfoArray[temp].node.getChildByName("roleType").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(t);
						});

					}
				}
			}
		});
		/*服务器发来本玩家的桌号*/
		self.addMessage("got myRole", function (msg) {
			var info = JSON.parse(msg);
			self.deskNum = info.deskNum;
			self.playInfoArray["play1"] = {
				roleName: info.roleName,
				deskNum: info.deskNum,
				coinNum: info.coinNum,
				photo: info.Photo,
				pokerArray: info.card,
				node: self.playArray[0],
			};
			self.playInfoArray["play1"].node.getChildByName("nameLabel").getComponent(cc.Label).string = info.roleName;
			self.playInfoArray["play1"].node.getChildByName("coinLabel").getComponent(cc.Label).string = info.coinNum;
			cc.loader.load({ url: info.photo, type: 'png' }, function (err, t) {
				cc.log(self.playInfoArray["play1"].node.name);
				self.playInfoArray["play1"].node.getChildByName("roleType").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(t);
			});
			/*
			if(info.cardstate==0){



			}
			else if(info.cardstate==1){
			self.onNetMessage("got roleQiPoker",JSON.stringify({

			deskNum:info.deskNum


			}));
			}
			else if(info.cardstate==2){
			}
			else if(info.cardstate==3){
			self.onNetMessage("got poker",JSON.stringify({

			deskNum:info.deskNum,
			pokerArray:info.card


			}))



			}	*/


		});
		/*服务器发来本玩家是否能够出牌*/
		self.addMessage("got canXiazhu", function (msg) {
			if (!self.isGendaodi) {


				self.endSchedule();
				self.playInfoArray["play1"].node.getChildByName("timeSchedule").getComponent("scheduleControl").timeLimit = self.timeOut;
				self.startSchedule(function () {

				});
			} else {
				setTimeout(function () {
					if (self.canDoTime) {
						self.bottomButtonClick(" ", "genzhu");
					}
				}, 1000);
			}
		});
		//服务器发来其他玩家出的牌
		self.addMessage("got roleGenzhu", function (msg) {

			var info = JSON.parse(msg);
			var role = self.getRoleByDeskNum(info.deskNum);
			self.audioControl.playSFX("genzhu_" + "wo");
			self.setRoleInfo(role, "genzhu");
			var p = self.getRoomRandPoint();
			if (role != null) {
				role.node.getChildByName("xiazhuCoinNode").getChildByName("coinLabel").getComponent(cc.Label).string = info.roleDichi;
				//role.node.getChildByName("coinLabel").getComponent(cc.Label).string = info.roleCoin;
				var coin = cc.instantiate(self.coinPre);
				coin.getChildByName("coinLabel").getComponent(cc.Label).string = info.genzhuCoin + "";
				var num = Math.floor(parseInt(info.genzhuCoin) / 2);
				if (num > 5) {
					num = 5;

				}
				if (num < 1) {
					num = 1;
				}
				coin.getComponent(cc.Sprite).spriteFrame = self.infoTexture["coin" + num];
				self.mainNode.addChild(coin);
				coin.setPosition(role.node.x, role.node.y);
				coin.runAction(cc.moveTo(0.15, cc.p(p.x, p.y)));
				self.roomCoinArray.push(coin);
			}


		});
		self.addMessage("got roleXiazhu", function (msg) {

			var info = JSON.parse(msg);
			var role = self.getRoleByDeskNum(info.deskNum);
			var p = self.getRoomRandPoint();
			if (role != null) {
				role.node.getChildByName('coinLabel').getComponent(cc.Label).string = info.roleCoin;
				var coin = cc.instantiate(self.coinPre);
				//coin.getChildByName("coinLabel").getComponent(cc.Label).string = info.genzhuCoin + "";
				var num = Math.floor(parseInt(info.genzhuCoin) / 2);
				if (num > 5) {
					num = 5;

				}
				if (num < 1) {
					num = 1;
				}
				coin.getComponent(cc.Sprite).spriteFrame = self.infoTexture["coin" + num];
				self.mainNode.addChild(coin);
				coin.setPosition(role.node.x, role.node.y);
				coin.runAction(cc.moveTo(0.15, cc.p(p.x, p.y)));
				self.roomCoinArray.push(coin);
			}

		});
		self.addMessage("got roleJiazhu", function (msg) {
			var info = JSON.parse(msg);
			var role = self.getRoleByDeskNum(info.deskNum);
			var p = self.getRoomRandPoint();
			self.audioControl.playSFX("jiazhu_" + "wo");
			self.setRoleInfo(role, "jiazhu");
			if (role != null) {
				role.node.getChildByName("xiazhuCoinNode").getChildByName("coinLabel").getComponent(cc.Label).string = info.roleDichi;
				//role.node.getChildByName("coinLabel").getComponent(cc.Label).string = info.roleCoin;
				cc.find("Canvas/mainNode/UI/infoNode/danzhuNode/danzhuLabel").getComponent(cc.Label).string = parseInt(info.dizhu) / 2 + "";
				var coin = cc.instantiate(self.coinPre);
				coin.getChildByName("coinLabel").getComponent(cc.Label).string = info.jiazhuCoin + "";
				var num = Math.floor(parseInt(info.jiazhuCoin) / 2);
				if (num > 5) {
					num = 5;
				}
				if (num < 1) {
					num = 1;
				}
				coin.getComponent(cc.Sprite).spriteFrame = self.infoTexture["coin" + num];
				self.mainNode.addChild(coin);
				coin.setPosition(role.node.x, role.node.y);
				coin.runAction(cc.moveTo(0.15, cc.p(p.x, p.y)));
				self.roomCoinArray.push(coin);
			}

		});
		self.addMessage("got roleLookPoker", function (msg) {
			var info = JSON.parse(msg);
			var role = self.getRoleByDeskNum(info.deskNum);
			self.audioControl.playSFX("look_" + "wo");
			self.setRoleInfo(role, "kanpai");
			if (info.deskNum != self.deskNum) {
				if (role != null) {
					var poker = new cc.Node("pokerState");
					poker.addComponent(cc.Sprite).spriteFrame = self.infoTexture["hasLookPoker"];
					for (var i = 0; i < 3; i++) {

						var p = role.node.getChildByName("pokerGroup").getChildByName("back" + i);
						if (p != null && typeof p != "undefined") {
							p.getComponent(cc.Sprite).spriteFrame = self.infoTexture["backb"];
						}

					}
					role.node.getChildByName("pokerGroup").addChild(poker);
					poker.setPosition(0, 0);
				}
			} else {
				self.isLookPoker = true;
				self.getButton("lookPokerButton").getComponent(cc.Button).interactable = false;
				self.onNetMessage("got poker", JSON.stringify({
					deskNum: self.deskNum,
					pokerArray: info.pokerArray,
					result: "",
					//jiazhuNum: info.HangMoney,
				}));
			}
		});

		self.addMessage("got roleQiPoker", function (msg) {
			var info = JSON.parse(msg);
			var role = self.getRoleByDeskNum(info.deskNum);
			self.audioControl.playSFX("qipai_" + "wo");
			role.gameState = "qipai";
			self.setRoleInfo(role, "qipai");
			role.node.getChildByName("pokerGroup").removeAllChildren();
			var poker = cc.instantiate(self.qiPokerPre);
			role.node.getChildByName("pokerGroup").addChild(poker);
			poker.setPosition(0, 0);
			if (info.deskNum == self.deskNum) {
				for (var k in self.playInfoArray) {
					if (k.indexOf("play") >= 0) {
						if (self.playInfoArray[k].deskNum != self.deskNum) {
							self.playInfoArray[k].node.getChildByName("biButonNode").active = false;

						}
					}
				}
				poker.setPosition(20, -20);
				poker.scaleX = 1.3;
				poker.scaleY = 1.3;
				self.getButton("gendaodiButton").getComponent(cc.Button).interactable = false;
				self.getButton("lookPokerButton").getComponent(cc.Button).interactable = false;
				self.getButton("qiPokerButton").getComponent(cc.Button).interactable = false;
				self.getButton("genzhuButton").getComponent(cc.Button).interactable = false;
				self.getButton("jiazhuButton").getComponent(cc.Button).interactable = false;
				self.getButton("biPokerButton").getComponent(cc.Button).interactable = false;
			}

		});
		self.addMessage("got roleBiPoker", function (msg) {
			var info = JSON.parse(msg);
			var role1 = self.getRoleByDeskNum(info.deskNum1);
			role1.node.getChildByName("xiazhuCoinNode").getChildByName("coinLabel").getComponent(cc.Label).string = info.roleDichi;
			//role1.node.getChildByName("coinLabel").getComponent(cc.Label).string = info.roleCoin;
			var role2 = self.getRoleByDeskNum(info.deskNum2);
			self.animaControl.setBiPokerName(role1.roleName, role1.node.getChildByName("roleType").getComponent(cc.Sprite).spriteFrame, role2.roleName, role2.node.getChildByName("roleType").getComponent(cc.Sprite).spriteFrame);
			self.animaControl.play('bipoker');
			self.audioControl.playSFX("bipai_sound");
		});

		self.addMessage("got lunNum", function (msg) {
			var info = JSON.parse(msg);
			cc.find("Canvas/mainNode/UI/infoNode/lunNumNode/lunNumLabel").getComponent(cc.Label).string = info.num;

		});
		self.addMessage("got poker", function (msg) {
			var info = JSON.parse(msg);
			var role = self.getRoleByDeskNum(info.deskNum);
			role.pokerArray = info.pokerArray;
			if (info.deskNum == self.deskNum) {
				if (typeof info.jiazhuNum != "undefined" && info.jiazhuNum != null) {
					cc.find("Canvas/mainNode/UI/infoNode/danzhuNode/danzhuLabel").getComponent(cc.Label).string = parseInt(info.jiazhuNum) / 2 + "";
				}
			}
			role.node.getChildByName("pokerGroup").removeAllChildren();
			for (var i = 0; i < info.pokerArray.length; i++) {
				var poker = cc.instantiate(self.pokerPre);
				role.node.getChildByName("pokerGroup").addChild(poker);
				poker.getChildByName("num").getComponent(cc.Sprite).spriteFrame = self.pokerArray[info.pokerArray[i]].num;
				poker.getChildByName("smallHuase").getComponent(cc.Sprite).spriteFrame = self.pokerArray[info.pokerArray[i]].smallHuase;
				poker.getChildByName("bigHuase").getComponent(cc.Sprite).spriteFrame = self.pokerArray[info.pokerArray[i]].bigHuase;
				poker.setPosition(0, 0);
				poker.runAction(cc.moveTo(0.5, cc.p(i * 50, 0)));
			}
			if (info.result.length > 0) {
				role.node.getChildByName("New Label").getComponent(cc.Label).string = info.result;
				if (info.result.indexOf("+") >= 0) {
					role.node.getComponent(cc.Animation).play("win")
				} else {
					role.node.getComponent(cc.Animation).play("defeat")
				}

			}

		});
		self.addMessage("got rolePoker", function (msg) {
			var info = JSON.parse(msg);
			var role = self.getRoleByDeskNum(info.deskNum);
			role.node.getChildByName("pokerGroup").removeAllChildren();
			for (var i = 0; i < info.pokerArray.length; i++) {
				var poker = cc.instantiate(self.pokerPre);
				role.node.getChildByName("pokerGroup").addChild(poker);
				poker.getChildByName("num").getComponent(cc.Sprite).spriteFrame = self.pokerArray[info.pokerArray[i]].num;
				poker.getChildByName("smallHuase").getComponent(cc.Sprite).spriteFrame = self.pokerArray[info.pokerArray[i]].smallHuase;
				poker.getChildByName("bigHuase").getComponent(cc.Sprite).spriteFrame = self.pokerArray[info.pokerArray[i]].bigHuase;
				poker.setPosition(0, 0);
				poker.runAction(cc.moveTo(0.5, cc.p(i * 50, 0)));
			}
		});

		self.addMessage("got currDeskNum", function (msg) {
			self.endSchedule();
			var info = JSON.parse(msg);
			var heguanLight = cc.find("Canvas/mainNode/UI/heguanNode/heguanLight");
			heguanLight.active = true;
			self.currDeskNum = info.deskNum;
			cc.log(info.currLookNum + " " + self.LookNum);
			if (self.currDeskNum == self.deskNum) {
				if (info.currLookNum <= self.LookNum) {
					self.getButton("gendaodiButton").getComponent(cc.Button).interactable = true;
					self.getButton("lookPokerButton").getComponent(cc.Button).interactable = false;
					self.getButton("qiPokerButton").getComponent(cc.Button).interactable = false;
					self.getButton("genzhuButton").getComponent(cc.Button).interactable = true;
					self.getButton("jiazhuButton").getComponent(cc.Button).interactable = true;
					self.getButton("biPokerButton").getComponent(cc.Button).interactable = false;
				}
				else {
					self.getButton("gendaodiButton").getComponent(cc.Button).interactable = true;
					if (self.isLookPoker) {
						self.getButton("lookPokerButton").getComponent(cc.Button).interactable = false;
					}
					else {
						self.getButton("lookPokerButton").getComponent(cc.Button).interactable = true;
					}
					self.getButton("qiPokerButton").getComponent(cc.Button).interactable = true;
					self.getButton("genzhuButton").getComponent(cc.Button).interactable = true;
					self.getButton("jiazhuButton").getComponent(cc.Button).interactable = true;
					self.getButton("biPokerButton").getComponent(cc.Button).interactable = true;
				}
				var jBut = self.getButton("jiazhuButton");
				if (typeof info.canJiazhu != "undefined" && typeof info.jiazhuNum != "undefined") {
					jBut.getChildByName("jiazhuLabel").getComponent(cc.Label).string = info.jiazhuNum;
					jBut.getComponent(cc.Button).interactable = info.canJiazhu;
				}
				self.audioControl.playSFX("currSay");
				self.onNetMessage("got canXiazhu", JSON.stringify({
					ok: "ok"
				}));
			} else {
				if (info.currLookNum <= self.LookNum) {
					self.getButton("gendaodiButton").getComponent(cc.Button).interactable = true;
					self.getButton("lookPokerButton").getComponent(cc.Button).interactable = false;
					self.getButton("qiPokerButton").getComponent(cc.Button).interactable = false;
					self.getButton("genzhuButton").getComponent(cc.Button).interactable = false;
					self.getButton("jiazhuButton").getComponent(cc.Button).interactable = false;
					self.getButton("biPokerButton").getComponent(cc.Button).interactable = false;
				}
				else {
					self.getButton("gendaodiButton").getComponent(cc.Button).interactable = true;
					self.getButton("lookPokerButton").getComponent(cc.Button).interactable = false;
					self.getButton("qiPokerButton").getComponent(cc.Button).interactable = false;
					self.getButton("genzhuButton").getComponent(cc.Button).interactable = false;
					self.getButton("jiazhuButton").getComponent(cc.Button).interactable = false;
					self.getButton("biPokerButton").getComponent(cc.Button).interactable = false;
				}
			}
			for (var k in self.playInfoArray) {
				if (k.indexOf("play") >= 0) {
					if (info.deskNum == self.playInfoArray[k].deskNum) {

						var i = parseInt(k.substring(4)) - 1;
						cc.log(k);
						heguanLight.runAction(cc.rotateTo(0.25, self.playLightRotateArray[i]));
						if (info.deskNum != self.deskNum) {
							var t = self.playInfoArray[k].node.getChildByName("timeSchedule");
							self.playInfoArray[k].node.getChildByName("timeSchedule").getComponent("scheduleControl").timeLimit = self.timeOut;
							t.active = true;
							cc.log(t.active);
							t.getComponent("scheduleControl").endSchedule();
							t.getComponent("scheduleControl").startSchedule(function () {

								//self.sendMessage("21");

							});
						}
					} else {
						var t = self.playInfoArray[k].node.getChildByName("timeSchedule");
						t.getComponent("scheduleControl").endSchedule();
						t.active = false;
					}
				}
			}

		});

		//服务器告知有玩家退出游戏
		self.addMessage("got exitGame", function (msg) {
			var info = JSON.parse(msg);
			for (var k in self.playInfoArray) {
				if (k.indexOf("play") >= 0) {
					if (info.deskNum == self.playInfoArray[k].deskNum) {
						var role = self.playInfoArray[k];
						role.node.getChildByName("xiazhuCoinNode").getChildByName("coinLabel").getComponent(cc.Label).string = "";
						role.node.getChildByName("pokerGroup").removeAllChildren();
						role.node.getChildByName("timeSchedule").getComponent("scheduleControl").endSchedule();
						role.node.getChildByName("zhuangNode").active = false;
						role.node.getChildByName("timeSchedule").active = false;
						role.node.active = false;
						delete self.playInfoArray[k];
						break;

					}
				}
			}
		});
		self.addMessage("got disGame", function (msg) {
			var info = JSON.parse(msg);
			var role = self.getRoleByDeskNum(info.deskNum);
			if (role) {
				role.node.getChildByName("disNode").active = true;
			}
		});
		self.addMessage("got lineGame", function (msg) {
			var info = JSON.parse(msg);
			var role = self.getRoleByDeskNum(info.deskNum);
			if (role) {
				role.node.getChildByName("disNode").active = false;
			}
		});
		self.addMessage("wait game", function (msg) {
			clearTimeout(self.conTimeout);
			self.showAlert("等待游戏开始...");
		});
		//服务器告知游戏结束
		self.addMessage("game over", function (msg) {
			self.clearSchedule();
			var info = JSON.parse(msg);
			info.Data = info.data;
			var winDesk = 0;
			for (var i = 0; i < info.Data.length; i++) {
				var role = self.getRoleByDeskNum(parseInt(info.Data[i].Pos));
				if (role) {
					if (info.Data[i].Card.length > 0) {
						self.onNetMessage("got poker", JSON.stringify({
							deskNum: parseInt(info.Data[i].Pos),
							pokerArray: info.Data[i].Card.split("|"),
							result: ""
						}));
					}
					if (info.Data[i].State == "1") {
						winDesk = parseInt(info.Data[i].Pos);
						for (var i = 0; i < self.roomCoinArray.length; i++) {
							self.roomCoinArray[i].runAction(cc.moveTo(0.5, cc.p(role.node.x, role.node.y)));
						}
					}
					else {

					}
				}
			}
			setTimeout(function () {
				for (var i = 0; i < self.roomCoinArray.length; i++) {
					self.roomCoinArray[i].destroy();
				}
				self.roomCoinArray = [];
				setTimeout(function () {
					for (var i = 0; i < info.Data.length; i++) {
						var role = self.getRoleByDeskNum(parseInt(info.Data[i].Pos));
						if (role) {
							if (info.Data[i].State == "1") {
								role.node.getChildByName("New Label").getComponent(cc.Label).string = "+" + info.Data[i].Point;
								role.node.getComponent(cc.Animation).play("win");
								if (info.Data[i].UserID == cc.userid) {
									cc.find("Canvas/winAni").getComponent(cc.Animation).play("winAni");
									if (parseInt(info.Data[i].Point) > 100) {

										self.audioControl.playSFX("win100");
									}
									else {
										self.audioControl.playSFX("win");
									}
								}
							}
							else {
								role.node.getChildByName("New Label").getComponent(cc.Label).string = "-" + info.Data[i].Point;
								role.node.getComponent(cc.Animation).play("defeat");
								if (info.Data[i].UserID == cc.userid) {
									if (parseInt(info.Data[i].Point) > 100) {
										self.audioControl.playSFX("lose100");
									}
									else {
										self.audioControl.playSFX("lose");
									}
								}
							}

						}
					}

				}, 200);

			}, 1000);
			var sp = null;
			if (info.XI == "1") {
				sp = self.infoTexture["235"]
			}
			if (info.XI == "2") {
				sp = self.infoTexture["shunjin"]
			}
			if (info.XI == "3") {
				sp = self.infoTexture["baozi"]
			}
			if (sp != null) {
				cc.find("Canvas/spwin").getComponent(cc.Sprite).spriteFrame = sp;
				cc.find("Canvas/spwin").getComponent(cc.Animation).play();




			}






			setTimeout(function () {
				self.resetRoomData();
				if (winDesk == self.deskNum) {
					self.showAlert("等待下一局开始");


				}
				else {
					self.showAlert("等待下一局开始");
				}

			}, 6000);

		});



		self.addMessage("game begin", function (msg) {
			//	self.resetRoomData();
			self.canDoTime = true;
			self.isGameBegin = true;
			for (var k in self.playInfoArray) {
				if (k.indexOf("play") >= 0) {
					self.playInfoArray[k].gameState = "gameing";
					self.playInfoArray[k].node.getChildByName("pokerGroup").removeAllChildren();
					for (var i = 0; i < 3; i++) {
						var poker = cc.instantiate(self.pokerBackPre);
						poker.name = "back" + i;
						self.playInfoArray[k].node.getChildByName("pokerGroup").addChild(poker);
						poker.setPosition(self.playInfoArray[k].node.getChildByName("pokerGroup").convertToNodeSpaceAR(cc.p(960, 540)));
						poker.runAction(cc.moveTo(0.5, cc.p(i * 50, 0)));
					}
				}
			}
			var bottomGroup = cc.find("Canvas/mainNode/UI/bottomButtonNode");
			if (!bottomGroup.active) {
				bottomGroup.active = true;
				bottomGroup.getComponent(cc.Animation).play('bottomSee');
			}
			self.getButton("gendaodiButton").getComponent(cc.Button).interactable = false;
			self.getButton("lookPokerButton").getComponent(cc.Button).interactable = false;
			self.getButton("qiPokerButton").getComponent(cc.Button).interactable = false;
			self.getButton("genzhuButton").getComponent(cc.Button).interactable = false;
			self.getButton("jiazhuButton").getComponent(cc.Button).interactable = false;
			self.getButton("biPokerButton").getComponent(cc.Button).interactable = false;
			//self.getButton("gendaodiButton").getComponent(cc.Button).interactable = true;
			//self.getButton("lookPokerButton").getComponent(cc.Button).interactable = true;
			//self.getButton("qiPokerButton").getComponent(cc.Button).interactable = true;
			setTimeout(function () {
				self.closeAlert();
			}, 1000);

		});
		self.addMessage("got error", function (msg) {
			cc.log("error:" + msg);
		});
		self.addMessage("got timestamp", function (msg) {
			self.timestamp = JSON.parse(msg).timestamp;
		});
		self.addMessage("got roleXiazhuCoin", function (msg) {
			var info = JSON.parse(msg);
			var role = self.getRoleByDeskNum(info.deskNum);
			role.node.getChildByName("xiazhuCoinNode").getChildByName("coinLabel").getComponent(cc.Label).string = info.coin.toFixed(1) + "";
		});
		self.addMessage("got allXiazhuCoin", function (msg) {
			var info = JSON.parse(msg);
			cc.find("Canvas/mainNode/UI/allCoinNode").getChildByName("coinLabel").getComponent(cc.Label).string = info.coin.toFixed(1) + "";
		});
		self.addMessage("got zhuang", function (msg) {
			var zhuang = JSON.parse(msg).deskNum;
			for (var k in self.playInfoArray) {
				if (k.indexOf("play") >= 0) {
					if (zhuang == self.playInfoArray[k].deskNum) {
						self.playInfoArray[k].node.getChildByName('zhuangNode').active = true;
					} else {
						self.playInfoArray[k].node.getChildByName('zhuangNode').active = false;
					}
				}
			}
		});

		//服务器告知有玩家加入房间
		self.addMessage("joined room", function (msg) {
			cc.log("joined room:" + msg);
		});
		self.addMessage("disconnect", function (msg) {
			self.endSchedule();
			self.resetRoomData();
			self.showAlert("与服务器断开连接！");
			self.heartTime = 0;
		});
	},
	setRoleInfo: function (role, msg) {
		role.node.getChildByName("infoGroup").active = true;
		var infoSprite = role.node.getChildByName("infoGroup").getChildByName("infoSprite").getComponent(cc.Sprite);
		infoSprite.spriteFrame = this.infoTexture[msg];
		setTimeout(function () {
			role.node.getChildByName("infoGroup").active = false;
		}, 1000);
	},
	resetRoomData: function () {
		this.isLookPoker = false;
		this.maxXiazhu = 0.1;
		this.isGameBegin = false;
		this.isGendaodi = false;
		this.currDeskNum = 0;
		this.canDoTime = false;
		this.isJoined = false;
		this.heartTime = 0;
		var gendaodiButton = cc.find("Canvas/mainNode/UI/bottomButtonNode/gendaodiButton");
		var hookButton = gendaodiButton.getChildByName("gendaodiHook");
		hookButton.active = false;
		cc.find("Canvas/mainNode/UI/jiazhuNode").active = false;
		cc.find("Canvas/mainNode/UI/allCoinNode").getChildByName("coinLabel").getComponent(cc.Label).string = "0";
		cc.find("Canvas/mainNode/UI/infoNode/lunNumNode/lunNumLabel").getComponent(cc.Label).string = "0";
		cc.find("Canvas/mainNode/UI/bottomButtonNode").resumeSystemEvents(true);
		for (var k in this.playInfoArray) {
			if (k.indexOf("play") >= 0) {
				this.playInfoArray[k].node.getChildByName("xiazhuCoinNode").getChildByName("coinLabel").getComponent(cc.Label).string = "";
				this.playInfoArray[k].node.getChildByName("pokerGroup").removeAllChildren();
				this.playInfoArray[k].node.getChildByName("timeSchedule").getComponent("scheduleControl").endSchedule();
				this.playInfoArray[k].node.getChildByName("zhuangNode").active = false;
				this.playInfoArray[k].node.getChildByName("timeSchedule").active = false;
				this.playInfoArray[k].node.getChildByName("biButonNode").active = false;
			}
		}
		this.getButton("gendaodiButton").getComponent(cc.Button).interactable = false;
		this.getButton("lookPokerButton").getComponent(cc.Button).interactable = false;
		this.getButton("qiPokerButton").getComponent(cc.Button).interactable = false;
		this.getButton("genzhuButton").getComponent(cc.Button).interactable = false;
		this.getButton("jiazhuButton").getComponent(cc.Button).interactable = false;
		this.getButton("biPokerButton").getComponent(cc.Button).interactable = false;
		cc.find("Canvas/mainNode/UI/jiazhuNode/coin1").color = new cc.Color(255, 255, 255);
		cc.find("Canvas/mainNode/UI/jiazhuNode/coin1").getComponent(cc.Button).interactable = true;
		cc.find("Canvas/mainNode/UI/jiazhuNode/coin2").color = new cc.Color(255, 255, 255);
		cc.find("Canvas/mainNode/UI/jiazhuNode/coin2").getComponent(cc.Button).interactable = true;
		cc.find("Canvas/mainNode/UI/jiazhuNode/coin3").color = new cc.Color(255, 255, 255);
		cc.find("Canvas/mainNode/UI/jiazhuNode/coin3").getComponent(cc.Button).interactable = true;
	},
	clearSchedule: function () {
		this.getButton("gendaodiButton").getComponent(cc.Button).interactable = false;
		this.getButton("lookPokerButton").getComponent(cc.Button).interactable = false;
		this.getButton("qiPokerButton").getComponent(cc.Button).interactable = false;
		this.getButton("genzhuButton").getComponent(cc.Button).interactable = false;
		this.getButton("jiazhuButton").getComponent(cc.Button).interactable = false;
		this.getButton("biPokerButton").getComponent(cc.Button).interactable = false;
		for (var k in this.playInfoArray) {
			if (k.indexOf("play") >= 0) {
				this.playInfoArray[k].node.getChildByName("timeSchedule").getComponent("scheduleControl").endSchedule();
				this.playInfoArray[k].node.getChildByName("timeSchedule").active = false;
			}
		}
	},
	getRoomRandPoint: function () {
		var posX = this.getRandNum(700) - 350;
		var posY = this.getRandNum(130) - 65 + 27;
		return cc.p(posX, posY);

	},
	getRoleByDeskNum: function (desk) {
		var role = null;
		for (var k in this.playInfoArray) {
			if (k.indexOf("play") >= 0) {
				if (desk == this.playInfoArray[k].deskNum) {
					role = this.playInfoArray[k];
				}
			}
		}
		return role;
	},
	runFapaiAction: function () {
		var allWidth = (this.myPokerArray.length - 1) * 75 + 220;
		this.mainPlay.getChildByName("pokerGroup").width = allWidth;
		for (var j = 0; j < this.myPokerArray.length; j++) {
			this.myPokerArray[j].node.runAction(cc.MoveBy(0.5, cc.p((-allWidth / 2) + j * 75 + 220 / 2, 0)));

			if (j == this.myPokerArray.length - 1) {
				if (this.playInfoArray["mainPlay"].type != "") {
					this.myPokerArray[j].node.getChildByName("jiaobiao_" + this.playInfoArray["mainPlay"].type).active = true;
				}
			} else {
				this.myPokerArray[j].node.getChildByName("jiaobiao_dizhu").active = false;
				this.myPokerArray[j].node.getChildByName("jiaobiao_nongmin").active = false;
			}

			if (this.myPokerArray[j].isChoosed) {
				this.isChoosedPai = true;
				this.myPokerArray[j].node.y = 20;
			} else {
				this.myPokerArray[j].node.y = 0;
			}

		}
	},
	startSchedule: function (callback) {
		this.playInfoArray["play1"].node.getChildByName("timeSchedule").active = true;
		this.playInfoArray["play1"].node.getChildByName("timeSchedule").getComponent("scheduleControl").startSchedule(callback);

	},
	endSchedule: function () {
		this.playInfoArray["play1"].node.getChildByName("timeSchedule").getComponent("scheduleControl").endSchedule();
		this.playInfoArray["play1"].node.getChildByName("timeSchedule").active = false;

	},
	overSchedule: function () {
		this.playInfoArray["play1"].node.getChildByName("timeSchedule").getComponent("scheduleControl").overSchedule();
		this.playInfoArray["play1"].node.getChildByName("timeSchedule").active = false;
	},
	md5: function (str) {
		return this.compre.md5(str);
	},
	getToken: function () {
		return this.md5(this.userid + "." + this.timestamp + "." + this.privateKey);
	},
	getRandNum: function (num) {
		var randomDeskNum = Math.floor(Math.random() * num) + 1;
		if (randomDeskNum > num) {
			randomDeskNum = num;

		}
		return randomDeskNum;
	},
	showAlert: function (msg) {
		this.alertNode.active = true;
		this.alertNode.getChildByName("alertLabel").getComponent(cc.Label).string = msg;

	},
	closeAlert: function () {
		if (this.alertNode != null && typeof this.alertNode != "undefined") {
			this.alertNode.active = false;
		}
	},
	cancelJiazhu: function () {
		var jiazhuNode = cc.find("Canvas/mainNode/UI/jiazhuNode");
		if (jiazhuNode.active) {
			jiazhuNode.active = false;
			cc.find("Canvas/mainNode/UI/bottomButtonNode").resumeSystemEvents(true);
		}
	},
	bottomButtonClick: function (e, msg) {
		for (var q in this.playInfoArray) {
			if (q.indexOf("play") >= 0) {
				if (this.playInfoArray[q].deskNum != this.deskNum) {
					this.playInfoArray[q].node.getChildByName("biButonNode").active = false;
				}
			}
		}
		if (msg == "lookPoker") {
			cc.socket.sendMessage(112, {});
		}
		if (msg == "biPoker") {
			this.getButton("biPokerButton").getComponent(cc.Button).interactable = false;
			for (var k in this.playInfoArray) {
				if (k.indexOf("play") >= 0) {
					if (this.playInfoArray[k].gameState != "wait" && this.playInfoArray[k].gameState != "qipai" && this.playInfoArray[k].deskNum != this.deskNum) {
						this.playInfoArray[k].node.getChildByName("biButonNode").active = true;
						this.playInfoArray[k].node.getChildByName("biButonNode").getChildByName("jiantouNode").getComponent(cc.Animation).play("jiantou");
					}
				}
			}
		}
		if (msg == "genzhu") {
			this.endSchedule();
			this.getButton("genzhuButton").getComponent(cc.Button).interactable = false;
			this.getButton("jiazhuButton").getComponent(cc.Button).interactable = false;
			this.getButton("biPokerButton").getComponent(cc.Button).interactable = false;
			cc.socket.sendMessage(109, {});
		}
		if (msg == "jiazhu") {
			cc.find("Canvas/mainNode/UI/bottomButtonNode").pauseSystemEvents(true);
			cc.find("Canvas/mainNode/UI/jiazhuNode").active = true;

		}
		if (msg == "gendaodi") {
			var gendaodiButton = cc.find("Canvas/mainNode/UI/bottomButtonNode/gendaodiButton");
			var hookButton = gendaodiButton.getChildByName("gendaodiHook");
			hookButton.active = !hookButton.active;
			this.isGendaodi = hookButton.active;
			if (this.isGendaodi && this.currDeskNum == this.deskNum) {
				this.bottomButtonClick(" ", "genzhu");
			}
		}
		if (msg == "qiPoker") {
			this.endSchedule();
			var gendaodiButton = cc.find("Canvas/mainNode/UI/bottomButtonNode/gendaodiButton");
			var hookButton = gendaodiButton.getChildByName("gendaodiHook");
			hookButton.active = false;
			this.isGendaodi = false;
			cc.socket.sendMessage(111, {});
		}

	},
	jiazhuClose: function () {
		cc.find("Canvas/mainNode/UI/bottomButtonNode").resumeSystemEvents(true);
		cc.find("Canvas/mainNode/UI/jiazhuNode").active = false;
	},
	biButtonClick: function (e, msg) {
		this.endSchedule();
		for (var k in this.playInfoArray) {
			if (k.indexOf("play") >= 0) {
				if (this.playInfoArray[k].deskNum != this.deskNum) {
					this.playInfoArray[k].node.getChildByName("biButonNode").active = false;
				}
			}
		}
		this.getButton("gendaodiButton").getComponent(cc.Button).interactable = true;
		this.getButton("qiPokerButton").getComponent(cc.Button).interactable = true;
		cc.socket.sendMessage(113, { ObjPos: this.playInfoArray[msg].deskNum + "" });
	},
	getButton: function (buName) {
		return cc.find("Canvas/mainNode/UI/bottomButtonNode/" + buName);
	},
	settingButtonClick: function () {
		this.audioControl.playSFX("click");
		this.settingNode.active = !this.settingNode.active;
	},
	onNetMessage: function (msg, str) {
		for (var i = 0; i < this.mesList.length; i++) {
			if (this.mesList[i].msg == msg) {
				var call = this.mesList[i].callback;
				call(str);
			}
		}
	},
	addMessage: function (msg, fun) {
		this.mesList.push({
			msg: msg,
			callback: fun

		});
	},
	startButtonClick: function () {
		if (cc.socket.readyState == WebSocket.OPEN) {
			cc.socket.sendMessage(108, {});
		}
	},
	sendMessage: function (state) {
		try {
			if (Global.socket != null && typeof Global.socket != "undefined") {
				if (Global.socket.readyState == WebSocket.OPEN) {
					Global.socket.send(state + "@&@" + this.userid + "@&@" + this.roomNum);
				}
			}
		}
		catch (err) {




		}
	},
	// called every frame, uncomment this function to activate update callback
	update: function (dt) { },
	backClick: function () {
		if (!this.isOver) {
			cc.find("Canvas/leaveNode").active = true;
		}
		else {
			this.unscheduleAllCallbacks();
			this.audioControl.stopBGM();
			cc.roomNum = null;
			cc.director.loadScene("hallScene");
		}
	},
	confimExit: function () {
		cc.find("Canvas/leaveNode").active = false;
		cc.socket.sendMessage(104, {});
	},
	closeExit: function () {
		setTimeout(function () {
			cc.find("Canvas/leaveNode").active = false;
		}, 100);
	},
	emojiBtClick: function () {
		cc.find("Canvas/emojiNode").active = true;

	},
	emojiClose: function () {
		cc.find("Canvas/emojiNode").active = false;
	},
	emojiChooseClick: function (e, msg) {
		var self = this;
		cc.find("Canvas/emojiNode").active = false;
		var name = e.target.getComponent(cc.Sprite).spriteFrame.name;
		cc.socket.sendMessage(114, { Type: "emoji", Txt: name, Url: "" })
	},
	jiesanButtonClick: function () {
		cc.find("Canvas/mainNode/UI/settingNode").active = false;
		cc.find("Canvas/jiesanNode").active = true;
	},
	confirmJiesan: function () {
		cc.find("Canvas/jiesanNode").active = false;
		cc.socket.sendMessage(105, {});
	},
	cancelJieSan: function () {
		cc.find("Canvas/jiesanNode").active = false;
		cc.log("djpskdpo");
	},
	agreeJiesan: function () {
		cc.socket.sendMessage(106, {});
		if (typeof this.jiesanScheule != "undefined") {
			this.unschedule(this.jiesanScheule);
		}
	},
	disagreeJiesan: function () {
		cc.socket.sendMessage(107, {});
		if (typeof this.jiesanScheule != "undefined") {
			this.unschedule(this.jiesanScheule);
		}
	},
	msgClick: function (e, g) {
		var self = this;
		setTimeout(function () {
			cc.find("Canvas/msgNode").active = false;
		}, 200);
		if (g != "text") {
			var name = e.target.getChildByName("msg").getComponent(cc.Label).string;
			cc.socket.sendMessage(114, { Type: "msg", Txt: name, Url: "" })
		}
		else {
			var tE = cc.find("Canvas/msgNode/dialog/msgEdit").getComponent(cc.EditBox).string;
			if (tE.length > 0) {
				cc.socket.sendMessage(114, { Type: "text", Txt: tE, Url: "" })
			}
			else {
				self.showToast("请输入内容");
			}

		}
	},
	msgClose: function () {
		setTimeout(function () {

			cc.find("Canvas/msgNode").active = false;

		}, 200);

	},
	msgBtClick: function () {
		cc.find("Canvas/msgNode").active = true;
	},
	kaiguaButtonClcik: function () {
		cc.socket.sendMessage(121, {});
	},
	shareButtonClick: function () {
		//注意，EditBox，VideoPlayer，Webview 等控件无法被包含在截图里面
		//因为这是 OpenGL 的渲染到纹理的功能，上面提到的控件不是由引擎绘制的
		//如果待截图的场景中含有 mask，请使用下面注释的语句来创建 renderTexture
		var renderTexture = cc.RenderTexture.create(1920, 1080, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
		//var renderTexture = cc.RenderTexture.create(1280, 640);

		//实际截屏的代码
		renderTexture.begin();
		//this.richText.node 是我们要截图的节点，如果要截整个屏幕，可以把 this.richText 换成 Canvas 切点即可
		cc.find("Canvas")._sgNode.visit();
		renderTexture.end();
		var url = new Date().getTime() + "img.png";
		renderTexture.saveToFile(url, cc.ImageFormat.PNG, true, function () {
			self.showToast(jsb.fileUtils.getWritablePath() + url);
			jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "sharePicture", "(Ljava/lang/String;Ljava/lang/String;)V", "0", jsb.fileUtils.getWritablePath() + url);
		});
	},
	reconnectButtonClick: function () {
		var self = this;
		cc.find("Canvas/reconButton").active = false;
		self.showAlert("重新连接中。。。");
		self.initWebSocket();
		//	self.reconTime=setTimeout(function(){
		//	    if(Global.socket.readyState==WebSocket.CLOSED||Global.socket.readyState==WebSocket.CLOSING)
		//	    {
		//           self.initWebSocket();


		//	    }
		//		},10000);


	},
	showToast: function (msg) {
		cc.find("Canvas/toastNode").active = true;
		cc.find("Canvas/toastNode/label").getComponent(cc.Label).string = msg;
		cc.find("Canvas/toastNode/back").width = (msg.length + 2) * 40;
		setTimeout(function () {
			cc.find("Canvas/toastNode").active = false;
		}, 1500);
	},
	infoClose: function () {
		cc.find("Canvas/infoDialogNode").active = false;
	},
	getPosInfo: function (e, msg) {
		var role = this.playInfoArray[msg];
		if (role) {
			cc.socket.sendMessage(120, { ObjPos: role.deskNum + "" });
		}
	},
	//////////////////

	coinButtonClick: function (e, msg) {
		this.endSchedule();
		cc.find("Canvas/mainNode/UI/bottomButtonNode").resumeSystemEvents(true);
		var coin = e.target.getChildByName("coinLabel").getComponent(cc.Label).string;
		cc.find("Canvas/mainNode/UI/jiazhuNode").active = false;
		cc.socket.sendMessage(110, { HangPoint: msg });
	},
	ruzuoButtonClick: function (e, msg) {
		cc.socket.sendMessage(102, { Pos: msg });

	},

	weiguanButtonClick: function () {
		cc.socket.sendMessage(103, {});
	},
	initRecoder: function () {
		var self = this;
		var vB = cc.find("Canvas/voiceButton");
		var talk = cc.find("Canvas/talkAni");
		var width = 100;
		var height = 100;
		vB.on(cc.Node.EventType.TOUCH_START, function (event) {
			self.isOnPokerTouch = true;
			jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "startRecode", "(Ljava/lang/String;)V", "ok");
			cc.log("recode");
			vB.scaleX = 0.9;
			vB.scaleY = 0.9;
			talk.active = true;
			talk.getComponent(cc.Animation).play("talk");

		}, self);
		vB.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
			var touches = event.getTouches();
			var touch = vB.convertToNodeSpace(touches[0].getLocation());
			touch.x -= 50;
			touch.y -= 50;
			if (touch.x > width / 2 || touch.x < -width / 2 || touch.y > height / 2 || touch.y < -height / 2) {
				self.isOnPokerTouch = false;
				talk.getComponent(cc.Animation).stop();
				talk.active = false;
			}


		}, self);
		vB.on(cc.Node.EventType.TOUCH_END, function (event) {
			if (self.isOnPokerTouch) {
				var touches = event.getTouches();
				var touch = vB.convertToNodeSpace(touches[0].getLocation());
				touch.x -= 50;
				touch.y -= 50;
				if (touch.x > width / 2 || touch.x < -width / 2 || touch.y > height / 2 || touch.y < -height / 2) {

				}
				else {
					var code = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "stopRecode", "(Ljava/lang/String;)Ljava/lang/String;", "ok");
					self.sendVoice(self.userid, code);
					cc.log("stop");
				}

			}
			vB.scaleX = 1;
			vB.scaleY = 1;
			talk.getComponent(cc.Animation).stop();
			talk.active = false;
			self.isOnPokerTouch = false;
		}, self);
		vB.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
			if (self.isOnPokerTouch) {
				var touches = event.getTouches();
				var touch = vB.convertToNodeSpace(touches[0].getLocation());
				touch.x -= 50;
				touch.y -= 50;
				if (touch.x > width / 2 || touch.x < -width / 2 || touch.y > height / 2 || touch.y < -height / 2) {

				}
				else {
					var code = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "stopRecode", "(Ljava/lang/String;)Ljava/lang/String;", "ok");
					self.sendVoice(self.userid, code);
					cc.log("cancel stop");
				}
			}
			vB.scaleX = 1;
			vB.scaleY = 1;
			self.isOnPokerTouch = false;
			talk.getComponent(cc.Animation).stop();
			talk.active = false;
		}, self);

	},
	sendVoice: function (user, data) {
		var self = this;
		cc.log("发送语音");
		self.HTTP.post("http://luck.ycluck.top:8080", '/api/http/CreateSound', "UserID=" + user + "&Txt=" + data, function (result) {
			cc.log(result);
			if (result == "err") {
				self.showToast("发送语音失败")
			} else {
				var info = JSON.parse(result);
				if (info.UserID.length > 0) {



					cc.socket.sendMessage(114, { Type: "voice", Txt: "" + info.UserID, Url: "" });

				}
				else {

				}
			}

		});
	},
	weixinShare: function (e, msg) {
		cc.socket.sendMessage(126,{});
	},
	playSound: function (user) {
		var self = this;

		self.HTTP.get("http://luck.ycluck.top:8080", '/api/http/GetSound', {
			UserID: user
		}, function (result) {
			cc.log(result);

			if (result == "err") {


			} else {
				var info = JSON.parse(result);
				jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "playSound", "(Ljava/lang/String;)V", info.Txt);
			}

		});
	},
	tButtonClick: function (e, msg) {
		var n = e.target.parent.name;
		var self = this;
		if (self.playInfoArray[n]) {
			cc.socket.sendMessage(122, { ObjPos: self.playInfoArray[n].deskNum + "" })
		}

	},
	weiguanListClick: function () {
		cc.find("Canvas/weiguanDialogNode").active = true;
		cc.socket.sendMessage(123, {});
	},
	myinfoClose: function () {
		cc.find("Canvas/infoDialogNode").active = false;
	},
	dialogClose: function (e, msg) {
		cc.find("Canvas/" + msg + "DialogNode").active = false;
	},
	soundSerButtonClick: function () {
		this.settingButtonClick();
		cc.find("Canvas/setting" + "DialogNode").active = true;
	}
});
