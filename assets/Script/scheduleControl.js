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
        timeLimit:20,
        isPlaySound:false,
        isStart:false,
        audioControl:
        {
            default:null,
            type:cc.Node,
        },
    },

    // use this for initialization
    onLoad: function () {
      
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
         if(this.isStart)
         {
            var currrTime=new Date().getTime();
            var reduTime=(currrTime-this.startTime);
            var time=this.timeLimit*1000-reduTime;
            if(time>0)
            {
            if(time>5000)
            {
                this.node.color=new cc.Color(255,255,255);
            
            }
            else
            {
               this.node.color=new cc.Color(240,123,123); 
            }
            this.node.getComponent(cc.Sprite).fillRange=time/this.timeLimit/1000;
            }
            else
            {
                this.overSchedule();
            }
         }

     },
     startSchedule:function(callback)
     {
        this.startTime=new Date().getTime();
        this.isStart=true;
        this.callFunction=callback;
     },
     endSchedule:function()
     {
        this.isStart=false;
        this.callFunction=function(){};
     },
     overSchedule:function()
     {
        if(this.isStart)
        {
        this.callFunction();
        this.isStart=false;
        this.callFunction=function(){};
        }
     }
     
});
