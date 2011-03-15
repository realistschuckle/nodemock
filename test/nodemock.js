//NodeMock argument check
var nm = require("../lib/nodemock");

exports.testArgumentSimple = function(test) {
	
	var mock = nm.mock("foo").takes(10, "Hello", true, [1, 4, 5], {"a": "aa", "b": "bb"});
	test.doesNotThrow(function(){
		mock.foo(10, "Hello", true, [1, 4, 5], {"a": "aa", "b": "bb"});
	});
	
	test.throws(function() {
		mock.foo(11, "Hello", true, [1, 4, 5], {"a": "aa", "b": "bb"});
	});
	
	test.throws(function() {
		mock.foo(10, "Hello1", true, [1, 4, 5], {"a": "aa", "b": "bb"});
	});
	
	test.throws(function() {
		mock.foo(10, "Hello", false, [1, 4, 8], {"a": "aa", "b": "bb"});
	});
	
	test.throws(function() {
		mock.foo(10, "Hello", true, [1, 4, 5], {"a": "aa", "b": "gh"});
	});
	
	test.throws(function() {
		mock.foo(10, "Hello", true, [1, 4, 5], {"a": "aa", "c": "gh"});
	});
	
	test.done();
};

exports.testArgumentsDeep = function(test) {
	
	var mock = nm.mock("foo").takes([10, 20, {a: "aa", b: [10, 20]}]);
	
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
};

//Nodemock Return Check

exports.testReturn = function(test) {
	
	var mock = nm.mock("foo").returns(10);
	test.equal(mock.foo(), 10);
	
	test.done();
};

//Nodemock Callback Tests

exports.testCallbackCorrect = function(test) {
	
	var mock = nm.mock("foo").takes(10, function(){}).calls(1, 10, 20);
	test.expect(2);
	mock.foo(10, function(a, b) {
		test.equals(a, 10);
		test.equals(b, 20);
	});
	
	test.done();
};

exports.testCallbackNoArgsDefined = function(test) {
	
	var mock = nm.mock("foo").calls(1, 10, 20);

	test.throws(function() {
		mock.foo(10, function(a, b) {
			test.equals(a, 10);
			test.equals(b, 20);
		});
	});
	
	test.done();
};

exports.testCallbackSurplusArgs = function(test) {
	
	var mock = nm.mock("foo").takes(10, function(){}).calls(1, 10, 20, 30, 40);
	test.expect(2);
	mock.foo(10, function(a, b) {
		test.equals(a, 10);
		test.equals(b, 20);
	});
	
	test.done();
};

exports.testCallbackLessArgs = function(test) {
	
	var mock = nm.mock("foo").takes(10, function(){}).calls(1, 10);
	test.expect(2);
	mock.foo(10, function(a, b) {
		test.equals(a, 10);
		test.equals(b, undefined);
	});
	
	test.done();
};