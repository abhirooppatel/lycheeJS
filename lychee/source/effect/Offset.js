
lychee.define('lychee.effect.Offset').exports(function(lychee, global, attachments) {

	var Class = function(settings) {

		this.type     = Class.TYPE.easeout;
		this.delay    = 0;
		this.duration = 250;
		this.offset   = { x: null, y: null };

		this.__origin = { x: null, y: null };
		this.__start  = null;


		// No data validation garbage allowed for effects

		var type     = lychee.enumof(Class.TYPE, settings.type) ? settings.type           : null;
		var delay    = typeof settings.delay === 'number'       ? (settings.delay | 0)    : null;
		var duration = typeof settings.duration === 'number'    ? (settings.duration | 0) : null;
		var offset   = settings.offset instanceof Object        ? settings.offset         : null;

		if (type !== null) {
			this.type = type;
		}

		if (delay !== null) {
			this.delay = delay;
		}

		if (duration !== null) {
			this.duration = duration;
		}

		if (offset !== null) {
			this.offset.x = typeof offset.x === 'number' ? (offset.x | 0) : null;
			this.offset.y = typeof offset.y === 'number' ? (offset.y | 0) : null;
		}

	};


	Class.TYPE = {
		linear:        0,
		easein:        1,
		easeout:       2,
		bounceeasein:  3,
		bounceeaseout: 4
	};


	Class.prototype = {

		// deserialize: function(blob) {},

		serialize: function() {

			var settings = {};


			if (this.type !== Class.TYPE.easeout) settings.type     = this.type;
			if (this.delay !== 0)                 settings.delay    = this.delay;
			if (this.duration !== 250)            settings.duration = this.duration;


			if (this.offset.x !== null || this.offset.y !== null) {

				settings.offset = {};

				if (this.offset.x !== null) settings.offset.x = this.offset.x;
				if (this.offset.y !== null) settings.offset.y = this.offset.y;

			}


			return {
				'constructor': 'lychee.effect.Offset',
				'arguments':   [ settings ]
			};

		},

		render: function(renderer, offsetX, offsetY) {

		},

		update: function(entity, clock, delta) {

			if (this.__start === null) {

				this.__start    = clock + this.delay;
				this.__origin.x = entity.offset.x;
				this.__origin.y = entity.offset.y;

			}


			var t = (clock - this.__start) / this.duration;
			if (t < 0) {
				return true;
			}


			var origin  = this.__origin;
			var originx = origin.x;
			var originy = origin.y;

			var offset  = this.offset;
			var offsetx = offset.x;
			var offsety = offset.y;

			var x       = originx;
			var y       = originy;

			if (t <= 1) {

				var f  = 0;
				var dx = offsetx - originx;
				var dy = offsety - originy;


				var type = this.type;
				if (type === Class.TYPE.linear) {

					x += t * dx;
					y += t * dy;

				} else if (type === Class.TYPE.easein) {

					f = 1 * Math.pow(t, 3);

					x += f * dx;
					y += f * dy;

				} else if (type === Class.TYPE.easeout) {

					f = Math.pow(t - 1, 3) + 1;

					x += f * dx;
					y += f * dy;

				} else if (type === Class.TYPE.bounceeasein) {

					var k = 1 - t;

					if ((k /= 1) < ( 1 / 2.75 )) {
						f = 1 * ( 7.5625 * Math.pow(k, 2) );
					} else if (k < ( 2 / 2.75 )) {
						f = 7.5625 * ( k -= ( 1.5   / 2.75 )) * k + 0.75;
					} else if (k < ( 2.5 / 2.75 )) {
						f = 7.5625 * ( k -= ( 2.25  / 2.75 )) * k + 0.9375;
					} else {
						f = 7.5625 * ( k -= ( 2.625 / 2.75 )) * k + 0.984375;
					}

					x += (1 - f) * dx;
					y += (1 - f) * dy;

				} else if (type === Class.TYPE.bounceeaseout) {

					if ((t /= 1) < ( 1 / 2.75 )) {
						f = 1 * ( 7.5625 * Math.pow(t, 2) );
					} else if (t < ( 2 / 2.75 )) {
						f = 7.5625 * ( t -= ( 1.5   / 2.75 )) * t + 0.75;
					} else if (t < ( 2.5 / 2.75 )) {
						f = 7.5625 * ( t -= ( 2.25  / 2.75 )) * t + 0.9375;
					} else {
						f = 7.5625 * ( t -= ( 2.625 / 2.75 )) * t + 0.984375;
					}

					x += f * dx;
					y += f * dy;

				}


				if (offsetx !== null) entity.offset.x = x;
				if (offsety !== null) entity.offset.y = y;


				return true;

			} else {

				if (offsetx !== null) entity.offset.x = offsetx;
				if (offsety !== null) entity.offset.y = offsety;


				return false;

			}

		}

	};


	return Class;

});

