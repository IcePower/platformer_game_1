/**
 * Created with JetBrains WebStorm.
 * User: icepower
 * Date: 14-9-13
 * Time: 下午7:51
 * To change this template use File | Settings | File Templates.
 */
var groundNormal= cp.v(0,0);
var Game = 
//cc.Layer.extend
cc.Class.extend
({
	directionInput: eDirectionMask.NoWhere,
	jumpState:0,
//	groundNormal:null,
	ctor: function () {
//    this._super();
		this.onEnter();

	},
  initPhysics:function() {
		var space = this.space = new cp.Space();
		space.gravity = cp.v(0, -GRAVITY);
		space.enableContactGraph = true;

//		this.groundNormal= cp.v(0,0);
		// 地面
		var radius = 0.5;

		var c = cp.v(100, 200);
		var d = cp.v(500, 200);
		var tangent = cp.v.normalize(cp.v.sub(d, c));
		var a = cp.v.add(c, cp.v.mult(tangent, radius));
		var b = cp.v.sub(d, cp.v.mult(tangent, radius));

		var shape = new cp.SegmentShape(space.staticBody, a, b, radius);
		shape.setFriction(1.0);
		shape.setElasticity(1.0);
		space.addShape(shape);

		// 墙
		var verts = [
			0, 0,
			0, 300,
			50, 300,
			50, 0
		];
		var wallShape = space.addShape(new cp.PolyShape(space.staticBody, verts, cp.v(400, 200)));
		wallShape.setFriction(1.0);
		wallShape.setElasticity(1.0);

		//Add box shape
		var DENSITY = 1 / 10000;
		var width = 50;
		var height = 50;
		var mass = width * height * DENSITY;
		var moment = cp.momentForBox(mass, width, height);
		var box = space.addBody(new cp.Body(mass, moment));
		box.setPos(cc.p(150, 300));
		this.shape = space.addShape(new cp.BoxShape(box, width, height));
		this.shape.setFriction(0.6);

		// 创建玩家。
		var playerBody = this.playerBody = space.addBody(new cp.Body(5, Infinity));
		playerBody.setPos(cp.v(300, 300));
		playerBody.velocity_func = this.playerUpdateVelocity.bind(this);

		this.playerShape = space.addShape(new cp.CircleShape(playerBody, 30.0, cp.vzero));
/*
        this.space.setDefaultCollisionHandler(
            this.collisionBegin.bind(this),
						null,null,null
//            this.collisionPre.bind(this),
//            this.collisionPost.bind(this),
//            this.collisionSeparate.bind(this)
        );
*/
		},
    onEnter : function() {
//        cc.Class.prototype.onEnter.call(this);
//        this._super();
				console.log("onEnter");
				this.initPhysics();
	},
 	collisionBegin : function ( arbiter, space ) {

    	this.playerBody.eachArbiter(function(arbiter){
        var i;
        for(i=0; i<arbiter.contacts.length; i++){            
						var n = cp.vneg(this.contacts[i].n);
						if(n.y > groundNormal.y){
							groundNormal = n;
					}
			}
            console.log(arbiter);
        });
		console.log("collBegin");
		return true;
	},
	update: function () {
		this.space.step(FIXED_DT);

	},

	onKeyPressed: function (key) {
		if (key === cc.KEY.w || key === cc.KEY.up) {
			this.directionInput |= eDirectionMask.Up;
			this.jumpState==0?this.jumpState=1:null;
			;
		}

		if (key === cc.KEY.s || key === cc.KEY.down) {
			this.directionInput |= eDirectionMask.Down;
		}

		if (key === cc.KEY.a || key === cc.KEY.left) {
			this.directionInput |= eDirectionMask.Left;
		}

		if (key === cc.KEY.d || key === cc.KEY.right) {
			this.directionInput |= eDirectionMask.Right;
		}

	},

	onKeyReleased: function (key){

		if (key === cc.KEY.w || key === cc.KEY.up) {
			this.directionInput -= eDirectionMask.Up;
			this.jumpState=0;
		}

		if (key === cc.KEY.s || key === cc.KEY.down) {
			this.directionInput -= eDirectionMask.Down;
		}

		if (key === cc.KEY.a || key === cc.KEY.left) {
			this.directionInput -= eDirectionMask.Left;
		}

		if (key === cc.KEY.d || key === cc.KEY.right) {
			this.directionInput -= eDirectionMask.Right;
		}

	},

	playerUpdateVelocity: function (gravity, damping, dt) {
		var target_vx = 200 * ( (this.directionInput & eDirectionMask.Right ? 1 : 0) - (this.directionInput & eDirectionMask.Left ? 1 : 0) );

		var surface_v = cp.v(target_vx, 0);
		this.playerShape.surface_v = surface_v;
		this.playerShape.u = 2;

		groundNormal= cp.vzero;

    	this.playerBody.eachArbiter(function(arbiter){
        var i;
			
        for(i=0; i<arbiter.contacts.length; i++){            
					var n = cp.v.neg(arbiter.contacts[i].n);
					if(n.y > groundNormal.y){
							groundNormal = n;
					}
//            console.log(n.y);
			}
        });

					var jump_v = 400 * (this.directionInput & eDirectionMask.Up ? 1 : 0);
					if(groundNormal.y > 0.0 && this.jumpState==1){
						this.playerBody.setVel( cp.v.add(this.playerBody.getVel(), cp.v(0.0, jump_v)));
						this.jumpState=2;
					}

		cp.Body.prototype.velocity_func.call(this.playerBody, gravity, damping, dt);
	}

});










