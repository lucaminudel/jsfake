describe('jsFake stub', function () {
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
		expect(a.stub(SomeClass)).not.toEqual(undefined);
		expect(a.stub(blueprint)).not.toBe(blueprint);
	});

	it('should provide default noop behavior for all "public" prototype methods', function () {
		var stub = a.stub(SomeClass);
		expect(function () { stub.protoMethodWithoutArgs(); }).not.toThrow();
		expect(function () { stub.protoMethodWithArgs(1, 2); }).not.toThrow();
		expect(stub._privateMethod).toBe(undefined);
	});

	it('should provide default noop behavior for all "public" prototype methods of a derived class', function () {
		var stub = a.stub(SomeDerivedClass);
		expect(function () { stub.protoMethodWithoutArgs(); }).not.toThrow();
		expect(function () { stub.protoMethodWithArgs(1, 2); }).not.toThrow();
		expect(function () { stub.protoMethodOfDerivedClass(); }).not.toThrow();
		expect(stub._privateMethod).toBe(undefined);
	});

	it('should provide default noop behavior for all "public" instance methods', function () {
		var stub = a.stub(blueprint);
		expect(function () { stub.instMethodWithoutArgs(); }).not.toThrow();
		expect(function () { stub.instMethodWithArgs(1, 2); }).not.toThrow();
		expect(stub._privateMethod).toBe(undefined);
	});

	it('should provide default noop behavior for all "public" instance methods of a derived class', function () {
		var stub = a.stub(derivedClassBlueprint);
		expect(function () { stub.instMethodOfDerivedClass(); }).not.toThrow();
		expect(stub._privateMethod).toBe(undefined);
	});

	it('should provide default noop behavior for all "privileged" methods', function () {
		var stub = a.stub(blueprint);
		expect(function () { stub.privilegedMethod(); }).not.toThrow();
	});

	it('should provide default noop behavior for all "privileged" methods for a derived class', function () {
		var stub = a.stub(derivedClassBlueprint);
		expect(function () { stub.derivedPrivilegedMethod(); }).not.toThrow();
		expect(function () { stub.privilegedMethod(); }).not.toThrow();
	});

	it('should support stubbing of methods with Jasmine', function () {
		var stub = a.stub(SomeClass);
		spyOn(stub, 'protoMethodWithoutArgs').andReturn('stubbed');

		expect(stub.protoMethodWithoutArgs()).toEqual('stubbed');
	});

	it('should bind "this" in stubbed method with Jasmine', function () {
		var stub = a.stub(SomeClass);
		stub.prop = 'value';

		spyOn(stub, 'protoMethodWithoutArgs').andCallFake(function () {
			return this.prop;
		});

		expect(stub.protoMethodWithoutArgs()).toEqual('value');
	});

	it('should fail to create stub for undefined method with Jasmine', function () {
		var stub = a.stub(SomeClass);
		expect(function () {
			spyOn(stub, 'NONeXISTINGmETHOD');
		}).toThrow();
	});

	it('should track number of times a method is called with Jasmine', function () {
		var stub = a.stub(SomeClass);
		spyOn(stub, 'protoMethodWithoutArgs');

		stub.protoMethodWithoutArgs();
		stub.protoMethodWithoutArgs();

		expect(stub.protoMethodWithoutArgs.callCount).toBe(2);
	});
});

