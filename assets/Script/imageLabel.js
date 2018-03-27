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
        string:"123",
        fontLength:20,
        fontPath:"",
        fontTexure:[],
        isLoad:false,
    },

    // use this for initialization
    onLoad: function () {
       // this.setString(this.string);
    },
    setString:function(str)
    {
        this.node.removeAllChildren();
        if(this.isLoad)
        {
        this.string=str;
        for(var i=0;i<str.length;i++)
        {
            var sp=this.fontTexure[str[i]];
            var newFont=new cc.Node();
            newFont.addComponent(cc.Sprite);
            newFont.getComponent(cc.Sprite).spriteFrame=sp;
            
            this.node.addChild(newFont);
            newFont.setPosition((-str.length)*this.fontLength/2+this.fontLength/2+i*(this.fontLength-5),0);
            newFont.height=this.fontLength;
            newFont.width=sp.getOriginalSize().width*newFont.height/sp.getOriginalSize().height;
        }
        }
        else
        {
        var self=this;
        cc.log(this.fontPath);
		cc.loader.loadRes(this.fontPath, cc.SpriteAtlas, function (err, assets) {
			var sflist = assets.getSpriteFrames();
			for (var k = 0; k < sflist.length; k++) {
				var frame = sflist[k];
				self.fontTexure[frame.name] = frame;
			    
			}
			self.isLoad=true;
			self.setString(str);
		});   
        }
        
    },
    
    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
