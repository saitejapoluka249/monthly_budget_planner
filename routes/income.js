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




router.get("/viewincome",verifyToken,function(req,res){
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {res.sendStatus(403);}
    else{
    res.redirect("/income/incomeopen");
    }
  })
})

router.post("/addincome",function(req,res){
  if(req.session.auth){
    res.render("addincomeform");}
    else{
      res.send("user not found");
    }
})


router.post("/saveincome",function(req,res){
  var x=req.body.incdate;
  var dt=x.split("-");
  var dtyear=parseInt(dt[0]);
  var dtmonth=parseInt(dt[1]);
  var dtday=parseInt(dt[2]);
  const d = new Date();
  let pyear = parseInt(d.getUTCFullYear());
  var sobj={"personname":req.session.ename,"incometype":req.body.inctype,"incomeamount":parseInt(req.body.incamount),"Date":req.body.incdate,"Year":dtyear,"Month":dtmonth,"Day":dtday}; 
  
  if(dtyear<=pyear){
    dbcon.collection("incomedata").insertOne(sobj,function(err,res1){
      
      alert("Succesfully added");
      res.redirect("/income/incomeopen");
  
    })
  }
  else{
    res.send("Check Properly");
  }
})

router.post("/deleteincome",function(req,res){
  var pkey=req.body.mkey;
  async function incomedata(){
    try{
    await dbcon.collection("incomedata").deleteOne({"_id":ObjectId(pkey)});
    alert("deleted succesfully");
    res.redirect("/income/incomeopen");    
    }
    catch(err){
      console.log(err.message);
    }
  }
  incomedata();
})


router.post("/editincome",function(req,res){
  var pkey=req.body.ukey;
  async function incomedata(){
    try{
    var result=await dbcon.collection("incomedata").findOne({"_id":ObjectId(pkey)});
    res.render("editincomeform",{"data":result});
    }
    catch(err){
      console.log(err.message);
    }
  }
  incomedata();

    })


router.post("/saveeditincome",function(req,res){
      var pkey=req.body.mkey;
      var x=req.body.incdate;
      var dt=x.split("-");
      var dtyear=parseInt(dt[0]);
      var dtmonth=parseInt(dt[1]);
      var dtday=parseInt(dt[2]);
      const d = new Date();
      let pyear = parseInt(d.getUTCFullYear());
      var sobj={"personname":req.session.ename,"incometype":req.body.inctype,"incomeamount":parseInt(req.body.incamount),"Date":req.body.incdate,"Year":dtyear,"Month":dtmonth,"Day":dtday}; 
      var obj={"Date":req.body.expdate};
      async function incomedata(){
        try{
        await dbcon.collection("incomedata").updateOne({"_id":ObjectId(pkey)},{$set:sobj});
        alert("Updated Succesfully");
        res.redirect("/income/incomeopen");
        }
        catch(err){
          console.log(err.message);
        }
      }
      incomedata();
      
     })


router.get("/incomeopen",verifyToken,function(req,res){ 
      jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {res.sendStatus(403);}
        else{
         
            var a={"personname":req.session.ename};
            async function incomedata(){
              try{
              var result = await dbcon.collection("incomedata").find(a).toArray();
              res.render("incomedata",{"data":result});
              }
              catch(err){
                console.log(err.message);
              }
            }
            incomedata();
          }
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



module.exports = router;
