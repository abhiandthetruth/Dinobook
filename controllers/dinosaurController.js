import db from "../db.js"
import handle from '../utils/handle.js'
import parseBody from '../utils/parseBody.js'
const dinosaurs = await db.collection("Dinosaurs");

const getDinosaurs = async ({request, response }) => {
    const dinosaurList = await dinosaurs.find({});
    response.body = await handle.renderView('list',{auth:request.auth, dinosaurs:dinosaurList});
}

const getDinosaur = async ({ params, response }) => {
    const dinosaur = await dinosaurs.findOne({id:params.id});
    if(dinosaur) response.body = dinosaur;
    else {response.status = 404; response.body = {msg: "No entry found!"};}
}

const addDinosaur = async ({ request, response }) => {
    if(request.auth){
        let body = await request.body();
        body = parseBody(body);
        if(body.type==="form"){
            body.value.areas = body.value.areas.split(",").map(v=>v.trim());
            body.value.references = body.value.references.split(",").map(v=>v.trim());
            body.value.claims = [];
        }
        const dinosaur = await dinosaurs.findOne({id:body.value.id});
        if(dinosaur){
            response.status = 403;
            response.body = await handle.renderView('create', {auth:request.auth, msg: "dinosaur with the given id already exists!"});
        }
        else{
            const dinosaurID = await dinosaurs.insertOne(body.value);
            response.body = await handle.renderView('list', {auth:request.auth, dinosaurs: await dinosaurs.find({})});
        }
    }
    else{
        response.status = 401;
        response.body = {msg: "Login Required"} 
    }
}

const updateDinosaur = async({ params, request, response }) => {
    if(request.auth){
        const body = await request.body();
        const change = await dinosaurs.updateOne({id:params.id}, body.value);
        if(change.matchedCount < 1) {
            response.status = 404;
            response.body = {msg: "No entry found!"};
        }
        else response.body = await dinosaurs.find({});
    }
    else{
        response.status = 401;
        response.body = {msg: "Login Required"} 
    }
}

const deleteDinosaur = async ({ params, response }) => {
    if(request.auth){
        const count = await dinosaurs.deleteOne({ id: params.id });
        if(count < 1) {
            response.status = 404;
            response.body = {msg: "No entry found!"};
        }
        else response.body = await dinosaurs.find({});
    }
    else{
        response.status = 401;
        response.body = {msg: "Login Required"} 
    }
}

export { getDinosaurs, getDinosaur, addDinosaur, updateDinosaur, deleteDinosaur }