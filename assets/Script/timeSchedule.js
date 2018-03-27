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
        timeLimit:30,
        isStart:false,
    },

    // use this for initialization
    onLoad: function () {
      
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
         if(this.isStart)
         {
            var currrTime=new Date().getTime();
            var reduTime=Math.floor((currrTime-this.startTime)/1000);
            var time=this.timeLimit-reduTime;
            if(time>0)
            {
                
                this.node.getComponent(cc.Label).string=time+"";
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
        this.callFunction=function(){};
        this.isStart=false;
        this.node.active=false;
        }
     }
     
});
