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



router.post("/viewgraph",function(req,res){
  var x=[];
  var y=[]; 
  var dateObj=new Date();
  var mt=parseInt(dateObj.getUTCMonth())+1;
  var pyear = parseInt(req.body.uyear);
  var day1=dateObj.toLocaleDateString('en-US');
  var z=day1.split("/");
  var day2=parseInt(z[1]);
  var j=0;
  var k=0;
  var mon=req.body.umonth;

  var ind=parseInt(mon);
  var days=new Date(pyear,ind+1, 0).getDate();
  for(let i=0;i<days;i++){
    x.push(0);
    y.push(0);
  }
  var xa=ind+1;
    
  dbcon.collection( 'expensedata' ).aggregate([
    { $match:
      {
        $and: [
          {personname: req.session.ename},
          {Month: xa},
          {Year: pyear}
          ]
      } },
    { $group: { _id: "$Day", count: { $sum: "$expenseamount"} } },
    {$sort: {_id: 1}}
  ]).toArray(function(err3,result3){
    dbcon.collection( 'incomedata' ).aggregate([
      { $match: { $and: [
        {personname: req.session.ename},
        {Month: xa},
        {Year: pyear}
        ]
    } },
      { $group: { _id: "$Day", count: { $sum: "$incomeamount"} } },
      {$sort: {_id: 1}}
    ]).toArray(function(err4,result4){

      for(let m=0;m<days;m++)
      {if(j!=result3.length && result3[j]._id==m+1){
      x[m]=result3[j].count;
      j=j+1;
        }
      }
      for(let m=0;m<days;m++)
      {
        if(k!=result4.length && result4[k]._id==m+1){
      y[m]=result4[k].count;
      k=k+1;
        }
      }



        res.render("bargraph",{"find1":x,"find2":y,"find":req.session.ename,"m1":ind,"gtype":"Bar"});
      
      
    })
    
})

})

router.post("/viewlinegraph",function(req,res){
  var x=[];
  var y=[]; 
  var dateObj=new Date();
  var mt=parseInt(dateObj.getUTCMonth())+1;
  var pyear = parseInt(req.body.uyear);
  var day1=dateObj.toLocaleDateString('en-US');
  var z=day1.split("/");
  var day2=parseInt(z[1]);
  var j=0;
  var k=0;
  var mon=req.body.umonth;
  var ind=parseInt(mon);
  var days=new Date(pyear,ind+1, 0).getDate();
  for(let i=0;i<days;i++){
    x.push(0);
    y.push(0);
  }
  var xa=ind+1;
    
  dbcon.collection( 'expensedata' ).aggregate([
    { $match:
      {
        $and: [
          {personname: req.session.ename},
          {Month: xa},
          {Year: pyear}
          ]
      } },
    { $group: { _id: "$Day", count: { $sum: "$expenseamount"} } },
    {$sort: {_id: 1}}
  ]).toArray(function(err3,result3){
    dbcon.collection( 'incomedata' ).aggregate([
      { $match: { $and: [
        {personname: req.session.ename},
        {Month: xa},
        {Year: pyear}
        ]
    } },
      { $group: { _id: "$Day", count: { $sum: "$incomeamount"} } },
      {$sort: {_id: 1}}
    ]).toArray(function(err4,result4){

      for(let m=0;m<days;m++)
      {if(j!=result3.length && result3[j]._id==m+1){
      x[m]=result3[j].count;
      j=j+1;
        }
      }
      for(let m=0;m<days;m++)
      {
        if(k!=result4.length && result4[k]._id==m+1){
      y[m]=result4[k].count;
      k=k+1;
        }
      }



        res.render("bargraph",{"find1":x,"find2":y,"find":req.session.ename,"m1":ind,"gtype":"Line"});
      
      
    })
    
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
