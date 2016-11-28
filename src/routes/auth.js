require("babel-polyfill");
import Router from 'koa-router';
import simpleOauth2 from 'simple-oauth2';
import {ENV} from '../config/constants';

const router = new Router({ prefix: '/auth' });
const redirect_uri = ENV.MAUTIC_REDIRECT_URI;
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
  redirect_uri,
  state: '4c4d3v0r'
});

// Initial page redirecting to Github
router.get('/', function *() {
  console.log(authorizationUri);
  this.redirect(authorizationUri);
});

// Callback service parsing the authorization token and asking for the access token
router.get('/callback', function *(){
  const code = this.request.query.code;
  const options = {
    code,
    redirect_uri,
  };

  const token = yield oauth2.authorizationCode.getToken(options, (error, result) => {
    if (error) {
      console.error('Access Token Error', error.message);
      return res.json('Authentication failed');
    }

    console.log('The resulting token: ', result);
    const token = oauth2.accessToken.create(result);
  });

  this.body = token;
});

export default router;
