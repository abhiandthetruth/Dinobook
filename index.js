import { Application, send } from 'https://deno.land/x/oak/mod.ts'
import router from './routes/routes.js'
import validate from './utils/validate.js';
const port = 5000

const app = new Application()
app.addEventListener("error", (evt) => {
    // Will log the thrown error to the console.
    console.log(evt.error);
});

app.use(validate)
app.use(router.routes())
app.use(router.allowedMethods())

console.log(`Server running on port ${port}`)

await app.listen({ port })