describe('jsFake mock', function () {
	function SomeClass() {
		var self = this;
		self.privilegedMethod = function () { throw 'privilegedMethod'; };
	}
	SomeClass.prototype = {
		protoMethodWithoutArgs: function () { throw 'protoMethodWithoutArgs'; },
		protoMethodWithArgs: function (arg1, arg2) { throw 'protoMethodWithArgs'; },
		_privateMethod: function () { throw '_privateMethod'; }
	};
	var blueprint = new SomeClass();
	blueprint.instMethodWithoutArgs = function () { throw 'instMethodWithoutArgs'; };
	blueprint.instMethodWithArgs = function (arg1, arg2) { throw 'instMethodWithArgs'; };
	blueprint._privateMethod = function () { throw '_privateMethod'; };

	function SomeDerivedClass() {
		var self = this;
		self.derivedPrivilegedMethod = function () { throw 'derivedPrivilegedMethod'; };
	}
	SomeDerivedClass.prototype = new SomeClass();
	SomeDerivedClass.prototype.protoMethodOfDerivedClass = function () { throw 'protoMethodOfDerivedClass'; };
	var derivedClassBlueprint = new SomeDerivedClass();
	derivedClassBlueprint.instMethodOfDerivedClass = function () { throw 'instMethodOfDerivedClass'; };

	it('should create a new instance from blueprint', function () {
		expect(a.mock(SomeClass)).not.toEqual(undefined);
		expect(a.mock(blueprint)).not.toBe(blueprint);
	});

	it('should provide default unexpected-call behavior for all "public" prototype methods', function () {
		var mock = a.mock(SomeClass);
		expect(function () { mock.protoMethodWithoutArgs(); }).toThrow();
		expect(function () { mock.protoMethodWithArgs(1, 2); }).toThrow();
		expect(mock._privateMethod).toBe(undefined);
	});

	it('should provide default unexpected-call behavior for all "public" prototype methods of a derived class', function () {
		var mock = a.mock(SomeDerivedClass);
		expect(function () { mock.protoMethodWithoutArgs(); }).toThrow();
		expect(function () { mock.protoMethodWithArgs(1, 2); }).toThrow();
		expect(function () { mock.protoMethodOfDerivedClass(); }).toThrow();
		expect(mock._privateMethod).toBe(undefined);
	});

	it('should provide default unexpected-call behavior for all "public" instance methods', function () {
		var mock = a.mock(blueprint);
		expect(function () { mock.instMethodWithoutArgs(); }).toThrow();
		expect(function () { mock.instMethodWithArgs(1, 2); }).toThrow();
		expect(mock._privateMethod).toBe(undefined);
	});

	it('should provide default unexpected-call behavior for all "public" instance methods of a derived class', function () {
		var mock = a.mock(derivedClassBlueprint);
		expect(function () { mock.instMethodOfDerivedClass(); }).toThrow();
		expect(mock._privateMethod).toBe(undefined);
	});

	it('should provide default unexpected-call behavior for all "privileged" methods', function () {
		var mock = a.mock(blueprint);
		expect(function () { mock.privilegedMethod(); }).toThrow();
	});

	it('should provide default unexpected-call behavior for all "privileged" methods for a derived class', function () {
		var mock = a.mock(derivedClassBlueprint);
		expect(function () { mock.derivedPrivilegedMethod(); }).toThrow();
		expect(function () { mock.privilegedMethod(); }).toThrow();
	});

	it('should support mocking of methods with Jasmine', function () {
		var mock = a.mock(SomeClass);
		spyOn(mock, 'protoMethodWithoutArgs').andReturn('mocked');

		var result = mock.protoMethodWithoutArgs();

		expect(result).toEqual('mocked');
		expect(mock.protoMethodWithoutArgs).toHaveBeenCalled();
	});

	it('should track number of times a method is called with Jasmine', function () {
		var mock = a.mock(SomeClass);
		spyOn(mock, 'protoMethodWithoutArgs');

		mock.protoMethodWithoutArgs();
		mock.protoMethodWithoutArgs();

		expect(mock.protoMethodWithoutArgs.callCount).toBe(2);
	});

	it('should bind "this" in mocked method with Jasmine', function () {
		var mock = a.mock(SomeClass);
		mock.prop = 'value';

		spyOn(mock, 'protoMethodWithoutArgs').andCallFake(function () {
			return this.prop;
		});

		expect(mock.protoMethodWithoutArgs()).toEqual('value');
	});

	it('should fail to mock undefined method with Jasmine', function () {
		var mock = a.mock(SomeClass);
		expect(function () {
			spyOn(mock, 'NONeXISTINGmETHOD');
		}).toThrow();
	});

});
