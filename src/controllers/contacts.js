require("babel-polyfill");
import axios from 'axios';
import {ENV, URLS} from '../config/constants';

function throwEmailNeededException(ctx){
  ctx.throw({ message: {
      message: 'Bad Request' ,
      desc:  'Email Needed',
    }
  }, 400);
}

function accessTokenParam(){
  return 'access_token=' +  ENV.ACCESS_TOKEN;
}

function performGetContacts(options){
  return axios.get(URLS.GET_CONTACTS,options)
  .then(response => {
    return response.data
  })
}

function performPostContact(body){
  const url = URLS.CREATE_CONTACT + '?' + accessTokenParam();
  return axios.post(url, body)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      console.log(err);
      throw err;
    })
}

function performPatchContact(contactID, body){
  const url = URLS.UPDATE_CONTACT.replace(":id",contactID) + '?' + accessTokenParam();
  return axios.patch(url, body)
    .then(response => {
      return response.data;
    })
    .then(data => {
      return data.contact;
    })
    .catch(err => {
      throw err;
    });
}

exports.getContact = function* getContact(){
  let options = {
    params: {
      access_token: ENV.ACCESS_TOKEN,
    }
  };
  if(this.request.query.search){
    Object.assign(options.params,{'search' : this.request.query.search});
  }
  const contacts = yield performGetContacts(options);
  this.body = contacts;
}

exports.createContact =  function* createContact(){
  const body = this.request.body;

  if(!body.email){
    emailNeededException(this);
  }

  const response = yield performPostContact(body);
  this.status = 200
  this.body = response;
}

exports.updateContact = function* updateContact(){
    const body = this.request.body;

    if(!body.email){
       throwEmailNeededException(this);
    }

    let options = {
      params: {
        access_token: ENV.ACCESS_TOKEN,
        search : 'email:' + body.email
      }
    }

    const contacts = yield performGetContacts(options);
    //contact not found
    if(contacts.total == 0){
      this.throw({ message: {
          message: 'Contact Not found' ,
          desc:  '',
        }
      }, 400);
    }

    const contactID = contacts.contacts[0].id;
    const response = yield performPatchContact(contactID,body);
    this.status = 201
    this.body = response;
}
