import Router from 'koa-router';
import KoaBody from 'koa-body';
import Contact from '../controllers/contacts';
const koaBody = KoaBody();
const router = new Router({ prefix: '/api/contacts' });

/* GET /contacts get contacts
  @querystring  search   example => search=email:nachomazzara@gmail.com
 */
router.get('/', Contact.getContact);

/* Post /contacts create. */
router.post('/',koaBody, Contact.createContact);

/* PATCH /contacts edit. */
router.patch('/',koaBody, Contact.updateContact);

/* PATCH /dnc set No contacts */
router.patch('/dnc',koaBody, Contact.dnc);



export default router;
