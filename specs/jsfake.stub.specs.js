describe('jsFake stub', function(){
	function SomeClass() {
		var self = this;
		self.privilegedMethod = function () { throw 'privilegedMethod'; }
	}
	SomeClass.prototype = {
		protoMethodWithoutArgs: function(){ throw 'protoMethodWithoutArgs'; },
		protoMethodWithArgs: function(arg1, arg2){ throw 'protoMethodWithArgs'; },
		_privateMethod : function(){ throw '_privateMethod'; }
	};
	var blueprint = new SomeClass();
	blueprint.instMethodWithoutArgs = function(){ throw 'instMethodWithoutArgs'; };
	blueprint.instMethodWithArgs = function(arg1, arg2){ throw 'instMethodWithArgs'; };
	blueprint._privateMethod = function () { throw '_privateMethod'; };

	function SomeDerivedClass() {
		var self = this;
		self.derivedPrivilegedMethod = function () { throw 'derivedPrivilegedMethod'; }
	}
	SomeDerivedClass.prototype = new SomeClass();
	SomeDerivedClass.prototype.protoMethodOfDerivedClass = function () { throw 'protoMethodOfDerivedClass'; };
	var derivedClassBlueprint = new SomeDerivedClass();
	derivedClassBlueprint.instMethodOfDerivedClass = function () { throw 'instMethodOfDerivedClass'; };

	it('should create a new instance from blueprint', function(){
		expect(a.stub(SomeClass)).not.toEqual(undefined);
		expect(a.stub(blueprint)).not.toBe(blueprint);
	});
  
	it('should provide default noop behavior for all "public" prototype methods', function(){
		var fake = a.stub(SomeClass);		
		expect(function(){fake.protoMethodWithoutArgs();}).not.toThrow();
		expect(function(){fake.protoMethodWithArgs(1,2);}).not.toThrow();
		expect(fake._privateMethod).toBe(undefined);
	});

	it('should provide default noop behavior for all "public" prototype methods of a derived class', function () {
		var fake = a.stub(SomeDerivedClass);
		expect(function() { fake.protoMethodWithoutArgs(); }).not.toThrow();
		expect(function() { fake.protoMethodWithArgs(1, 2); }).not.toThrow();
		expect(function() { fake.protoMethodOfDerivedClass(); }).not.toThrow();
		expect(fake._privateMethod).toBe(undefined);
	});

	it('should provide default noop behavior for all "public" instance methods', function () {
		var fake = a.stub(blueprint);
		expect(function(){fake.instMethodWithoutArgs();}).not.toThrow();
		expect(function(){fake.instMethodWithArgs(1,2);}).not.toThrow();
		expect(fake._privateMethod).toBe(undefined);
	});

	it('should provide default noop behavior for all "public" instance methods of a derived class', function () {
		var fake = a.stub(derivedClassBlueprint);
		expect(function (){fake.instMethodOfDerivedClass();}).not.toThrow();
		expect(fake._privateMethod).toBe(undefined);
	});

	it('should provide default noop behavior for all "privileged" methods', function () {
		var fake = a.stub(blueprint);
		expect(function () { fake.privilegedMethod(); }).not.toThrow();
	});

	it('should provide default noop behavior for all "privileged" methods for a derived class', function () {
		var fake = a.stub(derivedClassBlueprint);
		expect(function () { fake.derivedPrivilegedMethod(); }).not.toThrow();
		expect(function () { fake.privilegedMethod(); }).not.toThrow();
	});

	it('should fail to create stub for undefined method', function(){
		var fake = a.stub(SomeClass);
		expect(function(){
			fake.undefinedMethod.whenCalled(function(){});
		}).toThrow();
	});

});

