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



//present month saving table


router.get("/savings",verifyToken,function(req,res){
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {res.sendStatus(403);}
    else{
  var x=[];
  var y=[]; 
  var dateObj=new Date();
  var mt=parseInt(dateObj.getUTCMonth())+1;
  var pyear = parseInt(dateObj.getUTCFullYear());
  var day1=dateObj.toLocaleDateString('en-US');
  var z=day1.split("/");
  var day2=parseInt(z[1]);
  for(let i=0;i<day2;i++){
    x.push(0);
    y.push(0);
  }
  var j=0;
  var k=0;
  var ind=parseInt(dateObj.getUTCMonth());
  
  
          dbcon.collection( 'expensedata' ).aggregate([
            { $match:
              {
                $and: [
                  {personname: req.session.ename},
                  {Month: mt},
                  {Year: pyear}
                  ]
              } },
            { $group: { _id: "$Day", count: { $sum: "$expenseamount"} } },
            {$sort: {_id: 1}}
          ]).toArray(function(err3,result3){
            dbcon.collection( 'incomedata' ).aggregate([
              { $match: { $and: [
                {personname: req.session.ename},
                {Month: mt},
                {Year: pyear}
                ]
            } },
              { $group: { _id: "$Day", count: { $sum: "$incomeamount"} } },
              {$sort: {_id: 1}}
            ]).toArray(function(err4,result4){

              for(let m=0;m<day2;m++)
              {if(j!=result3.length && result3[j]._id==m+1){
              x[m]=result3[j].count;
              j=j+1;
                }
              }
              for(let m=0;m<day2;m++)
              {
                if(k!=result4.length && result4[k]._id==m+1){
              y[m]=result4[k].count;
              k=k+1;
                }
              }

        
                res.render("savings",{"find1":x,"find2":y,"find":req.session.ename,"m1":ind});
              
              
            })
            
     })   
    }
  })
})


router.get("/viewsaving",verifyToken,function(req,res){
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {res.sendStatus(403);}
    else{
  res.redirect("/saving/savings");}
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
