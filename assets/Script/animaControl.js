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
        this.isStop=true;
       
    },
    play:function(name)
    {
       this.isStop=false;
       this.node.active=true;
       var anima=this.node.getComponent(cc.Animation);
       anima.play(name);
       cc.log("play dniasojdoasjdoasjdopasjdo");
       
    },
    end:function()
    {
        this.isStop=true;
        this.node.active=false;
    },
    setBiPokerName:function(one,oneS,two,twoS)
    {
        this.node.active=true;
        var play1=cc.find("Canvas/pokerAnimation/biPoker/play1");  
        var play2=cc.find("Canvas/pokerAnimation/biPoker/play2"); 
        play1.getChildByName("name").getComponent(cc.Label).string=one;
        play1.getChildByName("head").getComponent(cc.Sprite).spriteFrame=oneS;
        play2.getChildByName("name").getComponent(cc.Label).string=two;
        play2.getChildByName("head").getComponent(cc.Sprite).spriteFrame=twoS;
        play1.getChildByName("pokerGroup").removeAllChildren();
        play2.getChildByName("pokerGroup").removeAllChildren();
        play1.getChildByName("defaultPoker").active=true;
        play2.getChildByName("defaultPoker").active=true;
        
        
        
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
