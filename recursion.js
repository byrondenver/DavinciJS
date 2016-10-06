
// Functional Javascript

// ES6 Arrow function
var sum = (a, b) => a + b;

// ES5 function
var sum = function(a, b){
  return a + b;
}


// Example
var isAnimal = 
  type => 
    animal =>
      (animal.type === type);


// Combinators

// Y Combinator
var y = (x) => y(x); // recursion!
// call stack size limit exceeded

[].forEach()
$.each()
_.each()


// SKI Calculus
// I Combinator, identity
var i = (a) => a;
i(10); // 10

_.identity(10); // 10

// K Combinator, curry
var k = (a) => () => a;
var alwaysTrue = k(true);
alwaysTrue(); // true

var addSomeNum = (a) => (b) => a + b;
var add4 = addSomeNum(4);
add4(7); // 11

var multiplySomeNum = (a) => (b) => a * b;
var multiply7 = multiplySomeNum(7);
multiply7(2); // 14

// S Combinator, composition
var s = (a, b) => (c) => a(b(c));

var add4times7 = s(add4, multiply7);
add4times7(3); // 25

compose(
  validateAsString,
  validateAsEmail,
  validateAsAllowedDomain
)


// Purity
// no side effects & has a return value

// pure
var sum = function(a, b){
  return a + b;
}

// impure
var sum = function(a, b){
  console.log(a + b);
}

// impure
var list = [];
var addToList = function(a){
  list.push(a);
}

