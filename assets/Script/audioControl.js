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

		audio: {
			url: cc.AudioClip,
			default:
				null
		},
		musicButton:
			{
				default: null,
				type: cc.Node,
			},
		soundButton:
			{
				default: null,
				type: cc.Node,
			},
		bgmVolume: 0.6,
		sfxVolume: 1,
		isBanMusic: false,
		isBanSound: false,
		bgmAudioID: -1,
		sfxId: -1,
		state: ""
	},

	// use this for initialization
	init: function (state) {
		this.state = state;
		var t = cc.sys.localStorage.getItem("bgmVolume");
		if (t !== null) {
			this.bgmVolume = parseFloat(t);
		}

		var t = cc.sys.localStorage.getItem("sfxVolume");
		if (t !== null) {
			this.sfxVolume = parseFloat(t);
		}
		if (this.bgmVolume === 0) {
			this.isBanMusic = true;
			this.musicButton.getChildByName("banNode").active = true;
		}
		if (this.sfxVolume === 0) {
			this.isBanSound = true;
			this.soundButton.getChildByName("banNode").active = true;
		}
		this.loadSlide();
		/*
		cc.game.on(cc.game.EVENT_HIDE, function () {
			console.log("cc.audioEngine.pauseAll");
			cc.audioEngine.pauseAll();
		});
		cc.game.on(cc.game.EVENT_SHOW, function () {
			console.log("cc.audioEngine.resumeAll");
			cc.audioEngine.resumeAll();
		});*/
	},

	// called every frame, uncomment this function to activate update callback
	// update: function (dt) {

	// },

	getUrl: function (url) {

		cc.loader.load(cc.url.raw("resources/sound/" + url + ".mp3"), function (err, res) { });

	},

	playBGM: function (url) {


		var self = this;

		if (self.bgmAudioID >= 0) {
			cc.audioEngine.stop(self.bgmAudioID);
		}
		self.bgmAudioID = cc.audioEngine.play(cc.url.raw("resources/sound/" + url + ".mp3"), true, self.bgmVolume);

	},

	playSFX: function (url) {

		if (this.sfxVolume > 0) {
			cc.audioEngine.play(cc.url.raw("resources/sound/" + url + ".mp3"), false, this.sfxVolume);
		}

	},

	setSFXVolume: function (v) {
		if (this.sfxVolume != v) {
			cc.sys.localStorage.setItem("sfxVolume", v);
			this.sfxVolume = v;
		}
		if (v > 0) {
			this.isBanSound = false;
			this.soundButton.getChildByName("banNode").active = false;
		}
		else {
			this.isBanSound = true;
			this.soundButton.getChildByName("banNode").active = true;
		}

	},
	stopBGM: function () {
		if (this.bgmAudioID >= 0) {
			cc.audioEngine.stop(this.bgmAudioID);
		}
	},
	setBGMVolume: function (v) {
		if (this.bgmVolume != v) {
			cc.sys.localStorage.setItem("bgmVolume", v);
			this.bgmVolume = v;
			cc.audioEngine.setVolume(this.bgmAudioID, v);
		}
		if (v > 0) {
			this.musicButton.getChildByName("banNode").active = false;
			this.isBanMusic = false;
		}
		else {
			this.musicButton.getChildByName("banNode").active = true;

			this.isBanMusic = true;
		}
	},
	pauseAll: function () {
		cc.audioEngine.pauseAll();
	},

	resumeAll: function () {
		cc.audioEngine.resumeAll();
	},

	musicButtonClick: function () {
		this.playSFX("click");
		if (this.isBanMusic) {
			this.musicButton.getChildByName("banNode").active = false;
			this.isBanMusic = false;
			this.setBGMVolume(1.0);
		}
		else {
			this.musicButton.getChildByName("banNode").active = true;
			this.isBanMusic = true;
			this.setBGMVolume(0);
		}
		this.loadSlide();
	},
	voiceButtonClick: function () {
		this.playSFX("click");
		if (this.isBanSound) {
			this.soundButton.getChildByName("banNode").active = false;
			this.isBanSound = false;
			this.setSFXVolume(1.0);
		}
		else {
			this.soundButton.getChildByName("banNode").active = true;
			this.isBanSound = true;
			this.setSFXVolume(0);
		}
		this.loadSlide();
	},
	loadSlide: function () {
		cc.find("Canvas/settingDialogNode/dialog/soundSlider").getComponent(cc.Slider).progress = this.sfxVolume;
		cc.find("Canvas/settingDialogNode/dialog/soundSlider").getComponent("sliderControl").slide(cc.find("Canvas/settingDialogNode/dialog/soundSlider").getComponent(cc.Slider), "sound");
		cc.find("Canvas/settingDialogNode/dialog/musicSlider").getComponent(cc.Slider).progress = this.bgmVolume;
		cc.find("Canvas/settingDialogNode/dialog/musicSlider").getComponent("sliderControl").slide(cc.find("Canvas/settingDialogNode/dialog/musicSlider").getComponent(cc.Slider), "music");

	}


});
