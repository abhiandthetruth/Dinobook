import { validateJwt } from "https://deno.land/x/djwt/validate.ts"
import { makeJwt, setExpiration} from "https://deno.land/x/djwt/create.ts"

const key = "your-secret"
const payload = {
  exp: setExpiration(new Date().getTime() + 60000*60),
}
const header = {
  alg: "HS256",
  typ: "JWT",
}

export {validateJwt, makeJwt, key, payload, header}