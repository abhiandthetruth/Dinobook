import db from "../db.js"
const dinosaurs = await db.collection("Dinosaurs");

const mapUser = (value) => {
    return value.userid;
}

const addClaim = async ({request, response}) => {
    if(request.auth){
        const body = await request.body();
        const userid = request.userid;
        const dinosaur = await dinosaurs.findOne({id:body.value.id});
        if(!dinosaur.claims.map(mapUser).includes(userid)){
            await dinosaurs.updateOne({id:body.value.id}, {
                $push: {
                    "claims" : {userid:userid, claim: body.value.claim}
                }
            });
            dinosaur.claims.push({userid:userid, claim: body.value.claim});
            response.body = dinosaur;
        }
        else{
            response.status = 403;
            response.body = {"msg" : "Cannot claim more than once!"} 
        }
    }
    else{
        response.status = 401;
        response.body = {msg: "Login Required"} 
    } 
}

const updateClaim = async ({request, response}) => {
    if(request.auth){
        const body = await request.body();
        const userid = request.userid;
        const dinosaur = await dinosaurs.findOne({id:body.value.id});
        if(dinosaur.claims.map(mapUser).includes(userid)){
            const newclaims = dinosaur.claims.map((value)=>{
                if(value.userid == userid)
                    value.claim = body.value.claim;
                return value;
            });
            await dinosaurs.updateOne({id:body.value.id}, {
                $set: {
                    "claims":newclaims
                }
            });
            dinosaur.claims = newclaims;
            response.body = dinosaur;
        }
        else{
            response.status = 404;
            response.body = {"msg": "No associated claim found"}
        }
    }
    else{
        response.status = 401;
        response.body = {msg: "Login Required"} 
    }  
}

const deleteClaim = async ({request, response}) => {
    if(request.auth){
        const body = await request.body();
        const userid = request.userid;
        const dinosaur = await dinosaurs.findOne({id:body.value.id});
        if(dinosaur.claims.map(mapUser).includes(userid)){
            const newclaims = dinosaur.claims.filter(value => value.userid !== userid);
            dinosaur.claims = newclaims;
            await dinosaurs.updateOne({id:body.value.id}, {
                $set: {
                    "claims":newclaims
                }
            });
            response.body = dinosaur;
        }
        else{
            response.status = 404;
            response.body = {"msg": "No associated claim found"}
        }
    }
    else{
        response.status = 401;
        response.body = {msg: "Login Required"} 
    }
}

export {addClaim, updateClaim, deleteClaim}