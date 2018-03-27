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
        playNode:
        {
            default:[],
            type:[cc.Node],
        },
        dizhuqi:
        {
            default:null,
            type:cc.Node,
        },
        personState:
        {
            default:null,
            type:cc.Node,
        },
        gameState:
        {
            default:null,
            type:cc.Node,
        },
        
        
    },

    // use this for initialization
    onLoad: function () {
    },
    
    setResultInfo:function(info)
    {
        for(var i=0;i<info.length;i++)
        {
        cc.log(info[i].roleName);
        this.playNode[i].getChildByName("nameLabel").getComponent(cc.Label).string=info[i].roleName;
        this.playNode[i].getChildByName("baseCoinLabel").getComponent(cc.Label).string=info[i].baseCoin;
        this.playNode[i].getChildByName("beishuLabel").getComponent(cc.Label).string=info[i].beishu;
        this.playNode[i].getChildByName("resultLabel").getComponent(cc.Label).string=info[i].coinResult;
        }
    },
    setDizhuqi:function(i)
    {
      this.dizhuqi.y = this.playNode[i].y; 
    },
    setPersonState:function(type,state)
    {
        this.personState.getChildByName("dizhuwin").active=false;
        this.personState.getChildByName("dizhudefeat").active=false;
        this.personState.getChildByName("nongminwin").active=false;
        this.personState.getChildByName("nongmindefeat").active=false;
        this.personState.getChildByName(type+state).active=true;
        this.gameState.getChildByName("winNode").active=false;
        this.gameState.getChildByName("defeatNode").active=false;
        this.gameState.getChildByName(state+"Node").active=true;
        
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
