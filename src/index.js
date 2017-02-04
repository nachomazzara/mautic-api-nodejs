import koa from 'koa';
import logger from 'koa-logger';
import router from './routes'

let app = koa();

// logger
app.use(logger('dev'));

// main middleware
app.use(function *(next) {
  try {
    yield next;
  } catch (err) {
    let message = ""; // normalize message if fail on http request
    if(err.response && err.response.statusText){
       message = {message : err.response.statusText}
    }
    this.status = err.status || (err.response && err.response.status) || 500;
    this.body = message || err.message ;
    this.app.emit('error', err, this);
  }
});

// endpoints
app.use(router);
let port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening to port ' + port);
