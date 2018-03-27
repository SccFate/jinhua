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
        this.str="";
        this.limit=6;
        this.callback=function(){
            
        };
    },
    init:function(limit,callback)
    {
        
        this.limit=limit;
        this.callback=callback;
    },
    setStr:function(str)
    {
        this.str=str;
        this.callback(this.str);
    },
    keyCodeClear:function()
    {
        this.str="";
        this.callback(this.str);
    },
    keyCodeDelete:function()
    {
        if(this.str.length>1)
        {
        this.str=this.str.substring(0,this.str.length-1);
        }
        else
        {
        if(this.str.length==1)
        {
        this.str="";   
        }
        }
        this.callback(this.str);
        
    },
    keyClick:function(e,msg)
    {
        if(this.str.length<this.limit)
        {
        this.str+=msg;
        this.callback(this.str);
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
