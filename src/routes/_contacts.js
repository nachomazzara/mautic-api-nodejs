import express from 'express';
import Contact from '../controllers/contacts';
import {URLS} from '../config/constants';


let router = express.Router();

router.route('/')
  /* GET /contacts listing. */
  .get(Contact.getContact)

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

    /* PATCH /contacts edit or create if not exists. */
    .patch(Contact.updateContact)

module.exports = router;
