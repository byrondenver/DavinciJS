var $ = window.$;
var Handlebars = window.Handlebars;
import model from '../models/todoModel';
import view from 'text!../views/todoItem.tpl';






var controller = {
  init: function(){
    model.init();
    // cache a jquery selector selectors
    controller.addButton = $('.btn-add');
    // compile todoItem template
    controller.compiledTemplate = Handlebars.compile(view);
    // render the to item template
    controller.renderTemplates();
  },
   // do all the visual stuff
  render: function(compiledTodos){
    // remove all the  event hadlers for the todo app on
    controller.destroyEventHandlers();
    // compiled todos is an array. we are joining the element of array to make one long string. put long string into html with a class of .todo-list
    
    $('.todo-list').html(compiledTodos.join(''));
     // not that all the todos have been added to DOM
    // add all the event hadlers for the todo app off
    controller.createEventHandlers();
  },
  renderTemplates: function(){
    
    // get the database
    // loop over each item in the database
    var compiledTodos = model.get().map(function(item, index){
      // create an ID equal to index + 1
      // the +1 makes it more human readable
      // id is required by our view
      item.id = index + 1;
      // use hadlebars, step 2
      // this step replaces {id} with the id value
     return controller.compiledTemplate(item);
     
    });// end of forEach
    // pass list of todos to the render funtion
    controller.render(compiledTodos);
    // tell the model to save our data
    model.save();
  },
  // romve eventHandler from app
  // get rady to re-render
  destroyEventHandlers: function(){
    controller.addButton.off();
    $('input[type="checkbox"]').off();
    $('.close').off();
  },
  // add the eventHandlers
  createEventHandlers: function(){
    controller.addButton.on('click', controller.addTodoHandler);
    $('input[type="checkbox"]').on('change', controller.checkedHandler);
    $('.close').on('click', controller.removeHandler);
  },
  // this is the eventHandler for the close x button
  // deletes the todo
  removeHandler: function(event){
    // which one was clicked??
    var index = $(event.currentTarget).parent().parent().index();
    // update the database
    model.get().splice(index, 1);
    // update the view
    controller.renderTemplates();
  },
  // eventHandler for the checkboxs
  checkedHandler: function(event){
    // which checkbox?
    var index = $(event.currentTarget).parent().parent().index();
    // update the database
    model.get()[index].completed = !model.get()[index].completed;

    // console.log(model[index]);
    // view updates automatically, Yay HTML!
    model.save();
    controller.renderTemplates();
  },
  // Event handle for the add button
  // creates a new todo
  addTodoHandler: function(){
    // reads the input using jquery .val()
    var newTitle = $('.add-input').val();
    // quick exit
    if (newTitle === '') return;
    // model.get() returns the database which is an array
    //push() adds an item to the database 
    model.get().push({
      title: newTitle,
      completed: false
    });
    // this is where we clear the text out of the box
    $('.add-input').val('');
    //Updates the display with the new data we grabbed
    controller.renderTemplates();
  }
};

// specifies what will be returned
// when this file is imported

module.exports = controller;