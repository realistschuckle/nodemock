function NodeMock(methodName) {
	
	var args = [];
	var returnValue = undefined;
	var callbackIndex = null;
	var callbackArgs = null;
	
	var mockFunction = function() {
		
		//check for argument length
		if(args.length != arguments.length) {
			throw 	"Number of Arguments passed(" + arguments.length + 
					") is not tally with expected(" + args.length +
					") in '" + methodName + "()'";
		} 
		
		//check for argument content
		if(!deepObjectCheck(args, arguments)) {
			throw "Arguments content passed is not tally with expected";
		}
		
		//calling the callback
		if(callbackIndex != null) {
			var func = arguments[callbackIndex];
			if(typeof(func) == "function") {
				func.apply(this, callbackArgs);
			} else {
				throw "Expected callback is not defined as callback";
			}
		}
		
		return returnValue;
	};
	
	this[methodName] = mockFunction;
	
	this.takes = function() {
		args = arguments;
		return this;
	};
	
	this.returns = function(value) {
		returnValue = value;
		return this;
	};
	
	this.calls = function() {
		callbackIndex = arguments[0];
		callbackArgs = [];
		for(var lc =1; lc< arguments.length; lc++) {
			callbackArgs.push(arguments[lc]);
		}
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
}

exports.mock = function(methodName) {
	return new NodeMock(methodName);
};