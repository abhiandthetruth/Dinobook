import { Router } from 'https://deno.land/x/oak/mod.ts'
import { getDinosaurs, getDinosaur, addDinosaur, deleteDinosaur, updateDinosaur} from '../controllers/dinosaurController.js'
import { handleRegister, handleLogin, handleLogout } from '../controllers/userController.js'
import { addClaim, updateClaim, deleteClaim } from '../controllers/claimController.js'
import handle from '../utils/handle.js'
import getStatic from '../utils/static.js'

const router = new Router()

const display = async (ctx, template) => {
    ctx.response.body = await handle.renderView(template,{auth:ctx.request.auth})
}

router.get('/dinosaurs', getDinosaurs)
    .get('/dinosaurs/:id', getDinosaur)
    .post('/dinosaurs', addDinosaur)
    .put('/dinosaurs/:id', updateDinosaur)
    .delete('/dinosaurs/:id', deleteDinosaur)
    .post('/login', handleLogin)
    .post('/register', handleRegister)
    .get('/logout', handleLogout)
    .post('/claims', addClaim)
    .put('/claims', updateClaim)
    .delete('/claims', deleteClaim)
    .get('\/static\/(.*)', getStatic)
    .get('/add/dinosaurs', ctx => display(ctx, 'create'))
    .get('/login', ctx => display(ctx, 'login'))

export default router