Node Mock - Simple Yet Powerful Mocking Framework for NodeJs
============================================================

NodeMock is a very simple to use mocking framework which can be used to 
mock functions in JavaScript objects. You can create mock a function in a single line.

Features
--------
Besides it's simplicity it supports following features
	* Does not need an existing object to create the mock
	* Verify arguments (we check deeply on objects and arrays to check the validity)
	* Allow a return to be sent
	* Callbacks can also be executed with providing arguments
	* Method chaining allows creating mocks super easy
	
Environment
-----------
NodeMock does not depend on any third party library and then can be used with 
any JavaScript environment including
	* NodeJS
	* Browser
	* Rhino
	
Testing
-------
Node JS can be used with any testing framework. And we've used it with 
Nodeunit and it's a perfect match.

Usage
------

### Load the Module

	var nodemock = require("nodemock");

### Creating a mock function with taking arguments and return value

	var mocked = nodemock.mock("foo").takes(10, [10, 20, 30]).returns(98);
	
	mocked.foo(10, [10, 20, 30]); // this will return 98
	
	mocked.foo(10); //throws execption
	
### Creating a mock with callback support

	var mocked = nodemock.mock("foo").takes(20, function(){}).calls(1, 30, [10, 20]);
	
	mockes.foo(20, function(num, arr) {
		console.log(num); //prints 30
		console.log(arr); //prints [10, 20]
	});
	
	/*
		When you invoke foo() nodemock will calls the callback(sits in argument index 1 - as specified)
		with the parameters 30 and [10, 20] respectively. 
	*/
	
API Documentation
-----------------

	var mocked = require('nodemock').mock('foo');
		Creating a object with mock function "foo"
	
	mocked.takes(arg1, args2, ...)
		Specify arguments of the function and verify then when calling
		
	mocked.returns(returnValue)
		Specify the return value of the function
		
	mocked.calls(callbackPosition, callbackArg1, callbackArg2, ...)		 
		Calls a callback at the arguments in index `callbackPosition`
		with the arguments specified above
		
		when using this you've to define a function signature as a callback in the argument list
		for a callback at index 2 .takes() function will be as,
		
		`mocked.takes(10, 20, function(){})
		
Licence
-------
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

