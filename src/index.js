'use stric';

import express from 'express';
import bodyParser from 'body-parser';
import conf from '../config.js';
import OAuth from 'oauth';
import request from 'request';
 
let app = express(); // define our app using express

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 3000;  

let router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'hey! welcome to mautic api' });   
});

/*request.post({
    url: conf.BASE_URL + "oauth/v1/request_token",
    json: {
    	oauth_consumer_key="CONSUMER_KEY",
		oauth_nonce="UNIQUE_STRING",
		oauth_signature="GENERATED_REQUEST_SIGNATURE",
		oauth_signature_method="HMAC-SHA1",
		oauth_timestamp="1318467427",
		oauth_version="1.0"
    }    
	

}, function (err, httpResponse, body) {
    console.log('JSON response from the server: ' + body);
});*/

let oauth = new OAuth.OAuth(
      'https://mautic.acadevor.com/oauth/v1/request_token',
      'https://mautic.acadevor.com/oauth/v1/access_token',
      conf.MAUTIC_PUBLIC_KEY,
      conf.MAUTIC_SECRET_KEY,
      '1.0A',
      'localhost:3000',
      'HMAC-SHA1'
    );
console.log(oauth);
oauth.getOAuthRequestToken(function(err, token, token_secret, parsedQueryString){
	console.log(err);
	console.log(token);
	console.log(token_secret);
	console.log(parsedQueryString);
});
 /*   oauth.get(
      'https://api.twitter.com/1.1/trends/place.json?id=23424977',
      'your user token for this app', 
      //you can get it at dev.twitter.com for your own apps
      'your user secret for this app', 
      //you can get it at dev.twitter.com for your own apps
      function (e, data, res){
        if (e) console.error(e);        
        console.log(require('util').inspect(data));
        done();      
      });    
});*/

router.route('/contact')
	.post(function(req, res) {    
	    let contact = new Contact();
	    contact.email = req.body.email;

	    /* save the bear and check for errors
	    bear.save(function(err) {
	        if (err)
	            res.send(err);

	        res.json({ message: 'Contact created!' });
    	});*/
    
	});

app.use('/api', router);

app.listen(port)
console.log('Magic happens on port ' + port);