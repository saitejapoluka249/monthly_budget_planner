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



router.get("/viewexpenses",verifyToken,function(req,res){
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {res.sendStatus(403);}
    else{

      res.redirect("/expense/expenseopen");
    }
  })
  

})





router.post("/addexpenses",function(req,res){
  if(req.session.auth){
  res.render("addexpensesform");}
  else{
    res.send("user not found");
  }
})





router.post("/saveexpenses",function(req,res){
    var x=req.body.expdate;
    var dt=x.split("-");
    var dtyear=parseInt(dt[0]);
    var dtmonth=parseInt(dt[1]);
    var dtday=parseInt(dt[2]);
    const d = new Date();
    let pyear = parseInt(d.getUTCFullYear());
    var sobj={"personname":req.session.ename,"expensestype":req.body.exptype,"expenseamount":parseInt(req.body.expamount),"Date":req.body.expdate,"Year":dtyear,"Month":dtmonth,"Day":dtday}; 
    var obj={"Date":req.body.expdate};
    if(dtyear<=pyear){
      dbcon.collection("expensedata").insertOne(sobj,function(err,res1){
        alert("Succesfully added");
        res.redirect("/expense/expenseopen");
      })
    }
    else{
      res.send("Only present Year is allowed");
    }
})


router.post("/edit",function(req,res){
  var pkey=req.body.ukey;
  async function expensedata(){
    try{
    var result=await dbcon.collection("expensedata").findOne({"_id":ObjectId(pkey)});
    res.render("editexpensesform",{"data":result}); 
    }
    catch(err){
      console.log(err.message);
    }
  }
  expensedata();
    })



router.post("/delete",function(req,res){
      var pkey=req.body.mkey;
      async function expensedata(){
        try{
        await dbcon.collection("expensedata").deleteOne({"_id":ObjectId(pkey)});
        alert("Deleted Succesfully");
        res.redirect("/expense/expenseopen");    
        }
        catch(err){
          console.log(err.message);
        }
      }
      expensedata();
    })



router.post("/saveeditexpenses",function(req,res){
var pkey=req.body.mkey;
var x=req.body.expdate;
var dt=x.split("-");
var dtyear=parseInt(dt[0]);
var dtmonth=parseInt(dt[1]);
var dtday=parseInt(dt[2]);
const d = new Date();
let pyear = parseInt(d.getUTCFullYear());
var sobj={"personname":req.session.ename,"expensestype":req.body.exptype,"expenseamount":parseInt(req.body.expamount),"Date":req.body.expdate,"Year":dtyear,"Month":dtmonth,"Day":dtday}; 
var obj={"Date":req.body.expdate};
async function expensedata(){
  try{
  await dbcon.collection("expensedata").updateOne({"_id":ObjectId(pkey)},{$set:sobj});
  alert("Updated Succesfully");
  res.redirect("/expense/expenseopen");
  }
  catch(err){
    console.log(err.message);
  }
}
expensedata();

})




router.get("/expenseopen",verifyToken,function(req,res){
    
jwt.verify(req.token, 'secretkey', (err, authData) => {
  if(err) {res.sendStatus(403);}
  else{

    var a={"personname":req.session.ename};
    async function expensedata(){
      try{
      var result=await dbcon.collection("expensedata").find(a).toArray();
      res.render("expensesdata",{"data":result});
      }
      catch(err){
        console.log(err.message);
      }
    }
    expensedata();
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
