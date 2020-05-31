import {validateJwt, key, header} from "./jwt.js"

const validate = async ({request, cookies}, next) => {
    const token = await cookies.get("token");
    const result = await validateJwt(token, key, { isThrowing: false });
    if(result) {
        request.auth = true;
        request.userid = result.payload.id;
    }
    await next();
}

export default validate