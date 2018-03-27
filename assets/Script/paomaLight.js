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
       limitLength:1000,
       speed:10,
       data:{
           default:[],
           type:cc.String,
       },
    },
    
    // use this for initialization
    onLoad: function () {
        var self=this;
        self.pauseStr=false;
        this.index=0;
        self.data=self.node.getComponent(cc.Label).string;
        self.showShort=false;
        this.schedule(function(){
        var label=self.node;
        var strL=label.width;
        if(strL>self.limitLength)
        {
            if(!self.pauseStr)
            {
            self.node.x-=self.speed;
            }
            if(self.node.x<(-(strL-self.limitLength))&&!self.pauseStr)
            {
               self.pauseStr=true;
               setTimeout(function() {
                   self.pauseStr=false;
                   self.node.x=0;
                   self.index++;
                   if(self.index>(self.data.length-1))
                   {
                       self.index=0;
                   }
                   self.node.getComponent(cc.Label).string=self.data;
                   self.showShort=true;
               }, 1000);
            }
        }
        else
        {
            if(self.showShort)
            {
            self.showShort=false;
            setTimeout(
                function(){
                   self.index++;
                   if(self.index>(self.data.length-1))
                   {
                       self.index=0;
                   }
                   self.node.getComponent(cc.Label).string=self.data;
                   self.showShort=true;
                },5000)
            }
        }
            
            
            
        },0.1);

    },
    setData:function(da){
        this.node.x=0;
        this.data=da;
        this.index=0;
        this.node.getComponent(cc.Label).string=da;
    }

    // called every frame, uncomment this function to activate update callback
});
