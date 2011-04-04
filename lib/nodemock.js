/**

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


function NodeMock(methodName) {
	
	var currentMockFunction = null;
	var args = []; 
	var returnValue = [];
	var callbackIndex = [];
	var callbackArgs = [];
	var shouldFail = [];
	
	var mockFunction = function(method) {
		
		return function() {
			//check for argument length
			
			if(shouldFail[method]) {
				throw new Error("You should not call anymethod on this object");
				
			} else if(!this[method]) {
				throw new Error("Mock function '" + method + "()' is not defined");
				
			} else if((args[method].length != arguments.length)) {
				throw new Error("Number of Arguments passed(" + arguments.length + 
						") is not tally with expected(" + args[method].length +
						") in '" + method + "()'");
				
			} else if(!deepObjectCheck(args[method], arguments)) {
				//check for argument content
				throw new Error("Arguments content passed is not tally with expected");
			}
			
			//calling the callback
			if(callbackIndex[method]) {
				var func = arguments[callbackIndex[method]];
				if(typeof(func) == "function") {
					func.apply(this, callbackArgs[method] || []);
				} else {
					throw new Error("Expected callback is not defined as callback");
				}
			}
			
			return returnValue[method];
		};
	};
	
	this.takes = function() {
		args[currentMockFunction] = arguments;
		return this;
	};
	
	this.returns = function(value) {
		returnValue[currentMockFunction] = value;
		return this;
	};
	
	this.calls = function() {
		
		if(typeof(arguments[0]) == "number") {
			callbackIndex[currentMockFunction] = arguments[0];
		} else {
			throw new Error("First arg of the calls() should be the index of the callback");
		}
		
		if(arguments[1] && (arguments[1] instanceof Array)) {
			callbackArgs[currentMockFunction] = arguments[1];
		}
		
		return this;
	};
	
	//Assign the mocking function
	this.mock = function(method) {
		
		//let the current mocking method be this
		currentMockFunction = method;
		
		if(!this[method]) {
			//ground work
			args[method] = [];
			returnValue[method] = undefined;
			callbackIndex[method] = null;
			callbackArgs[method] = null;
			
			//assign the mock method
			this[method] = mockFunction(method);
		}
		
		return this;
	};
	
	/**
	 * After this call when someone calls on this this object is'll
	 * throw an exception
	 */
	this.fail = function() {
		shouldFail[currentMockFunction] = true;
		return this;
	};
	
	var deepObjectCheck = function(expected, actual) {
		
		if(expected.length != actual.length) return false;
		
		for(var key in expected) {
			
			var actualType = typeof(actual[key]);
			var expectedType = typeof(expected[key]);
			
			if(actualType != expectedType) return false;
			if(actualType == "function") {
				continue;
			} else if(actualType == "object") {
				if(!deepObjectCheck(actual[key], expected[key])) return false;
			} else {
				if(actual[key] != expected[key]) return false;
			}
		}
		
		return true;
	};
	
	//initialize the mocking
	this.mock(methodName);
	
}

//Supporting NodeJS CommonJS module system
if(typeof(exports) != "undefined") {
	exports.mock = function(methodName) {
		return new NodeMock(methodName);
	};
	
	exports.fail = function() {
		return {};
	};
}