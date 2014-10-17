/* Render pages */
/* We just render stuff */
exports.index = function(res,data){
	res.render('index', {
      todos: data
    },function(err,html){

      /* err contains a possible error
         html the rendered string */
      if(err) {
        /* Render panic.jade as response */
        res.render('panic');
      } else {
        /* We send the repsonse */
        res.send(html);
      }

    });
}

exports.panic = function(res){
  res.render('panic', function(err, html){

    if(err) res.send(500);
    else res.send(html);

  });
}

exports.expired = function(res){
  res.render('expired', function(err, html){

    if(err) res.send(500);
    else res.send(html);

  });
}