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
		return new $.a.Stub(blueprint);
	};
	$.a.Stub = function (blueprint) {
		var _noop = function () { };

		function _stubMethodsFor(obj) {
			for (var methodName in obj) {
				var isFunction = obj[methodName] instanceof Function;
				var isPublic = methodName[0] !== '_';
				if (isFunction && isPublic) {
					this[methodName] = _noop;
				}
			}
		}

		_stubMethodsFor.call(this, blueprint.prototype);
		_stubMethodsFor.call(this, blueprint);
	};

	$.a.mock = function (blueprint) {
		return new $.a.Mock(blueprint);
	};
	$.a.Mock = function (blueprint) {

		function _mockMethodsFor(obj) {
			for (var methodName in obj) {
				var isFunction = obj[methodName] instanceof Function;
				var isPublic = methodName[0] !== '_';
				if (isFunction && isPublic) {
					this[methodName] = function () { throw "call to '" + methodName + "' not expected"; };
				}
			}
		}

		_mockMethodsFor.call(this, blueprint.prototype);
		_mockMethodsFor.call(this, blueprint);
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
