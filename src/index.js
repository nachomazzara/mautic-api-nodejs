'use stric';

import express from 'express';
import bodyParser from 'body-parser';
import {ENV, URLS} from '../src/config/constants';
import simpleOauth2 from 'simple-oauth2';
import request from 'request';
import rp from 'request-promise';
import axios from 'axios';

let app = express(); // define our app using express

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 3000;

let router = express.Router(); // get an instance of the express Router

router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

// Set the configuration settings
const credentials = {
  client: {
    id: ENV.MAUTIC_PUBLIC_KEY,
    secret: ENV.MAUTIC_SECRET_KEY,
  },
  auth: {
    tokenHost: ENV.MAUTIC_BASE_URL,
    tokenPath: ENV.MAUTIC_TOKEN_PATH,
    authorizePath: ENV.MAUTIC_AUTH_PATH,
 },
};

// Initialize the OAuth2 Library
const oauth2 = simpleOauth2.create(credentials);
const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: ENV.BASE_URL + 'callback',
  state: '4c4d3v0r'
});

// Initial page redirecting to Github
router.get('/auth', (req, res) => {
  debugger;
  console.log(authorizationUri);
  res.redirect(authorizationUri);
});

// Callback service parsing the authorization token and asking for the access token
router.get('/callback', (req, res) => {
  const code = req.query.code;
  const options = {
    code,
    redirect_uri: ENV.BASE_URL + 'callback',
  };

  oauth2.authorizationCode.getToken(options, (error, result) => {
    if (error) {
      console.error('Access Token Error', error.message);
      return res.json('Authentication failed');
    }

    console.log('The resulting token: ', result);
    const token = oauth2.accessToken.create(result);

    return res
      .status(200)
      .json(token);
  });
});

/* API START */

/* /Contacts */
router.route('/contacts')
  /* GET /contacts listing. */
  .get((req,res) => {
    axios.get(URLS.contacts,{
        params: {
          access_token: ENV.ACCESS_TOKEN,
        }
      })
      .then(response => {
        return response.data
      })
      .then(contacts => {
        res
        .status(200)
        .send(contacts);
      })
      .catch(err => {
          res.send(err);
      });
  })
  /* POST /contacts create. */
	.post((req, res) => {

    if(!req.body.email){
      return res
        .status(400)
        .json({
          message: 'Bad Request' ,
          desc:  'Email Needed',
        });
    }

    axios.post(URLS.contacts + '/new?access_token=' +  ENV.ACCESS_TOKEN , {
          email: req.body.email,
          firstname: req.body.firstname,
      })
      .then(response => {
        console.log(response);
        return res
        .status(201)
        .json({ message: 'Contact created!' });
      })
      .catch(err => {
        console.log(err);
        return err.response;
      }).then(response => {
        return res
        .status(response.status)
        .json(response.data);
      })
    })
    /* PUT /contacts edit or create if not exists. */
    .patch((req, res) => {
      if(!req.body.email){
        return res
          .status(400)
          .json({
            message: 'Bad Request' ,
            desc:  'Email Needed',
          });
      }

      let contactID = "";

      axios.get(URLS.contacts,{
          params: {
            access_token: ENV.ACCESS_TOKEN,
            search: 'email:' + req.body.email,
          }
        })
        .then(response => {
          return response.data.contacts;
        })
        .then(contacts => {
          contactID = contacts[0].id;
          axios.patch(URLS.contacts + '/' + contactID + '/edit?access_token=' +  ENV.ACCESS_TOKEN , {
                firstname: req.body.firstname
            })
            .then(response => {
              console.log(response);
              return res
              .status(201)
              .json({ message: 'Contact edited!' });
            })
            .catch(err => {
              console.log(err);
              return err.response;
            }).then(response => {
              res
              .status(response.status)
              .json(response.data);
            })
        })
        .catch(err => {
            res.send(err);
        });

    });

app.use('/api', router);

app.listen(port)
console.log('Listening to port ' + port);
