require("babel-polyfill")
import axios from 'axios'
import {ENV, URLS} from '../config/constants'

axios.defaults.headers.common['Authorization'] = `basic ${ENV.BASIC_AUTH}`

function throwEmailNeededException (ctx) {
  ctx.throw({ message: {
      message: 'Bad Request',
      desc:  'Email Needed',
    }
  }, 400)
}

function performGetContacts (options) {
  return axios.get(URLS.GET_CONTACTS)
  .then(response => {
    return response.data
  })
}

function performPostContact (body) {
  const url = URLS.CREATE_CONTACT;
  return axios.post(url, body)
    .then(response => {
      return response.data
    })
    .catch(err => {
      console.log(err)
      throw err
    })
}

function performPatchContact (contactID, body) {
  const url = URLS.UPDATE_CONTACT.replace(":id",contactID)
  return axios.patch(url, body)
    .then(response => {
      return response.data
    })
    .then(data => {
      return data.contact
    })
    .catch(err => {
      throw err
    });
}

function performDNC (contactID) {
  const url = URLS.DNC_CONTACT.replace(":id",contactID)
  return axios.post(url)
    .then(response => {
      return response.data
    })
    .then(data => {
      return data.contact
    })
    .catch(err => {
      throw err
    });
}

function* getContactID (ctx, body) {
  if(!body.email){
     throwEmailNeededException(ctx)
  }

  let options = {
    params: {
      search : 'email:' + body.email
    }
  }

  const contacts = yield performGetContacts(options)
  //contact not found
  if(contacts.total == 0){
    this.throw({ message: {
        message: 'Contact Not found' ,
        desc:  '',
      }
    }, 400);
  }
  return contacts.contacts[0].id
}

exports.getContact = function* getContact () {
  let options = {}
  if(this.request.query.search){
    options = {
      'params': {'search' : this.request.query.search}
    }
  }
  const contacts = yield performGetContacts(options)
  this.body = contacts
}

exports.createContact =  function* createContact () {
  const body = this.request.body

  if(!body.email){
    emailNeededException(this)
  }

  const response = yield performPostContact(body)
  this.status = 201
  this.body = response
}

exports.updateContact = function* updateContact () {
    const body = this.request.body
    const contactID = yield getContactID(this, body)
    const response = yield performPatchContact(contactID, body)
    this.status = 200
    this.body = response
}

exports.dnc = function* dnc () {
  const body = this.request.body;

  const contactID = yield getContactID(this, body)
  console.log(contactID)
  const response = yield performDNC(contactID)
  this.status = 200
  this.body = response
}
