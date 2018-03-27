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
        defaultSprite:
        {
            default:null,
            type:cc.SpriteFrame,
        },
        pressSprite:
        {
            default:null,
            type:cc.SpriteFrame,
        },
        button:
        {
            default:null,
            type:cc.Node,
        },
        defaultState:"default",
        callBackNode:
        {
            default:null,
            type:cc.Component.EventHandler
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    buttonClick:function()
    {
        if(this.defaultState=="default")
        {
            this.defaultState="press";
            this.button.getComponent(cc.Sprite).spriteFrame=this.pressSprite;
        }
        else
        {
            this.defaultState="default";
            this.button.getComponent(cc.Sprite).spriteFrame=this.defaultSprite;
        }
        this.callBackNode.emit([this.defaultState]);
    },
    resetState:function()
    {
        this.defaultState="default";
        this.button.getComponent(cc.Sprite).spriteFrame=this.defaultSprite;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
