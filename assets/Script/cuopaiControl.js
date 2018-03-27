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
        back:
        {
            default:null,
            type:cc.Node
        },
        poker:{
            default:null,
            type:cc.Node
        }
    },

    // use this for initialization
    init:function(info,call)
    {
        var self=this;
        this.callback=call;
        this.startY=0;
        this.back.y=0;
        this.back.active=true;
        this.onTouch=true;
        this.info=info;
		this.poker.getChildByName("num").getComponent(cc.Sprite).spriteFrame = info.num;
		this.poker.getChildByName("smallHuase").getComponent(cc.Sprite).spriteFrame = info.smallHuase;
		this.poker.getChildByName("bigHuase").getComponent(cc.Sprite).spriteFrame = info.bigHuase;
		this.back.on(cc.Node.EventType.TOUCH_START, function (event) {
		    if(self.onTouch)
		    {
			var touches = event.getTouches();
			var touch = this.back.convertToNodeSpace(touches[0].getLocation());
			self.startY=touch.y;
		    }
		}, self);
		this.back.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
		    if(self.onTouch)
		    {
			var touches = event.getTouches();
			var touch = touches[0];
			var dy=touch.getDelta().y;
			var dx=touch.getDelta().x;
			if(self.back.y<(-self.back.height+100)||self.back.y>(self.back.height-100)||self.back.x<(-self.back.width+100)||self.back.x>(self.back.width-100))
			{
			    self.back.runAction(cc.moveTo(0.2,cc.p(0,-2000)));
			    self.onTouch=false;
			    setTimeout(function()
			    {
			    self.callback("ok",self.info);
			    },500);
			}
			else
			{
				self.back.y+=dy;
				self.back.x+=dx;
			}
		    }
		}, self);
		this.back.on(cc.Node.EventType.TOUCH_END, function (event) {
			var touches = event.getTouches();
			var touch = this.back.convertToNodeSpace(touches[0].getLocation());
		}, self);
		this.back.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
		}, self);
    },
    cancel:function()
    {
         this.callback("cancel");
    }
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
