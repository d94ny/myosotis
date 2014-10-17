/* Router */

/* https://github.com/felixge/node-mysql */
var mysql = require('mysql');
var http = require('http');
var render = require('./render');

/* Exports gives others the permission to use 
   this file as a module.
   ex :
   var m = require('route');
   m.myFunc1();
*/
var default_todos = [
      { content:'Think of something to do', color:'F26D6F'},
      { content:'Write it down', color:'75B4E2'},
      { content:'Do it', color:'707CBC'},
    ];

/* Returns if the 'vecturia_data' is still valid
   for a certain request req */
function validCookie(req){

  return (req.cookies.todo_data!==undefined&&(req.cookies.todo_data instanceof Array));

}

/* Index page */
exports.index = function(req, res) {

    /* Check if cookie is set/valid, if not set it */
    if(!validCookie(req)){

      /* Set the cookie , it will be created once the response is sent */
      res.cookie('todo_data', default_todos, { maxAge: 2592000*1000, httpOnly: true });
      /* Render index.jade as response, with the default bookmarks */
      render.index(res,default_todos);
      
    } else {

      /* Reder index.jade as response with the default cookies */
      render.index(res,req.cookies.todo_data);

    }
    
}

/* Save a bookmark */
exports.save = function(req, res) {

    if(!validCookie(req)) {

      /* Cookie is expired, render expired.jade as response */
      res.render('expired');

    } else {

      /* Get the POST data */
      var input = req.body;

      /* Validate our data */
      if(input.content.trim()==""){

        /* If invalid redirect to index */ 
        res.redirect("/");
        return;

      }

      /* Be Carefull ! Cookies are affected when res is sent */

      /* Get random color */
      var colors = [ "F26D6F", "75B4E2","707CBC","B7B7B7","87CDAB","DDE574","A775B3", "AA925C", "C45151", "856FA8", "CA7FCC","E89D3A" ];
      /* If not assign random color */
      var random = Math.floor(Math.random()*colors.length);
      var color = colors[random];

      /* Create the object 'todo' */
      var todo = {
        "content" : input.content,
        color : color
      };

      /* Get the data from the cookie which is valid (tested before)
         and add the bookmark via push() */
      var data = req.cookies.todo_data;
      data.push(todo);

      /* Now send a new cookie to the response */
      res.cookie('todo_data', data, { maxAge: 2592000*1000, httpOnly: true });
      
      /* We redirect to have the right url again
         rendering index here would be an option too */
    	res.redirect('/');

    }
}

/* Remove a bookmark */
exports.remove = function(req, res){

  if(!validCookie(req)) {

    /* Cookie is expired, render expired.jade as response */
    res.render('expired');

  } else {

    /* Get the POST data */
    var input = req.body;

    /* Parse the input into a int */
    var index = parseInt(input.index);

    /* We get the bookmarks from the cookie which is valid */
    var data = req.cookies.todo_data;

    /* Validate our POST data : index of bookmarks to be remioved */
    if(data.length>index&&index>=0){

      /* Remove the object in our array using splice() */
      data.splice(index , 1);

      /* Now send a new cookie to the response */
      res.cookie('todo_data', data, { maxAge: 2592000*1000, httpOnly: true });
    }

    /* We redirect to have the right url again
      rendering index here would be an option too */
    res.redirect('/');

  }
}

/* Handle favicon */
exports.favicon = function(req, res){
	return;
}

/* Handle errors and stuff */
exports.panic = function(req, res){
  render.panic(res);
}