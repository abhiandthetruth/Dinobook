import db from "../db.js"
import handle from '../utils/handle.js'

const dinosaurs = await db.collection("Dinosaurs");

const getDinosaurs = async ({request, response }) => {
    const dinosaurList = await dinosaurs.find({});
    response.body = await handle.renderView('index',{auth:request.auth, dinosuars:dinosaurList});
}

const getDinosaur = async ({ params, response }) => {
    const dinosaur = await dinosaurs.findOne({id:params.id});
    if(dinosaur) response.body = dinosaur;
    else {response.status = 404; response.body = {msg: "No entry found!"};}
}

const addDinosaur = async ({ request, response }) => {
    if(request.auth){
        const body = await request.body();
        const dinosaur = await dinosaurs.findOne({id:body.value.id});
        if(dinosaur){
            response.status = 403;
            response.body = {msg: "dinosaur with the given id already exists!"}
        }
        else{
            const dinosaurID = await dinosaurs.insertOne(body.value);
            response.body = await dinosaurs.find({});
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