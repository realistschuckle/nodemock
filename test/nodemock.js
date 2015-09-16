/*

	The MIT License

	Copyright (c) 2011 Arunoda Susiripala

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.

*/

var nm = require("../lib/nodemock");

exports['mocks can have names which get reported in error messages'] = function(test) {
	var mockName = 'myFabulousMock',
			mock = nm.named(mockName).mock('foo').takes(1);

	try {
		mock.assertThrows();
	} catch(e) {
		test.ok(e.message.indexOf(mockName) > -1);
	}
	test.expect(1);
	test.done();
};

exports['mocked functions pattern match on'] = {
	setUp: function(cb) {
		this.mock = nm.mock('foo')
								  .takes(10, NaN, "Hello", true, [1, 4, 5], {"a": "aa", "b": "bb"});
		cb();
	}

, numbers: function(test) {
		var mock = this.mock;
		test.doesNotThrow(function() {
			mock.foo(10, NaN, "Hello", true, [1, 4, 5], {"a": "aa", "b": "bb"});
		});
		test.throws(function() {
			mock.foo(-1, NaN, "Hello", true, [1, 4, 5], {"a": "aa", "b": "bb"});
		});
		test.done();
	}

, 'silly numbers': function(test) {
		var mock = this.mock;
		test.doesNotThrow(function() {
			mock.foo(10, NaN, "Hello", true, [1, 4, 5], {"a": "aa", "b": "bb"});
		});
		test.throws(function() {
			mock.foo(10, 3, "Hello", true, [1, 4, 5], {"a": "aa", "b": "bb"});
		});
		test.done();
	}

, strings: function(test) {
		var mock = this.mock;
		test.doesNotThrow(function() {
			mock.foo(10, NaN, "Hello", true, [1, 4, 5], {"a": "aa", "b": "bb"});
		});
		test.throws(function() {
			mock.foo(10, NaN, "WORLD", true, [1, 4, 5], {"a": "aa", "b": "bb"});
		});
		test.done();
	}

, booleans: function(test) {
		var mock = this.mock;
		test.doesNotThrow(function() {
			mock.foo(10, NaN, "Hello", true, [1, 4, 5], {"a": "aa", "b": "bb"});
		});
		test.throws(function() {
			mock.foo(10, NaN, "Hello", false, [1, 4, 5], {"a": "aa", "b": "bb"});
		});
		test.done();
	}

, arrays: function(test) {
		var mock = this.mock;
		test.doesNotThrow(function() {
			mock.foo(10, NaN, "Hello", true, [1, 4, 5], {"a": "aa", "b": "bb"});
		});
		test.throws(function() {
			mock.foo(10, NaN, "Hello", true, [1, 5, 4], {"a": "aa", "b": "bb"});
		});
		test.done();
	}

, objects: function(test) {
		var mock = this.mock;
		test.doesNotThrow(function() {
			mock.foo(10, NaN, "Hello", true, [1, 4, 5], {"a": "aa", "b": "bb"});
		});
		test.throws(function() {
			mock.foo(10, NaN, "Hello", true, [1, 4, 5], {"c": "aa", "b": "aa"});
		});
		test.done();
	}

, 'nested objects': function(test) {
		var mock = nm.mock('foo').takes([10, 20, {a: "aa", b: [10, 20]}]);
		test.doesNotThrow(function() {
			mock.foo([10, 20, {a: "aa", b: [10, 20]}]);
		});
		test.throws(function() {
			mock.foo([10, 21, {a: "aa", b: [10, 20]}]);
		});
		test.throws(function() {
			mock.foo([10, 20, {a: "aa3", b: [10, 20]}]);
		});
		test.throws(function() {
			mock.foo([10, 20, {a: "aa", b: [10, 20, 30]}]);
		});
		test.done();
	}

, 'differing arguments': function(test) {
		var mock = nm.mock("foo").takes(10, 20).returns(30);
		mock.mock("foo").takes(10, 30).returns(40);
		test.doesNotThrow(function() {
			test.ok(mock.foo(10, 20) == 30);
			test.ok(mock.foo(10, 30) == 40);
		});
		test.throws(function() {
			mock.foo(10);
			mock.foo(10, 20);
			mock.bar(10, 30);
		});
		test.done();
	}
};

exports['mocked functions will return a value for no arguments'] = function(test) {
	[1, '2', [3], {four: 4}, null, undefined].forEach(function(value) {
		var mock = nm.mock('foo').returns(value);
		test.equal(mock.foo(), value);
	});
	test.done();
};

exports['mocked functions with a callback'] = {
	'passes parameters to callback': function(test) {
		var empty = function() {}
		  , mock = nm.mock('foo').takes(10, empty).calls(1, [10, 20])
			;
		mock.foo(10, function(a, b) {
			test.equals(a, 10);
			test.equals(b, 20);
			test.done();
		});
	}

, 'cannot invoke without takes': function(test) {
		var mock = nm.mock('foo').calls(1, [10, 20])
		  ;
		test.throws(function() {
			mock.foo(10, function() {});
		});
		test.done();
	}

, 'callback can get surplus arguments': function(test) {
		var empty = function() {}
		  , mock = nm.mock('foo').takes(10, empty).calls(1, [10, 20, 30, 40])
		  ;
		mock.foo(10, function(a, b) {
			test.equals(a, 10);
			test.equals(b, 20);
			test.equals(arguments[2], 30);
			test.equals(arguments[3], 40);
			test.done();
		});
	}

, 'callback can get sparse arguments': function(test) {
		var empty = function() {}
		  , mock = nm.mock('foo').takes(10, empty).calls(1, [10])
		  ;
		mock.foo(10, function(a, b) {
			test.equals(a, 10);
			test.equals(b, undefined);
			test.done();
		});
	}

, 'callback can get no arguments': function(test) {
		var empty = function() {}
		  , mock = nm.mock('foo').takes(10, empty).calls(1, [])
		  ;
		mock.foo(10, function(a, b) {
			test.equals(a, undefined);
			test.equals(b, undefined);
			test.done();
		});
	}

, 'callback with null gets undefined arguments': function(test) {
		var empty = function() {}
		  , mock = nm.mock('foo').takes(10, empty).calls(1, null)
		  ;
		mock.foo(10, function(a, b) {
			test.equals(a, undefined);
			test.equals(b, undefined);
			test.done();
		});
	}

, 'callback works with no arguments': function(test) {
		var empty = function() {}
		  , mock = nm.mock('foo').takes(10, empty).calls(1)
		  ;
		mock.foo(10, function(a, b) {
			test.equals(a, undefined);
			test.equals(b, undefined);
			test.done();
		});
	}
}

exports['mocked functions are strict by default'] = function(test) {
	var mock = nm.mock("foo").takes(10, 20).returns(30);
	test.doesNotThrow(function() {
		test.equal(mock.foo(10, 20), 30);
	});
	mock.mock("bar").takes(10).returns(40);
	test.doesNotThrow(function() {
		test.equal(mock.bar(10), 40);
	});
	test.throws(function() {
		test.equal(mock.foo(10, 20), 30);
	});
	test.done();
};

exports['mocked functions with fail always throw errors'] = function(test) {
	var mock = nm.fail();
	test.throws(function() {
		mock.foo();
	});
	test.done();
};

exports['mock can have both fail and non-fail functions'] = function(test) {
	var mock = nm.mock("foo").fail();
	mock.mock("bar").takes(10, 20);
	test.throws(function() {
		mock.foo();
	});
	test.doesNotThrow(function() {
		mock.bar(10, 20);
	});
	test.done();
};

exports['assert returns'] = {
	setUp: function(cb) {
		this.error = console.error;
		console.error = function() {};
		cb();
	}

, tearDown: function(cb) {
		console.error = this.error;
		cb();
	}

,	'false for uncalled multiple invocations of same method': function(test) {
		var mock = nm.mock('foo').takes(10, 20).returns(30)
		  ;
		mock.mock('foo').takes(10, 30).returns(40);
		mock.foo(10, 20);
		test.ok(!mock.assert());
		test.done();
	}

,	'false for uncalled invocation of a method': function(test) {
		var mock = nm.mock('foo').takes(10, 20).returns(30)
		  ;
		mock.mock('bar').takes(10, 30).returns(40);
		mock.foo(10, 20);
		test.ok(!mock.assert());
		test.done();
	}

, 'true for meeting all expectations': function(test) {
		var mock = nm.mock("foo").takes(10, 20).returns(30);
		mock.mock("foo").takes(10, 30).returns(40);
		mock.mock("bar").returns(30);
		mock.foo(10,20);
		mock.foo(10,30);
		mock.bar();
		test.ok(mock.assert());
		test.done();
	}

, 'false for not meeting explicit times expectation': function(test) {
		var mock = nm.mock("foo").takes(10, 20).times(2);
		mock.foo(10, 20);
		mock.foo(10, 20);
		test.ok(mock.assert());

		mock = nm.mock("bar").takes(10).times(2);
		mock.bar(10);
		test.ok(!mock.assert());

		test.done();
	}
};

exports['assertThrows'] = {
	'throws an error for missed expectation': function(test) {
		var mock = nm.mock("foo").takes(10, 20).returns(30);
		mock.mock("bar").takes(10, 30).returns(40);
		mock.foo(10,20);
		test.throws(function() {
			mock.assertThrows();
		});
		test.done();
	}

, 'does not throw an error when all expectations met': function(test) {
		var mock = nm.mock("foo").takes(10, 20).returns(30);
		mock.mock("foo").takes(10, 30).returns(40);
		mock.mock("bar").returns(30);
		mock.foo(10,20);
		mock.foo(10,30);
		mock.bar();
		test.doesNotThrow(function() {
			mock.assertThrows();
		});
		test.done();
	}
}

exports['ctrl triggers the invocation of a callback'] = function(test) {
	test.expect(2);
	var ctrl = {};
	var mock = nm.mock("foo").takes(10, 20, function() {}).ctrl(2, ctrl);
	mock.foo(10, 20, function(bb) {
		test.ok(bb = 20);
	});
	ctrl.trigger(20);
	ctrl.trigger(20);
	test.done();
};

exports['compare of compled arguments'] = {
	'fails for missing attributes': function(test) {
		test.throws(function (){
			var mock = nm.mock('foo').takes({hi: 1, bye: 2000}, 2, 3);
			mock.foo({}, 2, 3);
		});
		test.done();
	}

,	'fails for missing attribute': function(test) {
		test.throws(function (){
			var mock = nm.mock('foo').takes({hi: 1, bye: 2000}, 2, 3);
			mock.foo({hi: 1}, 2, 3);
		});
		test.done();
	}

, 'fails for extra attributes': function(test) {
		test.doesNotThrow(function (){
			var mock = nm.mock('foo').takes({hi: 1}, 2, 3);
			mock.foo({hi: 1, bye: 2000}, 2, 3);
		});
		test.done();
	}
}

exports['mocked functions will return multiple values for multiple takens'] = function(test) {
	var mock = nm.mock("foo").returns(1);
	mock.mock("foo").returns(2);
	mock.mock("foo").takes(1).returns(42);
	test.equal(mock.foo(), 1, "good first return");
	test.equal(mock.foo(), 2, "good second return");
	test.equal(mock.foo(1), 42, "still match on arguments");
	test.ok(mock.assert(), 'bad invoked mocks');
	test.throws(function() {
		test.equal(mock.foo(), 2, "re-uses second return");
	});
	test.done();
};

exports['mocked functions invokable without object context'] = function(test) {
	var mock = nm.mock('foo').returns(10);
	var foo = mock.foo;
	test.equal(foo(), 10);
	test.done();
};

exports['reset mocks clears previous invocation count'] = function(test) {
	var mock = nm.mock('foo').returns(100);
	test.equal(mock.foo(), 100);
	test.ok(mock.assert());
	mock.reset();
	test.ok(!mock.foo);
	mock.mock('doo').returns(300);
	test.equal(mock.doo(), 300);
	test.ok(mock.assert());
	test.done();
};

exports['ignored mock functions do not throw on multiple invocations'] = function(test) {
	var mock = nm.mock('foo').returns(100);
	test.equal(mock.foo(), 100);
	mock.ignore('hello');
	test.ok(mock.hello);
	test.doesNotThrow(function() {
		mock.hello();
	});
	test.done();
};

exports['ignored mock function from library does not throw on multiple invocations'] = function(test) {
	var mock = nm.ignore('hello');
	test.ok(mock.hello);
	test.doesNotThrow(function() {
		mock.hello();
	});
	test.done();
};

exports['ignored honored after resetting mock'] = function(test) {
	var mock = nm.mock('foo').returns(10);
	mock.reset();
	mock.ignore('hello');
	test.ok(mock.hello);
	test.doesNotThrow(function() {
		mock.hello();
	});
	test.done();
};

exports['failed methods not tracked for assertions'] = function(test) {
	var mock = nm.mock('test').fail();
	test.doesNotThrow(function() {
		mock.assertThrows();
	});
	test.done();
};

exports.testTakesF = function(test) {
	// Input validator function that allows even numbers and refuses odds numbers
	var takesValidator = function(input) {
		if(input % 2 == 0) return true;
		else return false;
	}

	// should pass
	var mock1 = nm.mock("withFunction").takesF(takesValidator).returns(4);
	test.equals(mock1.withFunction(2), 4, "takesF test correct");
	var mock2 = nm.mock("withFunction").takesF(takesValidator).returns(4);
	test.equals(mock2.withFunction(8), 4, "takesF test correct");
	// should fail
	test.throws(function() {
		var mock = nm.mock("withFunction").takesF(takesValidator).returns(4);
		test.equals(mock.withFunction(3), 4, "takesF test correct");
	})

	test.done();
}

exports.testTakesAll = function(test) {
	var mock = nm.mock("withAll").takesAll().returns(4);

	test.equals(mock.withAll("whatever"), 4, "takesAll test correct");
	test.done();
}

exports.testReturnsF = function(test) {
	var mock = nm.mock("withReturnFunction").takes(2).returnsF(function(args) {
		return(args*2);
	})

	test.equals(mock.withReturnFunction(2), 4, "returnsF test correct");

	var mock2 = nm.mock("withReturnFunction").takesF(function(args) {
		return(args % 2 == 0)
	}).returnsF(function(args) {
		return(args * 2)
	})
	test.equals(mock2.withReturnFunction(4), 8, "returnsF test correct");

	test.done();
}

exports['compares buffers ok'] = function (test) {
	var mock = nm.mock('foo').takes(new Buffer('123')).returns(1);
	test.equals(mock.foo(new Buffer('123')), 1);

	mock = nm.mock('foo').takes(new Buffer('123')).returns(1);
	test.throws(function() {
		test.equals(mock.foo(new Buffer('234')), 1);
	});

	test.done();
}
