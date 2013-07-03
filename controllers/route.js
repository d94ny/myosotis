/* Router */

/* https://github.com/felixge/node-mysql */
var mysql = require('mysql');
var http = require('http');
var render = require('./render');
var url_parser = require('url');

/* Exports gives others the permission to use 
   this file as a module.
   ex :
   var m = require('route');
   m.myFunc1();
*/
var default_bookmarks = [
      {shortcut:'y', url:'http://youtube.com', title:'YouTube', color:'F26D6F'},
      {shortcut:'t', url:'http://twitter.com', title:'Twitter', color:'75B4E2'},
      {shortcut:'f', url:'http://facebook.com', title:'Facebook', color:'707CBC'},
      {shortcut:'g', url:'http://google.com', title:'Google', color:'C4C4C3'},
      {shortcut:'v', url:'http://vine.co', title:'Vine', color:'87CDAB'},
      {shortcut:'i', url:'http://imdb.com', title:'Imdb', color:'DDE574'},
      {shortcut:'b', url:'http://tumblr.com', title:'Tumblr', color:'A775B3'}
    ];

var default_colors = {
    google : "C4C4C3",
    twitter : "75B4E2",
    youtube : "F26D6F",
    facebook : "707CBC",
    vine : "87CDAB",
    instagram : "AA925C",
    tumblr : "A775B3",
    imdb : "DDE574",
    bbc : "C45151",
    yahoo : "856FA8",
    spi0n : "826D44",
    dribbble: "CA7FCC",
    ycombinator : "E89D3A"
  }

/* Returns if the 'vecturia_data' is still valid
   for a certain request req */
function validCookie(req){

  return (req.cookies.vecturia_data!==undefined&&(req.cookies.vecturia_data instanceof Array));

}

/* Index page */
exports.index = function(req, res) {

    /* Check if cookie is set/valid, if not set it */
    if(!validCookie(req)){

      /* Set the cookie , it will be created once the response is sent */
      res.cookie('vecturia_data', default_bookmarks, { maxAge: 2592000*1000, httpOnly: true });
      /* Render index.jade as response, with the default bookmarks */
      render.index(res,default_bookmarks);
      
    } else {

      /* Reder index.jade as response with the default cookies */
      render.index(res,req.cookies.vecturia_data);

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
      if(input.url.trim()==""||input.shortcut.length!=1){

        /* If invalid redirect to index */ 
        res.redirect("/");
      }

      /* Be Carefull ! Cookies are affected when res is sent */

      /* Get the title using regrex */
      if(input.url.indexOf("http://") === -1){
        var url = "http://"+input.url;
      } else {
        var url = input.url;
      }

      /* Parse the url to get the hostname */
      var parsed = url_parser.parse(url);

      /* If the url is invalid we have no hostname */
      if(parsed.hostname!==undefined){

        /* remove wwww and then split into parts */
        var domains = parsed.hostname.replace("www.","").split('.');

        /* If we have multiple parts (subdomains), use the second to last part */
        if(domains.length-2>=0) var domain = domains[domains.length-2];
        else var domain = domains[0];

        /* Capitalize the first letter */
        var title = domain.charAt(0).toUpperCase() + domain.slice(1);

      } else {

        /* If invalid domain just use the url as title */
        var title = url.replace("http://","");

      }

      /* Get random color */
      var colors = [ "F26D6F", "75B4E2","707CBC","B7B7B7","87CDAB","DDE574","A775B3", "AA925C", "C45151", "856FA8", "CA7FCC","E89D3A" ];
      if(default_colors[title.toLowerCase()]!==undefined){

        /* If that hostname is in our default Object */
        var color = default_colors[title.toLowerCase()];

      } else {

        /* If not assign random color */
        var random = Math.floor(Math.random()*colors.length);
        var color = colors[random];

      }

      /* Create the object 'bookmark' */
      var bookmark = {
        "shortcut" : input.shortcut.charAt(0),
        "url" : url,
        title :title,
        color : color
      };

      /* Get the data from the cookie which is valid (tested before)
         and add the bookmark via push() */
      var data = req.cookies.vecturia_data;
      data.push(bookmark);

      /* Now send a new cookie to the response */
      res.cookie('vecturia_data', data, { maxAge: 2592000*1000, httpOnly: true });
      
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
    var data = req.cookies.vecturia_data;

    /* Validate our POST data : index of bookmarks to be remioved */
    if(data.length>index&&index>=0){

      /* Remove the object in our array using splice() */
      data.splice(index , 1);

      /* Now send a new cookie to the response */
      res.cookie('vecturia_data', data, { maxAge: 2592000*1000, httpOnly: true });
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