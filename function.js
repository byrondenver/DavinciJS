function.js

// Functional


// Each, Map, Reduce

// no return value
$.each(myArray, function(index, item){});
_.each(myArray, function(item, index){});
[].forEach(function(item, index){}); // ES6

// returns same number of items
$.map();
_.map();
[].map(function(item, index){}); // ES6

var returnValue = [1,2,3].map(function(item, index){
  return item + 5;
});
// [6,7,8]

// like map, but return value type can be different
// than input value type
$.reduce();
_.reduce();
[].reduce(function(memo, item, index){}, intialValue);

[1,2,3,4].reduce(function(memo, item, index){
  if (item % 2 === 0) memo.push(item);
  return memo;
}, [7,8,9]);
// [7,8,9,2,4]

[1,2,3,4].reduce(function(memo, item, index){
  return memo += item;
}, 0);
// 10



/// Little Tools


// Types

_.isFunction();
_.isArray();
_.isString();


// Arrays

var myArray = [1,2,3,4,5];

_.last(myArray) // 5
_.first(myArray) // 1

_.rest(myArray); // [2,3,4,5]
_.initial(myArray); // [1,2,3,4]


_.union([1,2], [3,4]); // [1,2,3,4]
//var products = _.union(_.pluck(sections, 'products'));

_.intersection([1,2,3], [2,3,4]); // [2,3]
_.difference([1,2,3], [2,3,4]); // [1,4]
_.without([1,2,3], [2,3,4]); // [1]


// Objects

var myObject = { name: "joe", age: 12 };

_.keys(myObject); // ["name", "age"]
myObject.keys(); // ["name", "age"]

_.values(myObect); // ["joe", 12]

_.has(myObject, "name"); // true
_.has(myObject, "address"); // false
myObject.hasOwnProperty("name"); // true

_.omit(myObject, "age"); // { name: "joe" }


// Promises

$.when(function(done){
  $.ajax({
    url: '/api/put',
    success: function(response){
      done(response);
    }
  });
}).then(function(done){
  $.ajax({
    url: '/api/post',
    success: function(response){
      done(response);
    }
  });
}).then(function(response){
  // do stuff with the response
});


// another promise library
async.parallel([
    function(done){},
    function(){},
    function(){},
    function(){},
    function(){},
    function(){}
  ], 
  function(){}
);
