/**
 * Created with JetBrains WebStorm.
 * User: icepower
 * Date: 14-9-13
 * Time: 下午7:51
 * To change this template use File | Settings | File Templates.
 */

var Game = cc.Class.extend({
	directionInput: eDirectionMask.NoWhere,

	ctor: function () {
		var space = this.space = new cp.Space();
		space.gravity = cp.v(0, -GRAVITY);
		space.enableContactGraph = true;

		// 碰撞回调函数

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

		// 创建玩家, Infinity 好像是为了使玩家不会旋转。
		var playerBody = this.playerBody = space.addBody(new cp.Body(5, Infinity));
		playerBody.setPos(cp.v(300, 300));
		playerBody.velocity_func = this.playerUpdateVelocity.bind(this);

		this.playerShape = space.addShape(new cp.CircleShape(playerBody, 30.0, cp.vzero));

	},

	update: function () {
		this.space.step(FIXED_DT);
	},

	onKeyPressed: function (key) {
//		this.directionInput = eDirectionMask.NoWhere;

		if (key === cc.KEY.w || key === cc.KEY.up) {
			this.directionInput |= eDirectionMask.Up;
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

		cc.log('this.directionInput ||||||| ', this.directionInput);
	},

	// 1 1 - 0;   0 1 - 0;      0 0 - 0   1 0 - 1;
	onKeyReleased: function (key){
//		this.directionInput = eDirectionMask.NoWhere;

		if (key === cc.KEY.w || key === cc.KEY.up) {
			this.directionInput -= eDirectionMask.Up;
		}

		if (key === cc.KEY.s || key === cc.KEY.down) {
			this.directionInput -= eDirectionMask.Down;
		}

		if (key === cc.KEY.a || key === cc.KEY.left) {
			this.directionInput -= eDirectionMask.Left;
		}

		// 11  10  --- 01
		if (key === cc.KEY.d || key === cc.KEY.right) {
			this.directionInput -= eDirectionMask.Right;
		}

		cc.log('this.directionInput ----- ', this.directionInput);

	},

	playerUpdateVelocity: function (gravity, damping, dt) {
		var target_vx = 200 * ( (this.directionInput & eDirectionMask.Right ? 1 : 0) - (this.directionInput & eDirectionMask.Left ? 1 : 0) );
		var surface_v = cp.v(target_vx, 0);
		this.playerShape.surface_v = surface_v;
		this.playerShape.u = 2;

		cp.Body.prototype.velocity_func.call(this.playerBody, gravity, damping, dt);
	}

});











