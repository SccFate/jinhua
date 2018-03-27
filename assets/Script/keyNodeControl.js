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
		cc.game.addPersistRootNode(this.node);
		var self=this;
		self.time=0;
		if (cc.sys.os == cc.sys.OS_ANDROID) {
			//
			cc.eventManager.addListener({
				event: cc.EventListener.KEYBOARD,
				onKeyPressed: function (keyCode, event) {
					if (keyCode == cc.KEY.back) {
						
					   var sc=cc.director.getScene();
					   var cut=new Date().getTime();
					   var isR=false;
					   if(sc.name=="dzzGameScene")
					   {
					       isRo=true;
					   }
					   if(cut-self.time>1000)
					   {
					       self.time=cut;
					       self.showToast(isR);
					   }
					   else
					   {
					       cc.director.end();
					   }
					}
				},
				onKeyReleased: function (keyCode, event) {}
			}, this);
		}
	},
	showToast:function(isRo)
	{
	    var node=this.node.getChildByName("toastNode");
	    if(isRo)
	    {
	        node=this.node.getChildByName("toastRotaNode");
	    }
	    node.active=true;
	    setTimeout(function() {
	        node.active=false;
	    },1000);
	}
	// called every frame, uncomment this function to activate update callback
	// update: function (dt) {

	// },
});
