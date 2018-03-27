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
	init: function (callback, p) {
		this.http = require("HTTP");
		this.resCallBack = callback;
		this.p = p;
		this.userid = cc.sys.localStorage.getItem("userid");
		this.url = "http://576ht.ioonn.com";

	},
	wechatLogin: function () {
		//  jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "weichatLogin");
		//window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8bd3d34781cdfc20&redirect_uri=http://game.ycluck.top/index.html&response_type=code&scope=snsapi_userinfo&state=1" + "" + "#wechat_redirect";
	},
	isWechatLogin: function () {
		cc.log(this.userid);
		if (typeof this.userid == "undefined") {
			return false;
		}
		else {
			if (this.userid === null) {
				return false;
			}
			else {
				if (this.userid.length > 0) {
					return true;
				}
				else {
					return false;
				}
			}
		}
	},
	codeToUserid: function (code) {
		var self = this;
		self.http.get("http://luck.ycluck.top:8080","/api/http/WatchLogin", {
			code: code
		}, function (resau) {
			if (resau == "err") {
				self.resCallBack("err","登录失败",self.p);
			} else {
				var da = JSON.parse(resau);
				if (da.UserID == "0") {
					self.resCallBack("err", "登录失败", self.p);
				} else {
					self.userid = da.UserID;
					cc.sys.localStorage.setItem("userid", self.userid);
					self.resCallBack("login", self.userid, self.p);
				}
			}

		});
	},
	getPayUrl: function (user,type,price) {
		var self = this;
		self.http.get(this.url, "/api/http/getPay", {
			UserID: user,
			Type:type,
			Money:price
		}, function (resau) {
			if (resau == "err") {
				self.resCallBack("err","连接错误",self.p);
			} else {
				var da = JSON.parse(resau);
				if (da.url.length>0) {
					self.resCallBack("pay", da, self.p);
				} else {

					self.resCallBack("err", "支付失败", self.p);
				}
			}

		});
	},
	getUrlPram: function (name) {
		var url = window.location.href.toString();
		var obj = {};
		var start = url.indexOf("?") + 1;
		var str = url.substr(start);
		var arr = str.split("&");
		for (var i = 0; i < arr.length; i++) {
			var arr2 = arr[i].split("=");
			obj[arr2[0]] = arr2[1];
		}
		return obj[name];
	},
	createNetRoom: function (info) {
		var self = this;
		self.http.get(this.url, "/api/http/OpenRoom", info, function (res) {
			if (res == "err") {

				self.resCallBack("err", "服务器连接错误", self.p);

			} else {
				var data = JSON.parse(res);
				data.state = parseInt(data.state);
				if (data.state == 1) {
					var gameUrl = "";
					cc.log(data.RoomNum + " create ok");
					self.resCallBack("createroom", data, self.p);
					//window.location.href = gameUrl + "?roomnum=" + data.roomID;
				} else {
					if (data.state == 0) {
						self.resCallBack("err", "创建失败", self.p);

					}
					if (data.state == 2) {
						self.resCallBack("err", "房卡不足", self.p);
					}

				}

			}

		});

	},
	checkYqm:function(user)
	{
		var self = this;
		var info = {

			UserID: user

		};
		self.http.get(this.url, "/api/http/CheckCode", info, function (res) {
			if (res == "err") {

				self.resCallBack("err", "服务器连接错误", self.p);

			} else {
				var da = JSON.parse(res);
				self.resCallBack("yqm", da, self.p);

			}

		});
	},
	createDnNetRoom: function (info) {
		var self = this;
		self.http.get("http://wap.ycluck.top", "/api/UserInfo/OpenNiuRoom", info, function (res) {
			if (res == "err") {

				self.resCallBack("err", "服务器连接错误", self.p);

			} else {
				var data = JSON.parse(res);
				data.state = parseInt(data.state);
				if (data.state == 1) {

					var gameUrl = "";
					cc.log(data.RoomID + " create ok");
					self.resCallBack("creatednroom", data, self.p);
					//window.location.href = gameUrl + "?roomnum=" + data.roomID;
				} else {
					if (data.state == 0) {
						self.resCallBack("err", "用户不存在", self.p);

					}
					if (data.state == 2) {
						self.resCallBack("err", "房卡不足", self.p);
					}
					if (data.state == 4) {
						self.resCallBack("err", "账号已禁用", self.p);
					}

				}

			}

		});

	},
	informRoom: function (room, info) {
		var self = this;
		delete info["userid"];
		info["RoomNum"] = room;
		self.http.get("http://api.ycluck.top", "/api/http/DoSet", info, function (res) {
			if (res == "err") {

				self.resCallBack("err", "服务器连接错误", self.p);

			} else {
				var data = JSON.parse(res);
				data.state = parseInt(data.state);
				if (data.state == 1) {

					self.resCallBack("inform", info["RoomNum"], self.p);

					//window.location.href = gameUrl + "?roomnum=" + data.roomID;
				} else {
					if (data.state == 0) {
						self.resCallBack("err", "用户不存在", self.p);

					}
					if (data.state == 2) {
						self.resCallBack("err", "房卡不足", self.p);
					}

				}

			}

		});
	},
	getPersonZhanji: function (user) {
		var self = this;
		var info = {

			UserID: user

		};
		self.http.get(this.url, "/api/http/GetPlayResult", info, function (res) {
			if (res == "err") {

				self.resCallBack("err", "服务器连接错误", self.p);

			} else {
				var da = JSON.parse(res);
				self.resCallBack("zhanji", da, self.p);

			}

		});
	},
	getPersonInfo: function (user) {
		var self = this;
		var info = {

			UserID: user

		};
		self.http.get(self.url, "/api/http/GetUserInfo", info, function (res) {
			if (res == "err") {

				self.resCallBack("err", "服务器连接错误", self.p);

			} else {
				var da = JSON.parse(res);
				if (da.state == 1) {

					self.resCallBack("userinfo", da, self.p);

				} else {

					self.resCallBack("err", "服务器连接错误", self.p);

				}

			}

		});

	},
	getHuiyuanList: function (user) {
		var self = this;
		var info = {

			userid: user

		};
		self.http.get("http://wap.ycluck.top", "/api/UserInfo/GetUserList", info, function (res) {
			if (res == "err") {

				self.resCallBack("err", "服务器连接错误", self.p);

			} else {
				var da = JSON.parse(res);
				if (da.state == 1 || da.state === 0) {

					self.resCallBack("huiyuanlist", da, self.p);

				} else {

					self.resCallBack("err", "服务器连接错误", self.p);

				}

			}

		});

	},
	getVipCoinList: function (user) {
		var self = this;
		var info = {

			userid: user

		};
		self.http.get("http://wap.ycluck.top", "/api/UserInfo/GetGuaLogList", info, function (res) {
			if (res == "err") {

				self.resCallBack("err", "服务器连接错误", self.p);

			} else {
				var da = JSON.parse(res);
				if (da.state == 1 || da.state === 0) {

					self.resCallBack("vipcoinlist", da, self.p);

				} else {

					self.resCallBack("err", "服务器连接错误", self.p);

				}

			}

		});
	},
	getDailiCoinList: function (user) {
		var self = this;
		var info = {

			userid: user

		};
		self.http.get("http://wap.ycluck.top", "/api/UserInfo/GetCommissionData", info, function (res) {
			if (res == "err") {

				self.resCallBack("err", "服务器连接错误", self.p);

			} else {
				var da = JSON.parse(res);
				if (da.state == 1 || da.state === 0) {

					self.resCallBack("dailicoinlist", da, self.p);

				} else {

					self.resCallBack("err", "服务器连接错误", self.p);

				}

			}

		});
	},
	getYaoqingma: function (user) {
		var self = this;
		var info = {

			userid: user

		};
		self.http.get("http://wap.ycluck.top", "/api/UserInfo/CheckCode", info, function (res) {
			if (res == "err") {

				self.resCallBack("err", "服务器连接错误", self.p);

			} else {
				var da = JSON.parse(res);
				if (da.state == 1 || da.state === 0) {

					self.resCallBack("yaoqingma", da, self.p);

				} else {

					self.resCallBack("err", "服务器连接错误", self.p);

				}

			}

		});
	},
	bdYaoqingma: function (user, code) {
		var self = this;
		var info = {

			UserID: user,
			ObjID: code

		};
		self.http.get(this.url, "/api/http/BindCode", info, function (res) {
			if (res == "err") {

				self.resCallBack("err", "服务器连接错误", self.p);

			} else {
				var da = JSON.parse(res);
				if (da.state == "1") {

					self.resCallBack("bdyaoqingma", da, self.p);

				} else {

					self.resCallBack("err", "邀请码无效", self.p);

				}

			}

		});
	},
	setVip: function (user) {
		var self = this;
		var info = {

			userid: user,
			State: 1

		};
		self.http.get("http://wap.ycluck.top", "/api/UserInfo/SetVIP", info, function (res) {
			if (res == "err") {

				self.resCallBack("err", "服务器连接错误", self.p);

			} else {
				var da = JSON.parse(res);
				if (da.state == 1 || da.state === 0) {

					self.resCallBack("setvip", da, self.p);

				} else {

					self.resCallBack("err", "服务器连接错误", self.p);

				}

			}

		});
	},
	cancelVip: function (user) {
		var self = this;
		var info = {

			userid: user,
			State: 0

		};
		self.http.get("http://wap.ycluck.top", "/api/UserInfo/SetVIP", info, function (res) {
			if (res == "err") {

				self.resCallBack("err", "服务器连接错误", self.p);

			} else {
				var da = JSON.parse(res);
				if (da.state == 1 || da.state === 0) {

					self.resCallBack("cancelvip", da, self.p);

				} else {

					self.resCallBack("err", "服务器连接错误", self.p);

				}

			}

		});
	},
	sendCard: function (user, to, num) {
		var self = this;
		var info = {
			UserID: user,
			ToID: to,
			Num: num
		};
		self.http.get("http://wap.ycluck.top", "/api/UserInfo/ToSend", info, function (res) {
			if (res == "err") {

				self.resCallBack("err", "服务器连接错误", self.p);

			} else {
				var da = JSON.parse(res);
				if (da.state >= 0) {

					self.resCallBack("sendcard", da, self.p);

				} else {

					self.resCallBack("err", "服务器连接错误", self.p);

				}

			}

		});
	},
	JoinRoom: function (user, roomNum) {
		var self = this;
		var query = {
			UserID: user,
			RoomNum: roomNum
		};
		self.http.get(this.url, '/api/http/JoinRoom', query, function (result) {
			cc.log(result);
			if (result == "err") {
				self.resCallBack("err", "服务器连接错误", self.p);
			} else {
				var info = JSON.parse(result);
				if (info.state == 0) {
					self.resCallBack("err", "房间不存在", self.p);
				}
				if (info.state == 1) {
					query.RoomType = info.RoomType;
					self.resCallBack("joinroom", query, self.p);
				}
				if (info.state == 2) {

					self.resCallBack("err", "牌局已经结束", self.p);
				}
				if (info.state == 3) {
					self.resCallBack("err", "牌局已开始房主不允许加入", self.p);
				}
				if (info.state == 4) {
					self.resCallBack("err", "房卡不足", self.p);
				}
			}

		});
	},
	getShangchengInfo: function (user) {
		var self = this;

		var query = {
			UserID: user
		};
		self.http.get(this.url, '/api/http/GetShop', query, function (result) {
			cc.log(result);
			if (result == "err") {
				self.resCallBack("err", "服务器连接错误", self.p);
			} else {
				var info = JSON.parse(result);
				self.resCallBack("shangchenginfo", info, self.p);
			}

		});
	},
	getPayInfo: function (user) {
		var self = this;

		var query = {
			UserID: user
		};
		self.http.get(this.url, '/api/http/GetPaylog', query, function (result) {
			cc.log(result);
			if (result == "err") {
				self.resCallBack("err", "服务器连接错误", self.p);
			} else {
				var info = JSON.parse(result);
				self.resCallBack("payinfo", info, self.p);
			}

		});
	},
	checkUserRoom: function (user) {
		var self = this;

		var query = {
			UserID: user
		};
		self.http.get(this.url, '/api/http/CheckUser', query, function (result) {
			cc.log(result);
			if (result == "err") {
				self.resCallBack("err", "服务器连接错误", self.p);
			} else {
				var info = JSON.parse(result);
				if (info.RoomNum == "0") {

					self.resCallBack("noJoinedRoom", "ok", self.p);
				}
				else {
					self.resCallBack("joineroom", info, self.p);
				}
			}

		});
	},
	checkHasRoom: function (user) {
		var self = this;

		var query = {
			UserID: user
		};
		self.http.get(this.url, '/api/http/CheckRoom', query, function (result) {
			cc.log(result);
			if (result == "err") {
				self.resCallBack("err", "服务器连接错误", self.p);
			} else {
				var info = JSON.parse(result);
				if (info.RoomNum == "0") {

					self.resCallBack("noJoinedRoom", "ok", self.p);
				}
				else {
					self.resCallBack("joineroom", info, self.p);
				}
			}

		});
	},
	getNotice: function () {
		var self = this;
		self.http.get(this.url, '/api/http/GetInfo', null, function (result) {
			cc.log(result);
			if (result == "err") {
				self.resCallBack("err", "服务器连接错误", self.p);
			} else {
				var info = JSON.parse(result);
				self.resCallBack("notice", info.Content, self.p);
			}

		});

	},

	// called every frame, uncomment this function to activate update callback
	// update: function (dt) {

	// },
});
