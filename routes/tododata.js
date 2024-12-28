var alert = require("alert");
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId=require('mongodb').ObjectId;
var url = "mongodb://localhost:27017/monthlydb"; 
const bodyParser = require('body-parser');
const fs = require("fs");
const jwt = require('jsonwebtoken');
const multer = require("multer");
const mongoose = require("mongoose");

/* GET users listing. */



router.get("/viewtodo",verifyToken,function(req,res){
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {res.sendStatus(403);}
    else{
  res.redirect("/todo/todo");}
  })
})


function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.session.tk;
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    // Get token from array
    // Set the token
    req.token = bearerHeader;
    // Next middleware
    next();
  } else {
    // Forbidden 
    res.sendStatus(403);
  }

}

router.get("/todo",verifyToken,function(req,res){
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {res.sendStatus(403);}
    else{
      async function tododata(){
        try{
        var result = await dbcon.collection("todo").find({"personname":req.session.ename}).toArray();
        // res.json(result);
       res.render("todo",{"data":result});
        }
        catch(err){
          console.log(err.message);
        }
      }
      tododata();
 
}
  })
})

router.post("/addtodo",function(req,res){
  var a={"personname":req.session.ename,"tododata":req.body.tododata};
  async function tododata(){
    try{
    await dbcon.collection("todo").insertOne(a);
    res.redirect("/todo/todo");
    }
    catch(err){
      console.log(err.message);
    }
  }
  tododata();
})

router.post("/deletetodo",function(req,res){
  var pkey=req.body.mkey;
  async function tododata(){
    try{
    await dbcon.collection("todo").deleteOne({"_id":ObjectId(pkey)});
    res.redirect("/todo/todo");
    }
    catch(err){
      console.log(err.message);
    }
  }
  tododata();
})



module.exports = router;
