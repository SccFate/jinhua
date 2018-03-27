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
        keyNode:{
            default:null,
            type:cc.Node
        },
        str:"",
    },

    // use this for initialization
    onLoad: function () {
        var self=this;
        this.keyNodeControl=this.keyNode.getComponent("keycodeControl");
        this.keyNodeControl.init(6,function(str){
            cc.log(str);
            self.str=str;
            for(var i=1;i<str.length+1;i++)
            {
                var label=self.node.getChildByName("label"+i);
                label.getComponent(cc.Label).string=str[i-1];
            }
            
            for(var k=(str.length+1);k<7;k++)
            {
                var lab=self.node.getChildByName("label"+k);
                lab.getComponent(cc.Label).string=""; 
            }
        });

    },
    getStr:function()
    {
        return this.str;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
