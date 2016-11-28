import combineRouters from 'koa-combine-routers'
import authRouter from './auth'
import contactRouter from './contacts'

const router = combineRouters([
  authRouter,
  contactRouter,
])

export default router;
