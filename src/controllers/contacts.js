require("babel-polyfill");
import axios from 'axios';
import {ENV, URLS} from '../config/constants';


function performGetContacts(options){
  return axios.get(URLS.contacts,options)
  .then(response => {
    return response.data
  })
}

function performPatchContact(contactID, body){
  return axios.patch(URLS.contacts + '/' + contactID + '/edit?access_token=' +  ENV.ACCESS_TOKEN , {
        firstname: body.firstname
    })
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
  this.body = 'create contact' ;
   /*if(!req.body.email){
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
  })*/
}

exports.updateContact = function* updateContact(){
    let body = this.request.body;

    if(!body.email){
       this.throw({ message: {
           message: 'Bad Request' ,
           desc:  'Email Needed',
         }
       }, 400);
    }

    let options = {
      params: {
        access_token: ENV.ACCESS_TOKEN,
        search : 'email:' + body.email
      }
    };
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
