
// base framework
import $ from 'jquery';

// legacy loading for bootstrap javascript
window.$ = window.jQuery = $;
require('bootstrap');

// import our styles
import './stylesheets/base.scss';
import _ from 'underscore';
import todoController from './pages/todo';
import d3Controller from './pages/Yo';
import threeController from './pages/threeExample';
// import multimediaController  from './pages/multimedia';

// on document load
$(function(){

  console.log('%c App Started', 'color:green');

  

  // set default template settings
  _.templateSettings = {
    evaluate:    /{{([\s\S]+?)}}/g,
    interpolate: /{{-([\s\S]+?)}}/g,
    escape:      /{{=([\s\S]+?)}}/g
  };

  // kick off the app!
  // Which page are we on???
  if(window.location.pathname === '/pages/todo.html'){
    todoController.init();
  } else if (window.location.pathname === '/pages/multimediaController.html'){
    console.log('multimedia page started');
  } else if (window.location.pathname === '/pages/Yo.html'){
    d3Controller.init();
  } else if (window.location.pathname === '/pages/threeExample.html'){
    threeController.init();
  }
});
