A simple Yet Powerful Mocking Framework for NodeJs
==================================================

[NodeMock](https://github.com/realistschuckle/nodemock) is a Simple, Yet
Powerful Mocking Framework for NodeJs

NodeMock is a very simple to use mocking framework which can be used to  mock
functions in JavaScript objects. NodeMock creates mock methods in less code
with more expressive manner.

Features
--------
Besides it's simplicity it supports following features:

* Does not need an existing object to create the mock
* Verify arguments (we check deeply on objects and arrays to check the validity)
* Allow a return to be sent
* Assertion to check whether all the rules executed
* Callbacks can also be executed with providing arguments
* Multiple mock functions in one object
* Alter a mock function later on
* Method chaining allows creating mocks super easy
* Fail support added when calling method that should not be called
* Mock support to call a single method more than once
* Repetitive support
* Ignore methods from mocking behaviour
* Ability to provide functions to determine valid input for mocked functions
* Ability to provide functions to generate output from mocked functions
  
Testing
-------
Node JS can be used with any testing framework. And we've used it with Nodeunit
and it's a perfect match.
[See Examples](https://github.com/realistschuckle/nodemock/blob/master/test/nodemock.js "Nodemock with Nodeunit")

Install
---------
```
npm install nodemock
```

Usage
------

### Load the Module
    var nodemock = require("nodemock");

### Name a mock for clarity
    var mocks = [
          nodemock.named('mock1').mock('foo').takes(1),
          nodemock.named('mock2').mock('foo').takes(1)
        ],
        i;

    for(i = 0; i < mocks.length; i += 1) {
      mocks[i].assert(); // Prints that «mockName».foo(1) was not called.
    }

### Creating a mock function with taking arguments and return value
    var mocked = nodemock.mock("foo").takes(10, [10, 20, 30]).returns(98);
    
    mocked.foo(10, [10, 20, 30]); // this will return 98
    
    mocked.foo(10); //throws execption
  
### Creating a mock with callback support
    var mocked = nodemock.mock("foo")
                         .takes(20, function(){})
                         .calls(1, [30, 40]);
    
    mocked.foo(20, function(num, arr) {
      console.log(num); //prints 30
      console.log(arr); //prints 40
    });
    
    /*
      When you invoke foo() nodemock will calls the callback(sits in argument
      index 1 - as specified) with the parameters 30 and 40 respectively. 
    */

  
### Creating a mock function that takes variable parameters

    var mocked = nodemock.mock("foo").takes(function(args) {
      return(args % 2 == 0) 
    });
    mocked.foo(4) // works

    mocked.foo(5) // fails

### Creating a mock function that takes variable parameters and returns dynamic values

    var mocked = nodemock.mock("foo").takesF(function(args) {
      return(args % 2 == 0) 
    }).returnsF(function(args) {
      return(args * 2)
    });
    mocked.foo(4) // returns 8

    mocked.foo(5) // fails

### Creating a mock with callback support

    var mocked = nodemock.mock("foo")
                         .takes(20, function(){})
                         .calls(1, [30, 40]);

    mocked.foo(20, function(num, arr) {
      console.log(num); //prints 30
      console.log(arr); //prints 40
    });

    /*
      When you invoke foo() nodemock will calls the callback (sits in argument
      index 1 - as specified) with the parameters 30 and 40 respectively. 
    */

### Controlling callbacks

With the asynchronous nature of NodeJS(and brower with AJAX too) it'll be great
if we can control the execution of the callback in the testing environment. And
`ctrl()` of nodemock helps that

    var ctrl = {};
    var mocked = nodemock.mock('foo').takes(10, function() {}).ctrl(1, ctrl);
    //where ever in your codebase
    ctrl.trigger(10, 20); // you can call this as many as you want
  
### Add multiple mock functions
    var mocked = nodemock.mock("foo").takes(10).returns(30);
    mocked.foo(10); //gives 30
    
    mocked.mock("bar").takes(true).returns(40);
    mocked.bar(true); // gives 40

  
### Assertion Support
    var mocked = nodemock.mock("foo").takes(20);
    var mocked = nodemock.mock("bar").takes(40);
    
    mocked.foo(20);
    mocked.bar(40);
    
    //check whether what we've defined is actually executed
    mocked.assert(); //returns true
  
### Fails when calls any method in the mock object
    var mocked = nodemock.fail();
    mocked.foo(); //throws an exception
    mocked.bar(); //throws an exception
  
### Fails when calls some particular method in the mock object
    var mocked = nodemock.mock("foo").fail();
    mocked.mock("bar").takes(10);
    mocked.foo(); //throws an exception
    mocked.bar(10); //works perfectly
  
### calls a single mocked method, multiple times
  
    var mocked = nodemock.mock("foo").takes(10, 20).times(2);
    
    mocked.foo(10, 20);
    mocked.foo(10, 20);

### calls a single mocked method, multiple times with different returns
  
    var mocked = nodemock.mock("foo").takes(10, 20).returns(100);
    mocked.mock('foo').takes(10, 20).returns(200);

    mocked.foo(10, 20); //returns 100
    mocked.foo(10, 20); //returns 200
  
### mock a single method more than once
    var mocked = nodemock.mock("foo").takes(10, 20);
    mocked.mock("foo").takes(20, 30);
    mocked.mock("foo").takes(500);
    
    mocked.foo(10, 20);
    mocked.foo(20, 30)
    mocked.foo(500);
    
    //check whether everything has done
    mocked.assert(); //returns true

### reset the mock
  
    var mocked = nodemock.mock('foo').returns(100);
    mocked.foo(); //returns 100
    mocked.assert(); //returns true
      
    mocked.reset();
    
    mocked.mock('doo').returns(300);
    mocked.doo(); //returns 300
    mock.assert() //returns true

### ignore method
Sometime we need to ignore some methods going through mocking rules. But we
need to have those methods but doing nothing.

    var mocked = nodemock.ignore('hello');
    mocked.mock('foo').returns(100);

    mock.foo(); //returns 100
    mock.hello(); //do nothing but the method exists

    mock.assert(); // return true, assert ignores ignored methods

API Documentation
-----------------

### Construction ###

    var mocked = require('nodemock').mock('foo');
      Creating a object with mock function "foo"
    
    mocked.mock(methodName)
      Used to alter or create a new mock method and add rules to it as usual
      
### Rules ###

    mocked.takes(arg1, args2, ...)
      Specify arguments of the function and verify then when calling

    mocked.takesF(function)
      As opposed to takes(), in which we can only specify static values,
      takesF() (note the "F" in the name to indicate that it takes a function)
      allows client code to provide a predicate that determines whether the
      mocked function should accept ("take") the value and allowing mock code
      to be a bit more dynamic.

    mocked.takesAll()
      A shorthand function that tells the mock function to accept any input.
      
    mocked.returns(returnValue)
      Specify the return value of the function

    mocked.returnsF(function)
      Similar to takesF(), returnsF() allows to provide a function that will
      dynamically generate values that will be returned from mock calls. The
      function will be provided with the parameters that were passed to the
      mock call.

    mocked.calls(callbackPosition, argumentsArray)     
      Calls a callback at the arguments in index `callbackPosition`
      with the arguments specified in the "argumentsArray"
      
      when using this you've to define a function signature as a callback in
      the argument list for a callback at index 2 .takes() function will be as,
      mocked.takes(10, 20, function(){})
  
    
    mocked.fail()
      If calls at very begining afterword any call on the mocked objects will
      fail. Otherwise current mock method will fails someone called that. 
      
    mocked.times(repetitiveCount);
      We can rule the mocked method to be called multiple times with same
      parameters. Finally we can check that using above assert method;

    mocked.reset()
      Reset all the rules and mocks created. And bring mocked object into a
      stage when it's created

    mocked.ignore()
      Ignore Some methods from the mocking behaviour
  
### Confirm ###

    mocked.assert();
      Checks whether rules we've defined using other methods were executed.
      If all the rules were executed return true, otherwise false

    mocked.assertThrows();
      Same as the mocked.assert() but throws an execption if rules breaks.

## Copyright

Copyright (c) 2011 Arunoda Susiripala

[Modifications from the `mockingbird` fork](https://github.com/realistschuckle/nodemock/commit/4943c7ea5597cecab09289ca55d3aff88524cbc5),
Copyright (c) 2013 Oscar Renalias

Remaining copyrights owned by individual contributors.
