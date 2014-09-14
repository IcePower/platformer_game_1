
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = new cc.MenuItemImage(
            res.CloseNormal_png,
            res.CloseSelected_png,
            function () {
                cc.log("Menu is clicked!");
            }, this);
        closeItem.attr({
            x: size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        /////////////////////////////
        // 3. add your codes below...

	    this.scheduleUpdate();

	    var game = this.game = new Game();
	    this.setupDebugNode()

	    if( 'keyboard' in cc.sys.capabilities ) {
		    cc.eventManager.addListener({
			    event: cc.EventListener.KEYBOARD,
			    onKeyPressed:function(key, event) {
//					cc.log("Key down:" + key);
				    this.onKeyPressed(key, event);
			    }.bind(this),
			    onKeyReleased:function(key, event) {
//					cc.log("Key up:" + key);
				    this.onKeyReleased(key, event);
			    }.bind(this)
		    }, this)
	    } else {
		    cc.log("KEYBOARD Not supported");
	    }

        return true;
    },

	setupDebugNode : function()
	{
		// debug only
		var game = this.game;
		this._debugNode = cc.PhysicsDebugNode.create( game.space );
		this._debugNode.visible = true ;
		this.addChild( this._debugNode );
	},

	update: function(dt){
		this.game.update();
	},

	onKeyPressed: function(key, event){
		var layer = event.getCurrentTarget();
		layer.game.onKeyPressed(key);
	},

	onKeyReleased: function(key, event){
		var layer = event.getCurrentTarget();
		layer.game.onKeyReleased(key);
	}

});



var testClass = cc.Class.extend({
	test: 111,
	func: function(){
		cc.log('func');
	}
})

var testClass2 = cc.Class.extend({
	test: 222,
	func2: function(){
		cc.log(this.test);
		cc.log('func2');
	}
})

var testFunc = function(){
	cc.log(this.test);
	cc.log('testFunc');
}

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);

		var testObj = new testClass();
	    var testObj2 = new testClass2();
	    testObj.func = testObj2.func2;

	    testObj.func();
    }
});


