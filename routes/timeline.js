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





router.get("/addtimeline",verifyToken,function(req,res){
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {res.sendStatus(403);}
    else{
    res.render("timelineform");
    }
  })
})


router.get("/viewtimeline",verifyToken,function(req,res){
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {res.sendStatus(403);}
    else{
    var dateObj=new Date();
    var mt=dateObj.getUTCMonth();
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var month=months[mt];
    var a={"Month":month,"personname":req.session.ename};
    async function timeline(){
      try{
      var result = await dbcon.collection("timeline").find(a).toArray();
      res.render("timeline",{"data":result,"prmonth":month});
      }
      catch(err){
        console.log(err.message);
      }
    }
    timeline();
    }
  })
})


router.post("/savetimeline",function(req,res){
  var x=req.body.timelinedate;
  var dt=x.split("-");
  var dtm=parseInt(dt[1]);
  var dty=parseInt(dt[0]);
  var dtd=parseInt(dt[2]);
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var dtmonth=months[dtm-1];
  var a={"timelinedata":req.body.timelinedata,"Date":req.body.timelinedate,"Month":dtmonth,"Year":dty,"Day":dtd,"personname":req.session.ename};
  async function timeline(){
    try{
    await dbcon.collection("timeline").insertOne(a);
    alert("TimeLine Added Succesfully");
    res.redirect("/home");
    }
    catch(err){
      console.log(err.message);
    }
  }
  timeline();
 
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



module.exports = router;
