## Synopsis

RESTFul API which works as a middle layer between http request (e.g: by ajax) and Mautic RESTful API.

### Use
  * [Mautic REST API](https://developer.mautic.org/?json#rest-api).
  * Oauth 2

## Motivation

In [Acadevor](http://acadevor.com) we needed to connect with Mautic as our core marketing automation's engine.

## Installation

Create config.js based on sample.config.js *in the same root*

Change variables with yours (*ACCESS_TOKEN* and *REFRESH_TOKEN* are be filled later. Keep them blank so far...)

```
MAUTIC_BASE_URL: 'https://your-mautic-url.com/',
MAUTIC_REDIRECT_URI: 'http://localhost:3000/auth/callback',
MAUTIC_PUBLIC_KEY: 'MAUTIC_PUBLIC_KEY',
MAUTIC_SECRET_KEY: 'MAUTIC_SECRET_KEY',
ACCESS_TOKEN: 'ACCESS_TOKEN',
REFRESH_TOKEN: 'REFRESH_TOKEN'
```

Run

`npm install`

`npm start`

Open in your browser

`localhost:3000/auth`

Fill your mautic credentials

After submit you will be redirected to `localhost:3000/auth/callback`

Copy `access_token` and `refres_token` from displayed response

`{"access_token":"(YTFhZDg5MzUyM451M2JhY2YyODk32FKIKG1N2E4ZmQ2ZmJmMDJmYzY1NmE0Mjk0NGMxNjhmNTdmZDljZTDNiNQ)","expires_in":2160000000000,"token_type":"bearer","scope":null,"refresh_token":"OTYzNjUzYzg2M2U5MJkOGY1YjA2MjJlMDAzYMmJlMGI2NDk1ZWNMyZDJZmNDE5MDdhZmNhMQ","expires_at":"+070464-08-01T23:19:40.235Z"}`

And paste them into config.js

Go to

`localhost:3000/api/contacts`

If you see a json with contacts response you did it right :+1: !!!!!


## API Reference

### Endpoints at `/api/....`

GET /contacts get json of contacts
 @querystring search=field:value


POST /contact create a new contact
  @body: {
    'email' : 'email@email.com',
  }

PATCH /contact update a contact
  @body: {
    'email' : 'email@email.com',
  }

`localhost:3000/api/contacts`



## Tests

Oops....

## Contributors

Want to extend? write me at: nachomazzara@gmail.com

## License

MIT licence
