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
        path:"",
        time:0.1,
        currIndex:0,
    },
    // use this for initialization
    load: function () {
        var self=this;
        self.fontTexure=[];
		cc.loader.loadResDir(self.path, cc.SpriteFrame, function (err, assets) {
			var sflist = assets;
			for (var k = 0; k < sflist.length; k++) {
				var frame = sflist[k];
				self.fontTexure.push(frame);
			}
			self.node.getComponent(cc.Sprite).spriteFrame=self.fontTexure[self.currIndex];
			self.currIndex++;
			self.startEmoji();
		});

    },
    startEmoji:function()
    {
       var self=this;
       this.schedule(function(){
           if(self.currIndex>(self.fontTexure.length-1))
           {
             self.currIndex=0;   
           }
           self.node.getComponent(cc.Sprite).spriteFrame=self.fontTexure[self.currIndex];
           self.currIndex++;
           
       },this.time); 
        
    },
    clearSchedule:function()
    {
     this.unscheduleAllCallbacks(); 
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
