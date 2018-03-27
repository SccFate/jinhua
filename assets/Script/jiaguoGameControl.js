cc.Class({
	extends: cc.Component,
	properties: {
		pokerArray: [],
		playArray: {
			default:
				[],
			type: cc.Node,
		},
		flyClipPre: {
			default:
				null,
			type: cc.Prefab,
		},
		pokerPre: {
			default:
				null,
			type: cc.Prefab,
		},
		fontPre: {
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
		playNode: {
			default:
				null,
			type: cc.Node,
		},
		gameOverNode: {
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
		robZhuangButtonNode: {
			default:
				null,
			type: cc.Node,
		},
		robBeishuButtonNode: {
			default:
				null,
			type: cc.Node,
		},
		xiazhuBeishuButtonNode: {
			default:
				null,
			type: cc.Node,
		},
		tanpaiButtonNode: {
			default:
				null,
			type: cc.Node,
		},
		kaipaiButtonNode: {
			default:
				null,
			type: cc.Node,
		},
		cuopaiNode: {
			default:
				null,
			type: cc.Node,
		},
		readyButton: {
			default:
				null,
			type: cc.Node,
		},
		scheduleNode:
			{
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
		//	cc.view.setResolutionPolicy(cc.ResolutionPolicy.EXACT_FIT);
		var self = this;
		self.heartSchedule = null;
		this.timestamp = 0;
		this.userid = "";
		this.jiaMi = require("crypto");
		this.isOver = false;
		this.HTTP = require("HTTP");
		//this.wx = require("wc");
		this.host = "ws://101.132.182.134:2014";
		this.compre = new this.jiaMi();
		this.audioControl = this.node.getChildByName("audioManager").getComponent("audioControl");
		this.heartTime = 0;
		this.isConnecting = false;
		this.timeoutNum = 0;
		this.isRuzuo = false;
		this.isJoined = false;
		this.isLookPoker = false;
		this.isGameBegin = false;
		this.maxXiazhu = 0.1;
		this.roomCoinArray = [];
		this.roomInfo = {};
		this.dnRoomInfo = Global.dnRoomInfo;
		this.currDeskNum = 0;
		this.isGameBegin = false;
		this.pokerNum = 2;
		this.mesList = [];
		this.userid = Global.userid;
		this.roomNum = Global.roomNum;
		this.jiesanIndex = 1;
		this.typeList = JSON.parse(cc.find("Canvas/data").getComponent(cc.Label).string);
		cc.loader.loadResDir("/info", cc.SpriteFrame, function (errors, results) {
			var sflist = results;
			// cc.SpriteFrame
			for (var i = 0; i < sflist.length; i++) {
				var sf = sflist[i];
				self.infoTexture[sf.name] = sf;
				if (sf.name == "dw") {
					self.pokerArray["1-16"] = sf;
				}
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
					self.pokerArray["1-16"] = sf;

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
		cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function () {
			//处理游戏进入后台的情况

		});
        /*
        cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function(){
        //处理返回游戏的情况
        if(Global.socket.readyState==WebSocket.CLOSED||Global.socket.readyState==WebSocket.CLOSING)
        {
		        self.heartTime=0;
		        self.resetRoomData();
		        if (!self.isOver) {
		    	self.showAlert("重新连接中。。。");
	            self.reconnectButtonClick();
		        }
        }
        });
        */
		this.init();
	},
	clickDouble: function () {
		for (var j = 0; j < this.myPokerArray.length; j++) {
			this.myPokerArray[j].isChoosed = false;
		}
		this.adjustMyPokerArrayPosition();
	},
	initUserInfo: function (da) {
		this.roleName = da.NickName;
		this.roleSex = "wo";
		this.isRoomer = false;
		this.roomerPos = da.IsmMster;
		if (da.IsMster == da.Pos) {
			this.isRoomer = true;
		}
		this.playArray[0].getChildByName("nameLabel").getComponent(cc.Label).string = this.roleName;
		this.playArray[0].getChildByName("coinLabel").getComponent(cc.Label).string = da.Point;
		this.onNetMessage('got myRole', JSON.stringify({
			deskNum: parseInt(da.Pos),
			roleName: da.NickName,
			coinNum: da.Point,
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

	init: function () {
		var self = this;
		/*连接成功后向服务器发送创建玩家命令*/
		this.audioControl.init();
		//this.audioControl.playBGM("nback");
		this.initWebSocket();
		this.startListen();

		var query = {
			userid: this.userid,
			roomNum: this.roomNum
		}
		cc.find("Canvas/mainNode/UI/roomInfoNode/roomLabel").getComponent(cc.Label).string = "房间:" + this.roomNum;
	},
	initWebSocket: function () {
		var self = this;
		cc.log(this.host);
		Global.socket = new WebSocket(this.host);
		Global.socket.onopen = function (evt) {
			cc.log(self.host + " open");
			cc.log("okok111111111111111111111111111111");
			//self.closeAlert();
			cc.log(JSON.stringify({
				state: "0",
				RoomNum: self.roomNum,
				UserID: self.userid
			}));
			Global.socket.send(JSON.stringify({
				state: "0",
				RoomNum: self.roomNum,
				UserID: self.userid
			}));
			//self.sendMessage("0", []);
			//	self.startHeart();
		};
		Global.socket.onclose = function (evt) {
			self.heartTime = 0;
			self.resetRoomData();
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
				if (info.state == "00") {

					cc.find("Canvas/mainNode/UI/roomInfoNode/peopleLabel").getComponent(cc.Label).string = "围观:" + info.Num;




				}
				info.state = parseInt(info.state);

				switch (info.state) {
					case 2:
						self.resetRoomData();
						if (info.Roler == 1) {
							self.isRoomer = false;
							self.isRuzuo = false;
							self.playInfoArray = [];
							cc.find('Canvas/mainNode/UI/startButton').active = false;
							for (var i = 1; i < 7; i++) {
								self.playNode.getChildByName("pos" + i).active = true;
								self.playNode.getChildByName("play" + i).active = false;
							}
							for (var i = 0; i < info.data.length; i++) {
								var q = self.playNode.getChildByName("pos" + info.data[i].Pos);
								var p = self.playNode.getChildByName("play" + info.data[i].Pos);
								q.active = false;
								p.active = true;
								p.getChildByName("tButtonNode").active = false;
								self.onNetMessage('got posRole', JSON.stringify({
									deskNum: parseInt(info.data[i].Pos),
									roleName: info.data[i].NickName,
									coinNum: info.data[i].Point,
									photo: info.data[i].Photo
								}));
							}
							self.deskNum = 0;
						}
						else {
							self.showToast("已参与牌局不能围观");
						}
						break;
					case 13:
						self.onNetMessage("got roleZhanqi", JSON.stringify(info));
						break;
					case 0:
						if (info.Roler == 0) {
							self.showAlert("连接失败");
							setTimeout(function () {
								Global.roomNum = null;
								self.audioControl.stopBGM();
								cc.director.loadScene("hallScene");
							}, 2000)
						}
						if (info.Roler == 1) {
							self.initRecoder();

							self.roomData = "牌九,"
							if (info.RoomType == "0") {
								cc.find("Canvas/mainNode/UI/deskTip/type").getComponent(cc.Label).string = "两张";
								self.roomData += "两张,";
							}
							if (info.RoomType == "1") {
								cc.find("Canvas/mainNode/UI/deskTip/type").getComponent(cc.Label).string = "四张";
								self.roomData += "四张,";
							}
							if (info.RoomType == "2") {
								cc.find("Canvas/mainNode/UI/deskTip/type").getComponent(cc.Label).string = "加锅";
								self.roomData += "加锅,";
							}
							cc.find("Canvas/mainNode/UI/deskTip/num").getComponent(cc.Label).string = info.GameNum + "局";
							self.roomData += "局数:" + cc.find("Canvas/mainNode/UI/deskTip/num").getComponent(cc.Label).string + ",";
							if (info.BankType == "0") {
								cc.find("Canvas/mainNode/UI/deskTip/zhuang").getComponent(cc.Label).string = "固定";
								self.roomData += "固定庄" + ",";
							}
							else {
								cc.find("Canvas/mainNode/UI/deskTip/zhuang").getComponent(cc.Label).string = "轮庄";
								self.roomData += "轮庄" + ",";
							}
							cc.find("Canvas/mainNode/UI/deskTip/road").getComponent(cc.Label).string = info.RoadNum + "道";
							self.roomData += cc.find("Canvas/mainNode/UI/deskTip/road").getComponent(cc.Label).string + "注,";

							if (info.HangType == "0") {
								cc.find("Canvas/mainNode/UI/deskTip/zhutype").getComponent(cc.Label).string = "固定";
								self.roomData += "固定" + "注,";

							}
							else {
								cc.find("Canvas/mainNode/UI/deskTip/zhutype").getComponent(cc.Label).string = "自定";
								self.roomData += "自定义" + "注,";
							}
							cc.find("Canvas/mainNode/UI/deskTip/score").getComponent(cc.Label).string = info.Hang + "分";
							self.roomData += "底注:" + cc.find("Canvas/mainNode/UI/deskTip/score").getComponent(cc.Label).string + ",";
							cc.find("Canvas/mainNode/UI/roomInfoNode/jushuLabel").getComponent(cc.Label).string = "局数:" + 1 + "/" + info.GameNum;
							cc.find("Canvas/mainNode/UI/roomInfoNode/dizhuLabel").getComponent(cc.Label).string = "底注:" + info.Hang;
							for (var i = 0; i < info.SpecialCard.length; i++) {

								if (info.SpecialCard[i] == "0") {
									cc.find("Canvas/mainNode/UI/roomInfoNode/type" + (i + 1)).getComponent(cc.Label).string = "鬼牌";
									cc.find("Canvas/mainNode/UI/deskTip/sp" + (i + 1)).getComponent(cc.Label).string = "鬼牌";
									self.roomData += "鬼牌" + ",";
								}
								if (info.SpecialCard[i] == "1") {
									cc.find("Canvas/mainNode/UI/roomInfoNode/type" + (i + 1)).getComponent(cc.Label).string = "天九王";
									cc.find("Canvas/mainNode/UI/deskTip/sp" + (i + 1)).getComponent(cc.Label).string = "天九王";
									self.roomData += "天九王" + ",";
								}
								if (info.SpecialCard[i] == "2") {
									cc.find("Canvas/mainNode/UI/roomInfoNode/type" + (i + 1)).getComponent(cc.Label).string = "炸弹";
									cc.find("Canvas/mainNode/UI/deskTip/sp" + (i + 1)).getComponent(cc.Label).string = "炸弹";
									self.roomData += "炸弹" + ",";
								}
								if (info.SpecialCard[i] == "3") {
									cc.find("Canvas/mainNode/UI/roomInfoNode/type" + (i + 1)).getComponent(cc.Label).string = "地九娘娘";
									cc.find("Canvas/mainNode/UI/deskTip/sp" + (i + 1)).getComponent(cc.Label).string = "地九娘娘";
									self.roomData += "地九娘娘" + ",";
								}
							}
							self.roomData = self.roomData.substring(0, self.roomData.length - 1);
							for (var i = 1; i < 7; i++) {
								self.playNode.getChildByName("pos" + i).active = true;
								self.playNode.getChildByName("play" + i).active = false;
							}
							for (var i = 0; i < info.data.length; i++) {
								var q = self.playNode.getChildByName("pos" + info.data[i].Pos);
								var p = self.playNode.getChildByName("play" + info.data[i].Pos);
								q.active = false;
								p.active = true;
								self.onNetMessage('got posRole', JSON.stringify({
									deskNum: parseInt(info.data[i].Pos),
									roleName: info.data[i].NickName,
									coinNum: info.data[i].Point,
									photo: info.data[i].Photo
								}));
							}
						}

						if (info.Roler == 2) {
							self.showAlert("房间已结束");
							setTimeout(function () {
								Global.roomNum = null;
								self.audioControl.stopBGM();
								cc.director.loadScene("hallScene");
							}, 2000)
						}
						if (info.Roler == 3) {
							self.showAlert("房间禁止加入");
							setTimeout(function () {
								Global.roomNum = null;
								self.audioControl.stopBGM();
								cc.director.loadScene("hallScene");
							}, 2000)
						}
						if (info.Roler == 4) {
							self.showAlert("玩家信息丢失");
							setTimeout(function () {
								Global.roomNum = null;
								self.audioControl.stopBGM();
								cc.director.loadScene("hallScene");
							}, 2000)
						}
						////////////////////////
						/*
						self.onNetMessage("got lineGame", JSON.stringify({
							deskNum: info.pos
						}));
						*/
						break;
					case 11:
						if (!self.isRuzuo) {
							self.onNetMessage('got posRole', JSON.stringify({
								roleName: info.NickName,
								deskNum: parseInt(info.Pos),
								coinNum: info.Point,
								photo: info.Photo,
							}));

						}
						else {
							if (parseInt(info.Pos) != self.deskNum) {
								self.onNetMessage('got deskRole', JSON.stringify({
									deskNum: parseInt(info.Pos),
									roleName: info.NickName,
									coinNum: info.Point,
									photo: info.Photo
								}));
								if (self.isRoomer) {
									cc.find('Canvas/mainNode/UI/startButton').active = true;
									for (var k in self.playInfoArray) {
										if (k.indexOf("play") >= 0) {
											if (self.deskNum != self.playInfoArray[k].deskNum) {
												self.playInfoArray[k].node.getChildByName("tButtonNode").active = true;
											}
										}
									}
								}
								else {
									for (var k in self.playInfoArray) {
										if (k.indexOf("play") >= 0) {
											if (self.deskNum != self.playInfoArray[k].deskNum) {
												self.playInfoArray[k].node.getChildByName("tButtonNode").active = false;
											}
										}
									}
								}



							}
						}
						break;
					case 1:

						if (info.Roler == 1) {
							self.isRuzuo = true;
							self.playInfoArray = [];
							for (var i = 1; i < 7; i++) {
								self.playNode.getChildByName("pos" + i).active = false;
								self.playNode.getChildByName("play" + i).active = true;
								self.playNode.getChildByName("play" + i).getChildByName("roleType").getComponent(cc.Sprite).spriteFrame = self.infoTexture["dface"];
								self.playNode.getChildByName("play" + i).getChildByName("coinLabel").getComponent(cc.Label).string = "";
								self.playNode.getChildByName("play" + i).getChildByName("nameLabel").getComponent(cc.Label).string = "";
								self.playNode.getChildByName("play" + i).getChildByName("tButtonNode").active = false;
							}
							for (var i = 0; i < info.data.length; i++) {
								if (info.data[i].UserID == self.userid) {
									self.playArray[0].active = true;
									self.playArray[0].getChildByName("nameLabel").getComponent(cc.Label).string = info.data[i].NickName;
									self.playArray[0].getChildByName("coinLabel").getComponent(cc.Label).string = info.data[i].Point;
									self.onNetMessage('got myRole', JSON.stringify({
										deskNum: parseInt(info.data[i].Pos),
										roleName: info.data[i].NickName,
										coinNum: info.data[i].Point,
										photo: info.data[i].Photo
									}));
								}
								else {

								}
							}
							for (var i = 0; i < info.data.length; i++) {
								if (info.data[i].UserID == self.userid) {

								}
								else {
									self.onNetMessage('got deskRole', JSON.stringify({
										deskNum: parseInt(info.data[i].Pos),
										roleName: info.data[i].NickName,
										coinNum: info.data[i].Point,
										photo: info.data[i].Photo
									}));
								}
							}

							if (self.deskNum == parseInt(info.StartPos)) {
								self.isRoomer = true;
								cc.find('Canvas/mainNode/UI/readyButton').active = false;
								cc.find('Canvas/mainNode/UI/startButton').active = true;
								for (var k in self.playInfoArray) {
									if (k.indexOf("play") >= 0) {
										if (self.deskNum != self.playInfoArray[k].deskNum) {
											self.playInfoArray[k].node.getChildByName("tButtonNode").active = true;
										}
									}
								}
							}
							else {
								cc.find('Canvas/mainNode/UI/startButton').active = false;
								for (var k in self.playInfoArray) {
									if (k.indexOf("play") >= 0) {
										if (self.deskNum != self.playInfoArray[k].deskNum) {
											self.playInfoArray[k].node.getChildByName("tButtonNode").active = false;
										}
									}
								}
							}

						}
						else {
							self.showAlert("入座失败");
							setTimeout(function () {
								self.closeAlert();

							}, 1500);
						}
						/*
						self.onNetMessage("got disGame", JSON.stringify({
							deskNum: info.pos
						}));*/

						break;
					case 27:
						self.closeAlert();
						for (var i = 0; i < info.data.length; i++) {
							if (parseInt(info.data[i].Pos) != self.deskNum) {
								self.onNetMessage("got deskRole", JSON.stringify({
									deskNum: parseInt(info.data[i].Pos),
									roleName: info.data[i].NickName,
									//	dichi: info.data[i].NowMoney,
									coinNum: info.data[i].Point,
									//	isLine: info.data[i].Line,
									photo: info.data[i].Photo,
									//	cardstate: info.data[i].cardstate
								}));
							}
						}

						if (self.isRoomer) {
							cc.find('Canvas/mainNode/UI/startButton').active = true;
						}
						else {
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
					case 7:
						if (info.Roler == "1") {
							if (self.isRoomer) {
								self.showToast("踢出成功");
							}
							if (parseInt(info.Pos) == self.deskNum) {
								self.showToast("你被踢出房间");
								setTimeout(function () {
									Global.roomNum = null;
									self.audioControl.stopBGM();
									cc.director.loadScene("hallScene");
								}, 2000);
							}
							else {
								self.onNetMessage("got exitGame", JSON.stringify({
									deskNum: parseInt(info.Pos)
								}));
							}



						}
						else {
							if (self.isRoomer) {
								self.showToast("踢出失败");
							}
						}


						break;
					case 4:
						if (info.Roler == "1") {
							cc.find("Canvas/mainNode/UI/deskTip").active = false;
							for (var k in self.playInfoArray) {
								if (k.indexOf("play") >= 0) {
									if (self.deskNum != self.playInfoArray[k].deskNum) {
										self.playInfoArray[k].node.getChildByName("tButtonNode").active = false;
										self.playInfoArray[k].node.getChildByName("xiazhu").getComponent(cc.Label).string = "";
									}
									else
									{
										self.playInfoArray[k].node.getChildByName("xiazhu").getComponent(cc.Label).string = "";
									}
								}
							}
							for (var i = 0; i < info.data.length; i++) {
								var role = self.getRoleByDeskNum(parseInt(info.data[i].Pos));
								role.node.getChildByName("coinLabel").getComponent(cc.Label).string = info.data[i].Point;
							}
							cc.find('Canvas/mainNode/UI/guoNode').scaleX = 1;
							cc.find('Canvas/mainNode/UI/guoNode').scaleY = 1;
							cc.find('Canvas/mainNode/UI/guoNode').x = 0;
							cc.find('Canvas/mainNode/UI/guoNode').y = 0;
							cc.find("Canvas/mainNode/UI/roomInfoNode/jushuLabel").getComponent(cc.Label).string = "局数:" + info.GameNumNow + "/" + cc.find("Canvas/mainNode/UI/roomInfoNode/jushuLabel").getComponent(cc.Label).string.substring(cc.find("Canvas/mainNode/UI/roomInfoNode/jushuLabel").getComponent(cc.Label).string.length - 2);
							cc.find('Canvas/mainNode/UI/startButton').active = false;
							cc.find('Canvas/mainNode/UI/readyButton').active = false;
							self.audioControl.playSFX("kaiju");
							cc.find('Canvas/mainNode/UI/guoNode/guoNum').getComponent(cc.Label).string = info.GuoCount;
							cc.find('Canvas/mainNode/UI/shaizi').active = true;
							cc.find('Canvas/mainNode/UI/shaizi').getComponent(cc.Animation).play();
							setTimeout(function () {
								cc.find('Canvas/mainNode/UI/shaizi').getComponent(cc.Animation).stop();
								cc.find('Canvas/mainNode/UI/shaizi/shazi1').rotation = 0;
								cc.find('Canvas/mainNode/UI/shaizi/shazi2').rotation = 0;
								cc.find('Canvas/mainNode/UI/shaizi/shazi1').getComponent(cc.Sprite).spriteFrame = self.infoTexture["shaizi" + info.GuoNum.split("|")[0]];
								cc.find('Canvas/mainNode/UI/shaizi/shazi2').getComponent(cc.Sprite).spriteFrame = self.infoTexture["shaizi" + info.GuoNum.split("|")[1]];
								self.audioControl.playSFX("fapai");
								var f = parseInt(info.Frist);
								var fapaiArr = [];
								for (var q = 1; q < 7; q++) {
									if (q == f) {
										for (var w = q; w < 7; w++) {
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
									cc.find('Canvas/mainNode/UI/guoNode').getComponent(cc.Animation).play();
									self.onNetMessage("got canXiaZhu", JSON.stringify({
										zhuang: parseInt(info.BankerPos)
									}));
								}, 3000);
							}
								, 1000);
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
					case 28:
						if (self.deskNum != parseInt(info.Pos)) {
							self.onNetMessage("got deskRole", JSON.stringify({
								deskNum: parseInt(info.Pos),
								roleName: info.NickName,
								coinNum: info.Point,
								dichi: "0",
								photo: info.Photo
							}));
						}
						break;
					case 9:
						self.cuopaiNode.active = false;
						self.tanpaiButtonNode.active = false;
						self.onNetMessage("game over", JSON.stringify({

							data: info.data

						}));
						break;
					case 2:
						self.onNetMessage("got ready", JSON.stringify({
							deskNum: parseInt(info.Pos)
						}));
						break;
					case 32:
						if (parseInt(info.Pos) == self.deskNum) {

							self.robZhuangButtonNode.active = false;
							self.robBeishuButtonNode.active = false;
							self.endSchedule();
						}
						self.onNetMessage("got roleRobZhuang", JSON.stringify({
							deskNum: parseInt(info.Pos),
							beishu: info.zhuang
						}));
						break;

					case 322:
						if (info.roler == "1") {
							self.robZhuangButtonNode.active = false;
							self.robBeishuButtonNode.active = false;

							cc.find('Canvas/mainNode/UI/startButton').active = false;
							cc.find('Canvas/mainNode/UI/readyButton').active = false;
							self.endSchedule();
							if (info.IsBank == "0") {
								self.onNetMessage("got zhuang", JSON.stringify({
									deskNum: parseInt(info.BankPos)
								}));
								self.onNetMessage("got canXiaZhu", JSON.stringify({
									zhuang: parseInt(info.BankPos)
								}));
							}
							if (info.IsBank == "1") {
								if (info.data.length > 1) {
									self.startRandLight(parseInt(info.BankPos), info.data);
								}
								else {
									self.onNetMessage("got zhuang", JSON.stringify({
										deskNum: parseInt(info.BankPos)
									}));
									self.onNetMessage("got canXiaZhu", JSON.stringify({
										zhuang: parseInt(info.BankPos)
									}));
								}
							}

						} else {

						}
						break;
					case 20:

						if (parseInt(info.Pos) == self.deskNum) {
							self.xiazhuBeishuButtonNode.active = false;
							self.endSchedule();
						}
						self.onNetMessage("got roleXiazhu", JSON.stringify({
							deskNum: parseInt(info.Pos),
							coinNum: info.Point,
							type: info.GuoType,
							beishu: info.HangNum
						}));
						if (info.HangOver == "1") {
							self.closeAlert();
							self.tanpaiButtonNode.active = true;

							self.kaipaiButtonNode.active = false;
						}
						else {
							if (info.NextPos != "0") {
								if (parseInt(info.NextPos) == self.deskNum) {

									self.xiazhuBeishuButtonNode.active = true;
									if (info.dai == "1") {
										self.xiazhuBeishuButtonNode.getChildByName("dai").active = true;
										self.xiazhuBeishuButtonNode.getChildByName("bandai").active = false;
									}
									else {
										self.xiazhuBeishuButtonNode.getChildByName("dai").active = false;
										self.xiazhuBeishuButtonNode.getChildByName("bandai").active = true;
									}
									self.startSchedule(function () {
										cc.log("xiazhuTimeout");
									});
								}
								else {
									self.showAlert("等待" + self.getRoleByDeskNum(parseInt(info.NextPos)).roleName + "玩家下注");
								}



							}
						}


						break;
					case 37:
						self.closeAlert();
						self.tanpaiButtonNode.active = true;
						self.xiazhuBeishuButtonNode.active = false;
						self.endSchedule();
						self.startSchedule(function () {
							cc.log("xiazhuTimeout");
						});
						break;
					case 8:
						self.closeAlert();
						setTimeout(function () {
							if (info.Card.length > 0) {
								self.getRoleByDeskNum(parseInt(info.Pos)).pokerArray = info.Card.split("|");
								cc.log(self.playInfoArray["play1"].pokerArray);
								self.onNetMessage("got poker", JSON.stringify({

									deskNum: parseInt(info.Pos),
									pokerArray: [info.Card.split("|")[0]],
									type: info.Num
								}));

								self.kaipaiButtonNode.active = true;
								self.endSchedule();
								self.startSchedule(function () {
									cc.log("xiazhuTimeout");
								});

							}

						}, 5000);
						break;
					case 6:
						if (info.Card.length > 0) {
							if (self.deskNum == parseInt(info.Pos)) {
								self.cuopaiNode.active = false;
								self.tanpaiButtonNode.active = false;
								self.endSchedule();
							}
							self.onNetMessage("got poker", JSON.stringify({

								deskNum: parseInt(info.Pos),
								pokerArray: info.Card.split("|"),
								Num: info.Num,
								SanDian: info.SanDian,
								CardPoint: info.CardPoint
							}));
						}
						break;

					case 355:
						if (info.card.length > 0) {
							self.cuopaiNode.active = true;
							var cuoControl = self.cuopaiNode.getComponent("cuopaiControl");
							cuoControl.init(self.pokerArray[info.card], function (msg, data) {
								if (msg == "ok") {
									var p = self.playInfoArray["play1"].node.getChildByName("pokerGroup");
									p.getChildByName("poker5").destroy();
									var np = cc.instantiate(self.pokerPre);
									np.getChildByName("num").getComponent(cc.Sprite).spriteFrame = data.num;
									np.getChildByName("smallHuase").getComponent(cc.Sprite).spriteFrame = data.smallHuase;
									np.getChildByName("bigHuase").getComponent(cc.Sprite).spriteFrame = data.bigHuase;
									np.name = "poker5";
									p.addChild(np);
									np.setPosition(p.getChildByName("pos5").position);
									setTimeout(function () {
										self.cuopaiNode.active = false;

									}, 500);
									self.tanpaiButtonNode.active = true;
								}
								if (msg = "cancel") {

									self.cuopaiNode.active = false;
									self.tanpaiButtonNode.active = true;

								}


							});
						}
						break;
					case 46:
						self.roomInfo = {
							roomNum: info.RoomNum,
							GameNum: info.MaxScreenings,
							RoomType: info.RoomType,
							Bottomlimit: info.BottomLimit
						}
						cc.find("Canvas/mainNode/UI/roomInfoNode/roomLabel").getComponent(cc.Label).string = "房间:" + info.RoomNum;
						cc.find("Canvas/mainNode/UI/roomInfoNode/jushuLabel").getComponent(cc.Label).string = "局数:" + info.Screenings + "/" + info.MaxScreenings;
						cc.find("Canvas/mainNode/UI/roomInfoNode/dizhuLabel").getComponent(cc.Label).string = "低注:" + info.BottomLimit + "分";
						cc.find("Canvas/mainNode/UI/roomInfoNode/typeLabel").getComponent(cc.Label).string = info.RoomType;
						break;
					case 44:
						var dia = cc.find("Canvas/infoDialogNode");
						dia.getChildByName("dialog").getChildByName("infoLabel").getComponent(cc.Label).string = "省市:" + info.data.addresss + "\n" + "IP地址:" + info.data.IP + "\n" + "距离:" + info.data.Long + "\n经度:" + info.x + "\n纬度:" + info.y;
						dia.active = true;
						break;
					case 17:
						cc.find("Canvas/jiesanChooseNode").active = false;
						break;
					case 10:
						setTimeout(function () {
							cc.find("Canvas/jiesanChooseNode").active = false;
							self.isOver = true;
							self.unscheduleAllCallbacks();
							self.clearSchedule();
							self.resetRoomData();
							self.heartTime = 0;
							var zhanjiNode = cc.find("Canvas/zhanjiNode");
							zhanjiNode.active = true;
							for (var i = 0; i < info.data.length; i++) {
								var res = cc.instantiate(self.resultPre);
								res.getChildByName("name").getComponent(cc.Label).string = info.data[i].NickName;
								if (parseInt(info.data[i].Point) >= 0) {
									res.getChildByName("coin").color = new cc.Color(0, 0, 255);
									res.getChildByName("coin").getComponent(cc.Label).string = "+" + info.data[i].Point;
									res.getChildByName("state").getChildByName("win").active = true;
									res.getChildByName("state").getChildByName("defeat").active = false;
								} else {
									res.getChildByName("coin").color = new cc.Color(255, 255, 255);
									res.getChildByName("coin").getComponent(cc.Label).string = info.data[i].Point;
									res.getChildByName("state").getChildByName("defeat").active = true;
									res.getChildByName("state").getChildByName("win").active = false;

								}
								if (info.data[i].Pos == info.BigPos) {
									res.getChildByName("big").active = true;
								}
								else {
									res.getChildByName("big").active = false;
								}
								zhanjiNode.getChildByName("pos" + (i + 1)).removeAllChildren();
								zhanjiNode.getChildByName("pos" + (i + 1)).addChild(res);
								res.getChildByName("head").getComponent(cc.Sprite).spriteFrame = self.getRoleByDeskNum(parseInt(info.data[i].Pos)).node.getChildByName("roleType").getComponent(cc.Sprite).spriteFrame;

								res.setPosition(0, 0);
							}
						}, 3000);
						break;
					case 3:
						if (info.UserID == self.userid) {
							if (info.Roler == "0") {
								self.showToast("退出失败");
							}
							if (info.Roler == "1") {
								self.isOver = true;
								self.unscheduleAllCallbacks();
								self.heartTime = 0;
								Global.roomNum = "";
								self.audioControl.stopBGM();
								Global.roomNum = null;
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
					case 19:
						var role = self.getRoleByDeskNum(parseInt(info.Pos));
						if (info.type == "emoji") {

							var pre = cc.instantiate(self.emojiPre);
							pre.getComponent("emojiControl").path = "emoji/" + info.url.substring(0, info.url.indexOf("-"));
							role.node.getChildByName("emojiNode").active = true;
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
							self.audioControl.playSFX("msg" + info.url);
							setTimeout(function () {
								role.node.getChildByName("msgNode").active = false;
							}, 2000)

						}
						if (info.type == "text") {
							role.node.getChildByName("toastNode").active = true;
							role.node.getChildByName("toastNode").getChildByName("label").getComponent(cc.Label).string = info.url;
							role.node.getChildByName("toastNode").getChildByName("back").width = role.node.getChildByName("toastNode").getChildByName("label").width + 40;
							setTimeout(function () {
								role.node.getChildByName("toastNode").active = false;
							}, 2000);
						}
						if (info.type == "voice") {
							role.node.getChildByName("msgNode").active = true;
							self.playSound(info.url);
							setTimeout(function () {
								role.node.getChildByName("msgNode").active = false;
							}, 2000)
						}
						break;
					case 17:
						self.showToast("解散成功");
						cc.find("Canvas/jiesanChooseNode").active = false;
						break;
					case 16:
						self.showToast(info.NickName + "拒绝了解散");
						cc.find("Canvas/jiesanChooseNode").active = false;
						break;
					case 15:
						if (self.userid == info.UserID) {
							cc.find("Canvas/jiesanChooseNode/dialog/confirmButton").active = false;
							cc.find("Canvas/jiesanChooseNode/dialog/closeButton").active = false;
						}
						var jiesan = cc.find("Canvas/jiesanChooseNode");
						jiesan.active = true;
						cc.find("Canvas/jiesanChooseNode/dialog/time").getComponent("timeSchedule").startSchedule(function () {


							cc.log("jiesan over");


						});
						var pNode = jiesan.getChildByName("dialog").getChildByName("jiesan" + self.jiesanIndex);
						pNode.active = true;
						pNode.getChildByName("name").getComponent(cc.Label).string = info.NickName;
						cc.loader.load({ url: info.Photo, type: 'png' }, function (err, t) {
							pNode.getChildByName("head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(t);
						});
						pNode.getChildByName("isAgree").getComponent(cc.Sprite).spriteFrame = self.infoTexture["agree"];
						for (var k = self.jiesanIndex + 1; k < 7; k++) {
							var pp = jiesan.getChildByName("dialog").getChildByName("jiesan" + k);
							pp.active = false;
						}
						self.jiesanIndex++;
						break;


					case 14:
						if (info.Roler == "1") {
							self.jiesanIndex = 1;
							var jiesan = cc.find("Canvas/jiesanChooseNode");
							jiesan.active = true;
							cc.find("Canvas/jiesanChooseNode/dialog/time").getComponent("timeSchedule").startSchedule(function () {


								cc.log("jiesan over");


							});

							var pNode = jiesan.getChildByName("dialog").getChildByName("jiesan" + self.jiesanIndex);
							pNode.active = true;
							pNode.getChildByName("name").getComponent(cc.Label).string = info.NickName;
							cc.loader.load({ url: info.Photo, type: 'png' }, function (err, t) {
								pNode.getChildByName("head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(t);
							});
							cc.log(self.infoTexture["agree"].name);
							pNode.getChildByName("isAgree").getComponent(cc.Sprite).spriteFrame = self.infoTexture["agree"];
							for (var k = self.jiesanIndex + 1; k < 7; k++) {
								var pp = jiesan.getChildByName("dialog").getChildByName("jiesan" + k);
								pp.active = false;
							}
							self.jiesanIndex++;
							if (info.UserID != self.userid) {

								self.showToast(info.NickName + "发起了解散");
								cc.find("Canvas/jiesanChooseNode/dialog/confirmButton").active = true;
								cc.find("Canvas/jiesanChooseNode/dialog/closeButton").active = true;
							}
							else {
								cc.find("Canvas/jiesanChooseNode/dialog/confirmButton").active = false;
								cc.find("Canvas/jiesanChooseNode/dialog/closeButton").active = false;

							}
						    /*
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
							*/
						}
						else if (info.Roler == "2") {
							if (info.UserID == self.userid) {

								self.showToast("未入座不能发起解散");


							}
						}
						else {
							if (info.UserID == self.userid) {
								self.showToast("发起解散失败");
							}
						}

						break;
					case 334:
						var jiesan = cc.find("Canvas/jiesanChooseNode");
						if (info.roler == "1") {
							jiesan.active = false;
							self.showAlert("解散成功");
							setTimeout(function () {
								self.closeAlert();
							}, 1000);
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
					case 41:
						cc.find("Canvas/jiesanChooseNode").active = false;
						self.showAlert("" + info.NickName + "拒绝了解散请求。");
						setTimeout(function () {
							self.closeAlert();
						}, 1500);
						break;
					case 24:
						if (self.deskNum == parseInt(info.Pos)) {
							self.readyButton.active = false;

						}
						var r = self.getRoleByDeskNum(parseInt(info.Pos)).node;
						r.getChildByName("xiazhu").getComponent(cc.Label).string = "准备";

						break;
					case 22:
						if (info.data == "1") {
							self.showToast("开挂成功");
						}
						break;
					case 288:
						self.initUserInfo(info);
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
				cc.log(num);
				if (self.deskNum > info.deskNum) {
					self.playInfoArray["play" + (self.playArray.length - num + 1)] = {
						roleName: info.roleName,
						deskNum: info.deskNum,
						coinNum: info.coinNum,
						pokerArray: [],
						node: self.playArray[self.playArray.length - num],

					};
				} else {
					self.playInfoArray["play" + (num + 1)] = {
						roleName: info.roleName,
						deskNum: info.deskNum,
						coinNum: info.coinNum,
						pokerArray: [],
						node: self.playArray[num],

					};

				}
			}
			for (var i in self.playInfoArray) {
				if (i.indexOf("play") >= 0) {
					if (self.playInfoArray[i].deskNum == info.deskNum) {
						cc.log("role :" + self.playInfoArray[i].node.name);
						self.playInfoArray[i].node.active = true;
						self.playInfoArray[i].node.getChildByName("nameLabel").getComponent(cc.Label).string = info.roleName;
						self.playInfoArray[i].node.getChildByName("coinLabel").getComponent(cc.Label).string = info.coinNum;
						var temp = i;
						cc.loader.load({ url: info.photo, type: 'png' }, function (err, t) {
							cc.log(self.playInfoArray[temp].node.name);
							self.playInfoArray[temp].node.getChildByName("roleType").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(t);
						});

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
				pokerArray: [],
				node: self.playArray[info.deskNum - 1],

			};
			self.playNode.getChildByName("pos" + info.deskNum).active = false;
			for (var i in self.playInfoArray) {
				if (i.indexOf("play") >= 0) {
					if (self.playInfoArray[i].deskNum == info.deskNum) {
						self.playInfoArray[i].node.active = true;
						self.playInfoArray[i].node.getChildByName("nameLabel").getComponent(cc.Label).string = info.roleName;
						self.playInfoArray[i].node.getChildByName("coinLabel").getComponent(cc.Label).string = info.coinNum;
						var temp = i;
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
				pokerArray: info.card,
				node: self.playArray[0],
			};
			cc.loader.load({ url: info.photo, type: 'png' }, function (err, t) {
				cc.log(self.playInfoArray["play1"].node.name);
				self.playInfoArray["play1"].node.getChildByName("roleType").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(t);
			});
		});
		/*服务器发来本玩家是否能够出牌*/
		self.addMessage("got canXiaZhu", function (msg) {
			self.clearInfo();
			var info = JSON.parse(msg);
			var role = self.getRoleByDeskNum(info.zhuang);
			if (info.zhuang != self.deskNum) {
				self.xiazhuBeishuButtonNode.active = true;
				self.xiazhuBeishuButtonNode.getChildByName("dai").active = false;
				self.xiazhuBeishuButtonNode.getChildByName("bandai").active = true;

				self.startSchedule(function () {
					cc.log("xiazhuTimeout");
				});
			}
			else {




				self.showAlert("等待其他玩家下注");
			}
		});
		self.addMessage("got canRobZhuang", function (msg) {
			self.clearInfo();
			self.robZhuangButtonNode.active = true;
			self.startSchedule(function () {
				cc.log("time out");
			});
		});

		self.addMessage("got roleXiazhu", function (msg) {

			var info = JSON.parse(msg);
			var role = self.getRoleByDeskNum(info.deskNum);
			var t = "";
			if (info.type == "0") {
				t = "弃";
			}
			if (info.type == "1") {
				t = "钓";
			}
			if (info.type == "2") {
				t = "吃";
			}
			if (info.type == "3") {
				t = "带";
			}
			role.node.getChildByName("xiazhu").getComponent(cc.Label).string = t + "\n" + info.beishu;
		});
		self.addMessage("got roleRobZhuang", function (msg) {
			var info = JSON.parse(msg);
			var role = self.getRoleByDeskNum(info.deskNum);
			role.node.getChildByName("infoNode").getComponent(cc.Sprite).spriteFrame = self.infoTexture["r" + info.beishu];
			if (info.beishu == "0") {
				self.audioControl.playSFX("bqz");
			}
			else {
				self.audioControl.playSFX("qz");
			}
		});

		self.addMessage("got lunNum", function (msg) {
			var info = JSON.parse(msg);
			cc.find("Canvas/mainNode/UI/infoNode/lunNumNode/lunNumLabel").getComponent(cc.Label).string = info.num;

		});
		self.addMessage("got poker", function (msg) {
			var info = JSON.parse(msg);
			var role = self.getRoleByDeskNum(info.deskNum);
			var pos1 = role.node.getChildByName("pokerGroup").getChildByName("pos2").position;
			var pAr = role.node.getChildByName("pokerGroup").children;
			for (var q = 0; q < pAr.length; q++) {
				if (pAr[q].name.indexOf("poker") >= 0) {
					pAr[q].destroy();
				}
			}
			for (var i = 2; i < 4; i++) {
				var poker = null;
				if (i - 2 < info.pokerArray.length) {
					cc.log(info.pokerArray[i - 2]);
					if (info.pokerArray[i - 2].split("-")[1] == "1") {
						info.pokerArray[i - 2] = info.pokerArray[2 - 1].split("-")[0] + "-14";
					}
					if (info.pokerArray[i - 2].split("-")[1] == "16") {
						poker = cc.instantiate(self.pokerBackPre);
						poker.getComponent(cc.Sprite).spriteFrame = self.infoTexture["dw"];
						poker.scaleX = 1.7;
						poker.scaleY = 1.9;
					}
					else {
						poker = cc.instantiate(self.pokerPre);
						poker.getChildByName("num").getComponent(cc.Sprite).spriteFrame = self.pokerArray[info.pokerArray[i - 2]].num;
						poker.getChildByName("smallHuase").getComponent(cc.Sprite).spriteFrame = self.pokerArray[info.pokerArray[i - 2]].smallHuase;
						poker.getChildByName("bigHuase").getComponent(cc.Sprite).spriteFrame = self.pokerArray[info.pokerArray[i - 2]].bigHuase;
					}
				}
				else {
					poker = cc.instantiate(self.pokerBackPre);
					poker.scaleX = 1.7;
					poker.scaleY = 1.9;
				}
				poker.name = "poker" + i;
				role.node.getChildByName("pokerGroup").addChild(poker);
				poker.setPosition(pos1);
				poker.runAction(cc.moveTo(0.5, role.node.getChildByName("pokerGroup").getChildByName("pos" + i)));









			}
			setTimeout(function () {
				if (info.Num) {
					if (info.Num.length > 0) {
						cc.log("牌型" + info.Num);
						role.node.getChildByName("type").active = true;
						if (info.Num == "79") {
							if (info.CardPoint != "0") {
								if (parseInt(info.SanDian) > 6) {
									cc.log("---------------" + self.typeList["t" + info.SanDian + "-" + info.CardPoint]);
									role.node.getChildByName("type").getComponent(cc.Label).string = self.typeList["t" + info.SanDian + "-" + info.CardPoint];
									self.audioControl.playSFX(info.SanDian + "-" + info.CardPoint);
								}
								else {
									cc.log("no ---" + self.typeList["t" + info.CardPoint]);
									role.node.getChildByName("type").getComponent(cc.Label).string = self.typeList["t" + info.CardPoint];
									self.audioControl.playSFX(info.CardPoint);
								}
							}
							else {
								role.node.getChildByName("type").getComponent(cc.Label).string = "毕十";
								self.audioControl.playSFX(info.CardPoint);
							}
						}
						else {
							role.node.getChildByName("type").getComponent(cc.Label).string = self.typeList["t" + info.Num];
							self.audioControl.playSFX(info.Num);

						}
					}
				}
			}, 500);

		});


		//服务器告知有玩家退出游戏
		self.addMessage("got exitGame", function (msg) {
			var info = JSON.parse(msg);
			for (var k in self.playInfoArray) {
				if (k.indexOf("play") >= 0) {
					if (info.deskNum == self.playInfoArray[k].deskNum) {
						var role = self.playInfoArray[k];
						role.node.getChildByName("roleType").getComponent(cc.Sprite).spriteFrame = self.infoTexture["dface"];
						role.node.getChildByName("coinLabel").getComponent(cc.Label).string = "";
						role.node.getChildByName("nameLabel").getComponent(cc.Label).string = "";
						role.node.getChildByName("tButtonNode").active = false;
						for (var i = 1; i < 6; i++) {
							if (self.playInfoArray[k].node.getChildByName("pokerGroup").getChildByName("poker" + i) != null) {
								self.playInfoArray[k].node.getChildByName("pokerGroup").getChildByName("poker" + i).destroy();
							}
						}
						if (!self.isRuzuo) {
							self.playNode.getChildByName("pos" + self.playInfoArray[k].deskNum).active = true;
						}
						delete self.playInfoArray[k];
						break;

					}
				}
			}
		});
		self.addMessage("got disGame", function (msg) {
			var info = JSON.parse(msg);
			var role = self.getRoleByDeskNum(info.deskNum);
			role.node.getChildByName("disNode").active = true;
			role.node.getChildByName("roleType").color = new cc.Color(0, 100, 100);
		});
		self.addMessage("got roleZhanqi", function (msg) {
			var info = JSON.parse(msg);
			self.showToast(info.NickName + "站起围观了");
			for (var k in self.playInfoArray) {
				if (k.indexOf("play") >= 0) {
					if (parseInt(info.Pos) == self.playInfoArray[k].deskNum) {
						var role = self.playInfoArray[k];
						role.node.getChildByName("roleType").getComponent(cc.Sprite).spriteFrame = self.infoTexture["dface"];
						role.node.getChildByName("coinLabel").getComponent(cc.Label).string = "";
						role.node.getChildByName("nameLabel").getComponent(cc.Label).string = "";
						role.node.getChildByName("tButtonNode").active = false;
						for (var i = 1; i < 6; i++) {
							if (self.playInfoArray[k].node.getChildByName("pokerGroup").getChildByName("poker" + i) != null) {
								self.playInfoArray[k].node.getChildByName("pokerGroup").getChildByName("poker" + i).destroy();
							}
						}
						if (!self.isRuzuo) {
							self.playNode.getChildByName("pos" + self.playInfoArray[k].deskNum).active = true;
						}
						delete self.playInfoArray[k];
						break;

					}
				}
			}
			if (info.StartPos != "0") {
				if (parseInt(info.StartPos) == self.deskNum) {
					self.isRoomer = true;
					cc.find('Canvas/mainNode/UI/startButton').active = true;
				}
			}


		});
		self.addMessage("got lineGame", function (msg) {
			var info = JSON.parse(msg);
			var role = self.getRoleByDeskNum(info.deskNum);
			role.node.getChildByName("disNode").active = false;
			role.node.getChildByName("roleType").color = new cc.Color(255, 255, 255);
		});
		self.addMessage("wait game", function (msg) {
			clearTimeout(self.conTimeout);
			self.showAlert("等待游戏开始...");
		});
		//服务器告知游戏结束
		self.addMessage("game over", function (msg) {
			var info = JSON.parse(msg);
			self.tanpaiButtonNode.active = false;
			self.audioControl.playSFX("over");
			//role.node.getChildByName("New Label").getComponent(cc.Label).string="+"+info.allXiazhu.toFixed(2);
			//role.node.getComponent(cc.Animation).play("win");
			/*    for(var i in self.playInfoArray)
		{
			var sum=0;
			for(var k=0;k<info.deskCoin.length;k++)
		{
			if(info.deskCoin[k].deskNum==self.playInfoArray[i].deskNum)
		{
			sum+=info.deskCoin[k].coin;
			}
			if(info.deskNum!=self.playInfoArray[i].deskNum)
		{
			self.playInfoArray[i].node.getChildByName("New Label").getComponent(cc.Label).string="-"+sum;
			self.playInfoArray[i].node.getComponent(cc.Animation).play("defeat");
			}
			}
			}*/
			var resultArr = [];
			for (var i = 0; i < info.data.length; i++) {
				var role = self.getRoleByDeskNum(parseInt(info.data[i].Pos));
				role.node.getChildByName("coinLabel").getComponent(cc.Label).string = info.data[i].Point;
				if (parseInt(info.data[i].IsWin) > 0) {
					cc.log("winwinwiwnin");
					role.node.getChildByName("New Label").getComponent(cc.Label).string = "+" + info.data[i].NowPoint;
					role.node.getComponent(cc.Animation).play("windn");
					resultArr.push({ deskNum: parseInt(info.data[i].Pos), result: parseInt(info.data[i].NowPoint) })
				}
				else {
					cc.log("defeat defeat defeat");
					role.node.getChildByName("New Label").getComponent(cc.Label).string = "-" + info.data[i].NowPoint;
					resultArr.push({ deskNum: parseInt(info.data[i].Pos), result: -parseInt(info.data[i].NowPoint) })
					role.node.getComponent(cc.Animation).play("defeat");
				}
			}
			self.startFlyClip({ resultArr: resultArr });
			setTimeout(function () {
				self.resetRoomData();
				self.readyButton.active = true;
			}, 3500);

		});



		self.addMessage("game begin", function (msg) {

			for (var k in self.playInfoArray) {
				if (k.indexOf("play") >= 0) {
					for (var i = 1; i < 6; i++) {
						var poker = cc.instantiate(self.pokerBackPre);
						poker.name = "back" + i;
						self.playInfoArray[k].node.getChildByName("pokerGroup").getChildByName("pos" + i).removeAllChildren();
						self.playInfoArray[k].node.getChildByName("pokerGroup").getChildByName("pos" + i).addChild(poker);
						poker.setPosition(self.playInfoArray[k].node.getChildByName("pokerGroup").getChildByName("pos" + i).convertToNodeSpace(cc.p(1080, 960)));
						poker.runAction(cc.moveTo(0.5, cc.p(0, 0)));

					}
				}
			}

		});
		self.addMessage("fapai", function (msg) {
			var p = 1;
			var info = JSON.parse(msg);
			for (var k = 1; k < 7; k++) {
				var role = self.playNode.getChildByName("play" + info.fapaiArr[k - 1]);
				for (var i = 2; i < 4; i++) {
					var poker = cc.instantiate(self.pokerBackPre);
					poker.scaleX = 1.7;
					poker.scaleY = 1.9;
					poker.name = "poker" + i;
					role.getChildByName("pokerGroup").addChild(poker);
					poker.setPosition(role.getChildByName("pokerGroup").convertToNodeSpaceAR(cc.p(360, 640)));
					poker.runAction(cc.sequence(cc.moveTo(0.2 * p, poker.position), cc.moveTo(0.2, role.getChildByName("pokerGroup").getChildByName("pos" + i))));
					p++;
				}
			}
		});
		self.addMessage("got fapai", function (msg) {
			var info = JSON.parse(msg);
			var role = self.getRoleByDeskNum(info.deskNum);
			if (self.pokerNum != 2) {
				for (var i = 1; i < 5; i++) {
					var poker = cc.instantiate(self.pokerBackPre);
					poker.scaleX = 1.7;
					poker.scaleY = 1.9;
					poker.name = "poker" + i;
					role.node.getChildByName("pokerGroup").addChild(poker);
					poker.setPosition(role.node.getChildByName("pokerGroup").getChildByName("pos" + i).convertToNodeSpace(cc.p(405, 640)));
					poker.runAction(cc.moveTo(0.5, role.node.getChildByName("pokerGroup").getChildByName("pos" + i)));
				}
			}
			else {
				for (var i = 2; i < 4; i++) {
					var poker = cc.instantiate(self.pokerBackPre);
					poker.scaleX = 1.7;
					poker.scaleY = 1.9;
					poker.name = "poker" + i;
					if (role.node.getChildByName("pokerGroup").getChildByName("poker" + i) != null) {
						role.node.getChildByName("pokerGroup").getChildByName("poker" + i).destroy();
					}
					role.node.getChildByName("pokerGroup").addChild(poker);
					poker.setPosition(role.node.getChildByName("pokerGroup").getChildByName("pos" + i).convertToNodeSpace(cc.p(1080, 540)));
					poker.runAction(cc.moveTo(0.5, role.node.getChildByName("pokerGroup").getChildByName("pos" + i)));
				}
			}
		});
		self.addMessage("got zhuang", function (msg) {
			var zhuang = JSON.parse(msg).deskNum;
			for (var k in self.playInfoArray) {
				if (k.indexOf("play") >= 0) {
					if (zhuang == self.playInfoArray[k].deskNum) {
						self.zhuangRole = self.playInfoArray[k];
						self.playInfoArray[k].node.getChildByName('zhuangNode').active = true;
					} else {
						self.playInfoArray[k].node.getChildByName('zhuangNode').active = false;
					}
				}
			}
		});
		self.addMessage("got ready", function (msg) {
			var zhuang = JSON.parse(msg).deskNum;
			for (var k in self.playInfoArray) {
				if (k.indexOf("play") >= 0) {
					if (zhuang == self.playInfoArray[k].deskNum) {
						self.playInfoArray[k].node.getChildByName('infoNode').getComponent(cc.Sprite).spriteFrame = self.infoTexture["ready"];
						if (zhuang == self.deskNum) {
							self.endSchedule();
							cc.find("Canvas/mainNode/UI/readyButton").active = false;
						}
					}
				}
			}
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
		this.heartTime = 0;
		for (var k = 1; k < 7; k++) {
			var role = this.playNode.getChildByName("play" + k);
			var pAr = role.getChildByName("pokerGroup").children;
			for (var q = 0; q < pAr.length; q++) {
				if (pAr[q].name.indexOf("poker") >= 0) {
					pAr[q].destroy();
				}
			}
			role.getChildByName("xiazhu").getComponent(cc.Label).string = "";
			role.getChildByName("zhuangNode").active = false;
			role.getChildByName("infoNode").getComponent(cc.Sprite).spriteFrame = null;
			role.getChildByName("type").getComponent(cc.Label).string = "";
		}
	},
	clearInfo: function () {
		for (var k in this.playInfoArray) {
			if (k.indexOf("play") >= 0) {
				//this.playInfoArray[k].node.getChildByName("infoNode").getComponent(cc.Sprite).spriteFrame = null;
			}
		}
	},
	clearSchedule: function () {
		this.endSchedule();
		this.robZhuangButtonNode.active = false;
		this.robBeishuButtonNode.active = false;
		this.xiazhuBeishuButtonNode.active = false;
		this.tanpaiButtonNode.active = false;
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
		this.scheduleNode.active = true;
		this.scheduleNode.getComponent("niuScheduleControl").startSchedule(callback);

	},
	endSchedule: function () {
		this.scheduleNode.getComponent("niuScheduleControl").endSchedule();
		this.scheduleNode.active = false;

	},
	overSchedule: function () {
		this.scheduleNode.getComponent("niuScheduleControl").overSchedule();
		this.scheduleNode.active = false;
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
		this.audioControl.playSFX("click");
		if (Global.socket.readyState == WebSocket.OPEN) {
			this.sendMessage("4", []);
		}
	},
	sendMessage: function (state, infoArray) {
		try {
			var jsInfo = {
				state: "9999999",
				RoomNum: this.roomNum,
				UserID: this.userid
			}
			jsInfo.state = state;
			for (var k = 0; k < infoArray.length; k++) {
				jsInfo[infoArray[k].head] = infoArray[k].body;
			}
			cc.log("send " + JSON.stringify(jsInfo));
			Global.socket.send(JSON.stringify(jsInfo));

		}
		catch (err) {
			cc.log(err);
		}
	},
	// called every frame, uncomment this function to activate update callback
	update: function (dt) { },
	backClick: function () {
		if (!this.isOver) {
			cc.find("Canvas/alertDialogNode").active = true;
		}
		else {
			this.unscheduleAllCallbacks();
			this.audioControl.stopBGM();
			Global.roomNum = null;
			cc.director.loadScene("hallScene");
		}
	},
	confimExit: function () {
		cc.find("Canvas/alertDialogNode").active = false;
		this.sendMessage("3", []);
	},
	closeExit: function () {
		setTimeout(function () {
			cc.find("Canvas/alertDialogNode").active = false;
		}, 500);
	},
	emojiBtClick: function () {
		cc.find("Canvas/emojiNode").active = true;
		cc.find("Canvas/mainNode").pauseSystemEvents(true);

	},
	emojiClose: function () {
		cc.find("Canvas/emojiNode").active = false;
		cc.find("Canvas/mainNode").resumeSystemEvents(true);
	},
	emojiChooseClick: function (e, msg) {
		var self = this;
		cc.find("Canvas/emojiNode").active = false;
		cc.find("Canvas/mainNode").resumeSystemEvents(true);
		var name = e.target.getComponent(cc.Sprite).spriteFrame.name;
		this.sendMessage("19", [{ head: "InfoType", body: "emoji" }, { head: "Url", body: name }]);
	},
	jiesanButtonClick: function () {
		cc.find("Canvas/mainNode/UI/settingNode").active = false;
		cc.find("Canvas/jiesanNode").active = true;
	},
	confirmJiesan: function () {
		cc.find("Canvas/jiesanNode").active = false;
		this.sendMessage("14", []);
	},
	cancelJieSan: function () {
		cc.find("Canvas/jiesanNode").active = false;
	},
	agreeJiesan: function () {
		this.sendMessage("15", []);
		if (typeof this.jiesanScheule != "undefined") {
			this.unschedule(this.jiesanScheule);
		}
		//	cc.find("Canvas/jiesanChooseNode").active = false;
	},
	disagreeJiesan: function () {
		this.sendMessage("16", []);
		if (typeof this.jiesanScheule != "undefined") {
			this.unschedule(this.jiesanScheule);
		}
		//	cc.find("Canvas/jiesanChooseNode").active = false;
	},
	msgClick: function (e, g) {
		var self = this;
		setTimeout(function () {

			cc.find("Canvas/msgNode").active = false;
			cc.find("Canvas/mainNode").resumeSystemEvents(true);
		}, 200);
		if (g != "text") {
			var name = e.target.getChildByName("msg").getComponent(cc.Label).string;
			this.sendMessage("19", [{ head: "InfoType", body: "msg" }, { head: "Url", body: name }]);
		}
		else {
			var tE = cc.find("Canvas/msgNode/dialog/msgEdit").getComponent(cc.EditBox).string;
			if (tE.length > 0) {
				this.sendMessage("19", [{ head: "InfoType", body: "text" }, { head: "Url", body: tE }]);
			}
		}
	},
	msgClose: function () {
		setTimeout(function () {

			cc.find("Canvas/msgNode").active = false;
			cc.find("Canvas/mainNode").resumeSystemEvents(true);
		}, 200);

	},
	msgBtClick: function () {
		cc.find("Canvas/msgNode").active = true;
		cc.find("Canvas/mainNode").pauseSystemEvents(true);
	},
	kaiguaButtonClcik: function () {
		this.sendMessage("22", []);
	},
	shareButtonClick: function () {
		this.audioControl.playSFX("click");
		var self = this;
		cc.log(this.roomData);
		// window.location.href="http://wap.ycluck.top/SendTo.html?state=1&"+this.HTTP.queryString(this.roomInfo)

	},
	reconnectButtonClick: function () {
		var self = this;
		self.showAlert("重新连接中。。。");
		self.initWebSocket();
		//	self.reconTime=setTimeout(function(){
		//	    if(Global.socket.readyState==WebSocket.CLOSED||Global.socket.readyState==WebSocket.CLOSING)
		//	    {
		//           self.initWebSocket();


		//	    }
		//		},10000);


	},
	robZhuangButtonClick: function (e, msg) {
		this.audioControl.playSFX("click");
		if (msg == "rob") {
			this.robZhuangButtonNode.active = false;
			this.robBeishuButtonNode.active = true;
		}
		else {
			Global.socket.send("32@&@" + this.userid + "@&@" + this.roomNum + "@&@0");
		}
	},
	readyButtonClick: function () {
		this.audioControl.playSFX("click");
		this.sendMessage("24", []);
	},
	xiazhuBeishuButtonClick: function (e, msg) {
		this.audioControl.playSFX("click");
		if (msg != "max") {
			var s = parseInt(cc.find("Canvas/mainNode/UI/xiazhuBeishuButtonNode/coin").getComponent(cc.Label).string) + parseInt(msg);
			if (s > this.MaxHang) {
				this.showToast("超出下注上限");
			}
			else {
				cc.find("Canvas/mainNode/UI/xiazhuBeishuButtonNode/coin").getComponent(cc.Label).string = s + "";
			}
		}
		else {
			cc.find("Canvas/mainNode/UI/xiazhuBeishuButtonNode/coin").getComponent(cc.Label).string = this.MaxHang + "";
		}
	},
	robBeishuButtonClick: function (e, msg) {
		this.audioControl.playSFX("click");
		Global.socket.send("32@&@" + this.userid + "@&@" + this.roomNum + "@&@" + msg);
	},
	zhanjiShareButtonClick: function () {
		this.audioControl.playSFX("click");
	},
	tanpaiButtonClick: function (e, msg) {
		var self = this;
		this.audioControl.playSFX("click");
		if (msg == "tanpai") {
			this.tanpaiButtonNode.active = false;
			this.sendMessage("6", []);
		}
		else {
			this.tanpaiButtonNode.active = false;
			self.cuopaiNode.active = true;
			var cuoControl = self.cuopaiNode.getComponent("cuopaiControl");
			cuoControl.init(self.pokerArray[self.playInfoArray["play1"].pokerArray[1]], function (msg, data) {
				if (msg == "ok") {
					var p = self.playInfoArray["play1"].node.getChildByName("pokerGroup");
					p.getChildByName("poker3").destroy();
					var np = cc.instantiate(self.pokerPre);
					np.getChildByName("num").getComponent(cc.Sprite).spriteFrame = data.num;
					np.getChildByName("smallHuase").getComponent(cc.Sprite).spriteFrame = data.smallHuase;
					np.getChildByName("bigHuase").getComponent(cc.Sprite).spriteFrame = data.bigHuase;
					np.name = "poker3";
					p.addChild(np);
					np.setPosition(p.getChildByName("pos3").position);
					setTimeout(function () {
						self.cuopaiNode.active = false;

					}, 500);
					self.tanpaiButtonNode.active = true;
				}
				if (msg = "cancel") {

					self.cuopaiNode.active = false;
					self.tanpaiButtonNode.active = true;

				}


			});





			//  this.cuopaiNode.active=true;
		}

	},
	startRandLight: function (desk, deskArr) {
		var self = this;
		self.lightIndex = 0;
		self.tempDesk = desk;
		self.tempDeskArr = deskArr;
		cc.find("Canvas/mainNode/UI/lightBack").active = true;
		this.schedule(
			function () {
				self.lightIndex++;
				self.audioControl.playSFX("rand");
				self.randLight(self, self.tempDesk, self.tempDeskArr);
			}, 0.2, (deskArr.length * 3) - 1, 0);
	},
	randLight: function (p, desk, deskArr) {
		var self = p;
		var rand = this.lightIndex - 1 - (deskArr.length * (Math.floor((this.lightIndex - 1) / deskArr.length)));
		cc.log("light index" + this.lightIndex);
		for (var i = 0; i < deskArr.length; i++) {
			var role = this.getRoleByDeskNum(parseInt(deskArr[i].Pos));
			if (this.lightIndex == (deskArr.length * 3)) {
				if (role.deskNum != desk) {
					role.node.getChildByName('zhuangNode').active = false;
					role.node.getChildByName("roleBack").getChildByName("light").active = false;
				}
				else {
					cc.find("Canvas/mainNode/UI/lightBack").active = false;
					role.node.getChildByName('zhuangNode').active = true;
					role.node.getChildByName("roleBack").getChildByName("light").active = true;
					self.audioControl.playSFX("dingzhuang");
					setTimeout(function () {
						var z = self.getRoleByDeskNum(desk);
						z.node.getChildByName("roleBack").getChildByName("light").active = false;
						self.onNetMessage("got canXiaZhu", JSON.stringify({
							zhuang: desk
						}));
					}, 1000);
				}
			}
			else {

				if (rand == i) {
					role.node.getChildByName("roleBack").getChildByName("light").active = true;
				}
				else {
					role.node.getChildByName("roleBack").getChildByName("light").active = false;
				}

			}
		}

	},
	weiguanButtonClick: function () {
		this.sendMessage("2", []);
	},
	xiazhuClearButtonCLick: function () {

		this.audioControl.playSFX("click");
		cc.find("Canvas/mainNode/UI/xiazhuBeishuButtonNode/coin").getComponent(cc.Label).string = "0";
	},
	confirmXiazhuClick: function () {

		this.audioControl.playSFX("click");
		var s = cc.find("Canvas/mainNode/UI/xiazhuBeishuButtonNode/coin").getComponent(cc.Label).string;
		if (parseInt(s) >= 0) {
			this.sendMessage("5", [{ head: "HangNum", body: s }, { head: "RoadNum", body: cc.find("Canvas/mainNode/UI/xiazhuBeishuButtonNode/dao").getComponent(cc.Label).string.substring(1, 2) }]);
		}
		else {
			this.showAlert("请选择下注金额");
		}
	},
	kaipaiButtonClick: function () {
		var self = this;
		cc.log(self.playInfoArray["play1"].pokerArray + "dksaodjoasdjaso");
		this.kaipaiButtonNode.active = false;

		this.audioControl.playSFX("click");
		var p = self.playInfoArray["play1"].node.getChildByName("pokerGroup");
		p.getChildByName("poker3").destroy();
		var np = cc.instantiate(self.pokerPre);
		np.getChildByName("num").getComponent(cc.Sprite).spriteFrame = self.pokerArray[self.playInfoArray["play1"].pokerArray[1]].num;
		np.getChildByName("smallHuase").getComponent(cc.Sprite).spriteFrame = self.pokerArray[self.playInfoArray["play1"].pokerArray[1]].smallHuase;
		np.getChildByName("bigHuase").getComponent(cc.Sprite).spriteFrame = self.pokerArray[self.playInfoArray["play1"].pokerArray[1]].bigHuase;
		np.name = "poker3";
		p.addChild(np);
		np.setPosition(p.getChildByName("pos3").position);
		setTimeout(function () {
			self.cuopaiNode.active = false;

		}, 500);

	},
	cuopaiButtonClick: function () {
		var self = this;
		this.kaipaiButtonNode.active = false;
		self.cuopaiNode.active = true;
		var cuoControl = self.cuopaiNode.getComponent("cuopaiControl");
		cuoControl.init(self.pokerArray[self.playInfoArray["play1"].pokerArray[1]], function (msg, data) {
			if (msg == "ok") {
				var p = self.playInfoArray["play1"].node.getChildByName("pokerGroup");
				p.getChildByName("poker3").destroy();
				var np = cc.instantiate(self.pokerPre);
				np.getChildByName("num").getComponent(cc.Sprite).spriteFrame = data.num;
				np.getChildByName("smallHuase").getComponent(cc.Sprite).spriteFrame = data.smallHuase;
				np.getChildByName("bigHuase").getComponent(cc.Sprite).spriteFrame = data.bigHuase;
				np.name = "poker3";
				p.addChild(np);
				np.setPosition(p.getChildByName("pos3").position);
				setTimeout(function () {
					self.cuopaiNode.active = false;

				}, 500);
				self.kaipaiButtonNode.active = true;
			}
			if (msg = "cancel") {

				self.cuopaiNode.active = false;
				self.kaipaiButtonNode.active = false;

			}


		});
	},


	joinPos: function (e, msg) {
		cc.log(msg);
		this.sendMessage("1", [{ head: "Pos", body: msg }])
	},
	tButtonClick: function (e, msg) {
		this.sendMessage("7", [{ head: "TPos", body: this.playInfoArray[msg].deskNum + "" }]);
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
		var name = e.target.parent.name;
	},
	xiazhuBeishuButtonClick: function (e, msg) {
		this.audioControl.playSFX("click");
		this.sendMessage("20", [{ head: "GuoHangType", body: msg }]);
	},
	initRecoder: function () {
		var self = this;
		var vB = cc.find("Canvas/mainNode/UI/msgButton");
		vB.on(cc.Node.EventType.TOUCH_START, function (event) {
			self.isOnPokerTouch = true;
			jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "startRecode", "(Ljava/lang/String;)V", "ok");
			cc.log("recode");
			vB.scaleX = 0.9;
			vB.scaleY = 0.9;

		}, self);
		vB.on(cc.Node.EventType.TOUCH_MOVE, function (event) {



		}, self);
		vB.on(cc.Node.EventType.TOUCH_END, function (event) {
			if (self.isOnPokerTouch) {
				var code = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "stopRecode", "(Ljava/lang/String;)Ljava/lang/String;", "ok");
				self.sendVoice(self.userid, code);
				cc.log("stop");

			}
			vB.scaleX = 1;
			vB.scaleY = 1;


			self.isOnPokerTouch = false;
		}, self);
		vB.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
			if (self.isOnPokerTouch) {
				self.sendVoice(self.userid, "qqqqq");
				var code = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "stopRecode", "(Ljava/lang/String;)Ljava/lang/String;", "ok");
				self.sendVoice(self.userid, code);
				cc.log("cancel stop");
			}
			vB.scaleX = 1;
			vB.scaleY = 1;
			self.isOnPokerTouch = false;
		}, self);

	},
	sendVoice: function (user, data) {
		var self = this;
		cc.log("发送语音");
		self.HTTP.post("http://576ht.ioonn.com", '/api/http/CreateSound', "UserID=" + user + "&Txt=" + data, function (result) {
			cc.log(result);
			if (result == "err") {
				self.showToast("发送语音失败")
			} else {
				var info = JSON.parse(result);
				if (info.UserID.length > 0) {



					self.sendMessage("19", [{ head: "InfoType", body: "voice" }, { head: "Url", body: info.UserID + "" }]);

				}
				else {

				}
			}

		});
	},
	playSound: function (user) {
		var self = this;

		self.HTTP.get("http://576ht.ioonn.com", '/api/http/GetSound', {
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

	startFlyClip: function (info) {
		var self = this;
		setTimeout(function () {
			for (var i in info.resultArr) {

				var role = self.getRoleByDeskNum(info.resultArr[i].deskNum);

				if (info.resultArr[i].result < 0) {
					var dy = 0 - role.node.y;
					var dx = 0 - role.node.x;
					var dr2 = dy * dy + dx * dx;
					var t = (Math.sqrt(dr2) / 400) * 0.4;
					if (dx == 0) {
						dx = 0.1;
					}
					var angle = Math.atan(dy / dx) * 180 / Math.PI;
					if (dx < 0) {
						angle += 180;
					}
					cc.log("time:" + t);
					cc.log("angle:") + angle;
					var flyClipNode = cc.instantiate(self.flyClipPre);
					role.node.parent.addChild(flyClipNode);
					flyClipNode.setPosition(role.node.position);
					var ps = flyClipNode.getComponent(cc.ParticleSystem);
					self.audioControl.playSFX("coin");
					//  ps.duration=t;
					ps.life = t;
					ps.angle = angle;
					ps.resetSystem();


				}

			}
			setTimeout(function () {
				for (var i in info.resultArr) {
					var role = self.getRoleByDeskNum(info.resultArr[i].deskNum);
					if (info.resultArr[i].result > 0) {
						var dy = -(0 - role.node.y);
						var dx = -(0 - role.node.x);
						var dr2 = dy * dy + dx * dx;
						var t = (Math.sqrt(dr2) / 400) * 0.4;
						if (dx == 0) {
							dx = 0.1;
						}
						var angle = Math.atan(dy / dx) * 180 / Math.PI;
						if (dx < 0) {
							angle += 180;
						}
						cc.log("time:" + t);
						cc.log("angle:") + angle;
						self.audioControl.playSFX("coin");
						var flyClipNode = cc.instantiate(self.flyClipPre);
						role.node.parent.addChild(flyClipNode);
						flyClipNode.setPosition(0, 0);
						var ps = flyClipNode.getComponent(cc.ParticleSystem);
						//  ps.duration=t;
						ps.life = t;
						ps.angle = angle;
						ps.resetSystem();


					}

				}

			}, 1000);



		}, 2000);
	}
});
