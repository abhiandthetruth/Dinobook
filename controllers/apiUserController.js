import db from "../db.js"
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts"
import {makeJwt, key, payload, header} from "../utils/jwt.js"

const users = db.collection("Users");

const handleLogin = async ({request, response, cookies}) => {
    const body = await request.body();
    const user = await users.findOne({userid: body.value.userid});
    if(user){
        if(await bcrypt.compare(body.value.password, user.password)){
            response.body = {user:body.value.userid, auth:true};
            payload.id = body.value.userid;
            cookies.set("token", makeJwt({ header, payload, key }));
        }
        else{
            response.status = 401;
            response.body = {msg: "Invalid password"};
        }
    }
    else{
        response.status = 404;
        response.body = {msg: "Invalid UserID"};
    }
}

const handleRegister = async ({request, response}) => {
    const body = await request.body();
    const userfromid = await users.findOne({userid: body.value.userid});
    const userfromemail = await users.findOne({email:body.value.email});
    if(userfromemail){
        response.status = 403;
        response.body = {"msg": "email already exists"};
    }
    else if(userfromid){
        response.status = 403;
        response.body = {"msg": "ID already exists"};
    }
    else{
        const userID = await users.insertOne({
            userid: body.value.userid,
            password: await bcrypt.hash(body.value.password),
            email: body.value.email
        });
        response.body = userID; 
    }
}

const handleLogout = async ({response, cookies}) => {
    cookies.set("token", "");
    response.body = {"msg": "Logged Out"};
}

export {handleLogin, handleRegister, handleLogout}