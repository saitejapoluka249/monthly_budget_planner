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
/* GET home page. */


mongoose.connect('mongodb://localhost:27017/profilepic', {useNewUrlParser: true , useUnifiedTopology: true});


//middleware 


var imageSchema = new mongoose.Schema({ 
  name :String,
  myImages:String
});
userModel=mongoose.model('Image', imageSchema);

var upload = multer({storage:multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'AdminLTE-3.2.0')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
})

//image upload form
router.get("/imageopen",verifyToken,function(req,res){
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {res.sendStatus(403);}
    else{
  res.render("imageshow");}
  })
})


//image uploading in server
router.post("/uploadphoto",upload.single('myImage'),(req,res)=>{
  var x=new userModel();
  x.myImages=req.file.filename;
  x.name=req.session.ename;
  userModel.findOneAndUpdate(
    {
      name:req.session.ename
    },
    {
myImages: req.file.filename
    },
    {
      new:true,
      runValidators:true
    }
  ).then(doc=>{
    if(doc){
      res.redirect("/user");
    }
    else{
      x.save((err1,doc1)=>{
        if(!err1){
          res.redirect("/user");
        }
        else{
          console.log(err1);
        }
      })

    }
  })

   })  


//profile view 

router.get("/view",verifyToken,function(req,res){
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {res.sendStatus(403);}
    else{
  
  userModel.findOne({"name":req.session.ename}).then(function(doc){
 dbcon.collection("profile").findOne({"personname":req.session.ename},function(err,result){

if(!result && !doc){
var s={"uname":"","unumber":"","ugender":"","umail":"","_id":""};
var t={"myImages":"/images/plain.jpg"};
res.render("profileview",{"show":s,"show1":t});
}
else if(result && doc){
  res.render("profileview",{"show":result,"show1":doc});
  }
  else if(result){
    var t={"myImages":"/images/plain.jpg"};
    res.render("profileview",{"show":result,"show1":t});
  }
  else{
    var s={"uname":"","unumber":"","ugender":"","umail":"","_id":""};
    res.render("profileview",{"show":s,"show1":doc});
  }

 })

  })}
})

  })


//profile data form

router.post("/profile",function(req,res){
  var s={"uname":req.body.uname,"umail":req.body.umail,"ugender":req.body.ugender,"unumber":req.body.unumber,"personname":req.session.ename};
  validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  if(req.body.pkey=="" && validRegex.test(req.body.umail) && re.test(req.body.unumber)){
    dbcon.collection("profile").insertOne(s,function(err,result){
      req.session.useremail=req.body.umail;
      alert("Profile data added succesfully");
      res.redirect("/home");
    })
  }
  else if(req.body.pkey!="" && validRegex.test(req.body.umail) && re.test(req.body.unumber)){
     dbcon.collection("profile").updateOne({"_id":ObjectId(req.body.pkey)},{$set:s},function(err,result1){
       req.session.useremail=req.body.umail;
       alert("Profile updated succesfully");
       res.redirect("/home");
     })
  }
  else
  {
    alert("check properly");
    res.redirect("/home");
  }
})


router.get("/user",verifyToken,function(req,res){
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {res.sendStatus(403);}
    else{
    res.redirect("/home");
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


//home page

router.get("/home",verifyToken,function(req,res){
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
      
      userModel.findOne({"name":req.session.ename}).then(function(doc){
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

                  if(doc){
        
                  res.render("home",{"find1":x,"find2":y,"find":req.session.ename,"item":doc,"gtype":""});
                  }
                  else{
                    var doc1={"myImages":"/images/plain.jpg"};
                    res.render("home",{"find1":x,"find2":y,"find":req.session.ename,"item":doc1,"gtype":""});
                  }
                  
                })
                
         })   })
        }
      })
})



router.post("/viewasline",function(req,res){
  res.redirect("/home");
})



router.post("/viewasbar",function(req,res){

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
      
      userModel.findOne({"name":req.session.ename}).then(function(doc){
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

                  if(doc){
        
                  res.render("home",{"find1":x,"find2":y,"find":req.session.ename,"item":doc,"gtype":"Bar"});
                  }
                  else{
                    var doc1={"myImages":"/images/plain.jpg"};
                    res.render("home",{"find1":x,"find2":y,"find":req.session.ename,"item":doc1,"gtype":"Bar"});
                  }
                  
                })
                
         })   })

})



router.post("/viewaspie",function(req,res){

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
      
      userModel.findOne({"name":req.session.ename}).then(function(doc){
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

                  if(doc){
        
                  res.render("home",{"find1":x,"find2":y,"find":req.session.ename,"item":doc,"gtype":"Pie"});
                  }
                  else{
                    var doc1={"myImages":"/images/plain.jpg"};
                    res.render("home",{"find1":x,"find2":y,"find":req.session.ename,"item":doc1,"gtype":"Pie"});
                  }
                  
                })
                
         })   })

})



router.post("/viewasdough",function(req,res){

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
      
      userModel.findOne({"name":req.session.ename}).then(function(doc){
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

                  if(doc){
        
                  res.render("home",{"find1":x,"find2":y,"find":req.session.ename,"item":doc,"gtype":"Dough"});
                  }
                  else{
                    var doc1={"myImages":"/images/plain.jpg"};
                    res.render("home",{"find1":x,"find2":y,"find":req.session.ename,"item":doc1,"gtype":"Dough"});
                  }
                  
                })
                
         })   })

})


router.get("/viewprofile",verifyToken,function(req,res){
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {res.sendStatus(403);}
 else{ res.redirect("/view");}
  })
})
      



module.exports = router;
