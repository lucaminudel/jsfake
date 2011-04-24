(function ($) {
	if ($.a) { throw 'the "a" namespace already exists'; }
	if ($.any) { throw 'the "any" namespace already exists'; }
	$.a = {};
	$.any = {};

	$.a.fake = function (blueprint) {
		return new $.a.Fake(blueprint);
	};
	$.a.Fake = function (blueprint) {
		_interceptMethodsFor.call(this, blueprint.prototype);
		_interceptMethodsFor.call(this, blueprint);
	};

	$.a.stub = function (blueprint) { 
		return new $.a.Stub(blueprint)
	}

	$.a.Stub = function (blueprint) {
		_stubMethodsFor.call(this, blueprint.prototype);
		_stubMethodsFor.call(this, blueprint);
	};

	$.any.callTo = function (fake) {
		return {
			_fake: fake,
			willThrow: function () {
				for (var methodName in this._fake) {
					this._fake[methodName].behavior = _unexpected;
				}
				return this._fake;
			}
		};
	};

	var _noop = function () { };
	var _unexpected = function () { throw 'unexpected call'; };

	var _stubMethodsFor = function (obj) {
		for (var methodName in obj) {
			var isFunction = obj[methodName] instanceof Function;
			var isPublic = methodName[0] !== '_';
			if (isFunction && isPublic) {
				this[methodName] = _noop;
			}
		}
	};

	var _interceptMethodsFor = function (obj) {
		for (var methodName in obj) {
			var isFunction = obj[methodName] instanceof Function;
			var isPublic = methodName[0] !== '_';
			if (isFunction && isPublic) {
				this[methodName] = _createInterceptedMethod();
			}
		}
	};

	var _createInterceptedMethod = function () {
		var method = function () {
			method.numberOfCalls++;
			return method.behavior.apply(this, arguments);
		};
		method.numberOfCalls = 0;
		method.behavior = _noop;
		method.whenCalled = function (newBehavior) { method.behavior = newBehavior; };
		return method;
	};
})(this);
