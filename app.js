var alert = require("alert");
var createError = require('http-errors');
var express = require('express');
var session = require('express-session')
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var logger = require('morgan');
var { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
var MongoClient = require('mongodb').MongoClient;
var ObjectId=require('mongodb').ObjectId;
var url = "mongodb://localhost:27017/monthlydb"; 
const multer = require("multer");
var nodemailer=require('nodemailer');
const mongoose = require("mongoose");

var indexRouter = require('./routes/index');
var todoRouter = require('./routes/tododata');
var incomeRouter = require('./routes/income');
var expenseRouter = require('./routes/expense');
var graphRouter = require('./routes/graph');
var savingRouter = require('./routes/saving');
var monthRouter = require('./routes/monthly');
var timelineRouter = require('./routes/timeline');
const { ConnectionCheckedOutEvent } = require("mongodb");
const { getDefaultSettings } = require("http2");

var AWS = require('aws-sdk');
AWS.config.region = 'us-west-1';
var sns = new AWS.SNS();
AWS.config.update(
{
accessKeyId: "#access_key",
secretAccessKey: "#secret_access_key",
region: '#region',
signatureVersion: '#Signature_Version'
}
);

var app = express();
global.dbcon;





MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  dbcon=db.db("monthlydb");//returns database object such that it can be accesed in specified database
  alertmail();
  adminmail();
  //db.close();
});

app.use(express.static('AdminLTE-3.2.0')); 
app.set('trust proxy', 1) // trust all proxy servers
app.use(session({
  genid: function(req) {
    return uuidv4() // use UUIDs for session IDs
  },
  secret: 'keyboard cat', //secret key used for encrypting cookie by keyboard cat method or a random unique string key used to authenticate a session
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3000000 } //this sets the cookie expiry time. cookie will be deleted in browser after 3....milliseconds
}))



//middleware 


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/todo', todoRouter);
app.use('/income', incomeRouter);
app.use('/expense', expenseRouter);
app.use('/graph', graphRouter);
app.use('/saving', savingRouter);
app.use('/month', monthRouter);
app.use('/timeline', timelineRouter);

app.get("/login",function(req,res){
  
  res.render("loginform1");

})

function alertmail(){
  var dateObj=new Date();
  var pyear=dateObj.getUTCFullYear();
  var xa=dateObj.getUTCMonth()+1;
  var days=new Date(pyear,xa, 0).getDate();
  var days1=dateObj.getUTCDate();
  if(days==days1-1){
 dbcon.collection("profile").find({}).toArray(function(err,result){
   for(let i=0;i<result.length;i++){
      dbcon.collection( 'expensedata' ).aggregate([
        { $match:
          {
            $and: [
              {personname: result[i].personname},
              {Month: xa},
              {Year: pyear}
              ]
          } },
        { $group: { _id: "$Day", count: { $sum: "$expenseamount"} } },
        {$sort: {_id: 1}}
      ]).toArray(function(err3,result3){
        dbcon.collection( 'incomedata' ).aggregate([
          { $match: { $and: [
            {personname: result[i].personname},
            {Month: xa},
            {Year: pyear}
            ]
        } },
          { $group: { _id: "$Day", count: { $sum: "$incomeamount"} } },
          {$sort: {_id: 1}}
        ]).toArray(function(err4,result4){

          var sum1=0;
          var sum2=0;
          for(let l=0;l<result3.length;l++){
             sum1=sum1+result3[l].count;
          }
          for(let l=0;l<result4.length;l++){
            sum2=sum2+result4[l].count;
         }
            if(sum1>sum2){
              //console.log(result[i].umail);
              function verifymail(a,b,c,d) {
                var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                user: 's2809483@gmail.com',
                pass: 'rnefrkvgaquopynr'
                }
                });
                var mailOptions = {
                from: '#source_email',
                to: a,
                subject: 'Alert : Monthly Budget Planner',
                text: "Hi "+d+"\n"+"Your Expenses are more than your income "+"\n"+" Your Monthly Budget Details"+"\n"+"Expenses : "+b+"\n"+"Income: "+c
                };
                transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }
                })
                
                }
                verifymail(result[i].umail,sum1,sum2,result[i].personname);
            }
        })       })
      }
    })
    
  }
}


function adminmail(){
  var dateObj=new Date();
  var pyear=dateObj.getUTCFullYear();
  var xa=dateObj.getUTCMonth()+1;
  var days=new Date(pyear,xa, 0).getDate();
  var days1=dateObj.getUTCDate();
  if(days==days1-1){
 dbcon.collection("profile").find({}).toArray(function(err,result){
   for(let i=0;i<result.length;i++){
      dbcon.collection( 'expensedata' ).aggregate([
        { $match:
          {
            $and: [
              {personname: result[i].personname},
              {Month: xa},
              {Year: pyear}
              ]
          } },
        { $group: { _id: "$Day", count: { $sum: "$expenseamount"} } },
        {$sort: {_id: 1}}
      ]).toArray(function(err3,result3){
        dbcon.collection( 'incomedata' ).aggregate([
          { $match: { $and: [
            {personname: result[i].personname},
            {Month: xa},
            {Year: pyear}
            ]
        } },
          { $group: { _id: "$Day", count: { $sum: "$incomeamount"} } },
          {$sort: {_id: 1}}
        ]).toArray(function(err4,result4){

          var sum1=0;
          var sum2=0;
          for(let l=0;l<result3.length;l++){
             sum1=sum1+result3[l].count;
          }
          for(let l=0;l<result4.length;l++){
            sum2=sum2+result4[l].count;
         }
            
              //console.log(result[i].umail);
              function verifymail(a,b,c,d) {
                var params = {
                  Destination: { /* required */
                    CcAddresses: [
                      '#add_your_email',
                      /* more items */
                    ],
                    ToAddresses: [
                      '#add_your_email',
                      /* more items */
                    ]
                  },
                  Message: { /* required */
                    Body: { /* required */
                   
                      Text: {
                       Charset: "UTF-8",
                       Data: d+"\n"+a+"\n"+"Expenses : "+b+"\n"+"Income: "+c
                      }
                     },
                     Subject: {
                      Charset: 'UTF-8',
                      Data: 'User Budget Details'
                     }
                    },
                  Source: '#add_your_email', /* required */
                  ReplyToAddresses: [
                     '#add_your_email',
                    /* more items */
                  ],
                };
                
                // Create the promise and SES service object
                var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
                
                // Handle promise's fulfilled/rejected states
                sendPromise.then(
                  function(data) {
                    console.log(data.MessageId);
                  }).catch(
                    function(err) {
                    console.error(err, err.stack);
                  });
                
                }
                verifymail(result[i].umail,sum1,sum2,result[i].personname);
            
        })       })
      }
    })
    
  }
}

//user validation

app.post('/validate',function(req,res)  {
  if(req.body.uname && req.body.pword){
    var check={"username":req.body.uname};
    var hash;
    const hashtable=new Promise((resolve,reject)=>{ 
      dbcon.collection("users").findOne(check,function(err, result) {
        if(err){
          reject(err);
        } 
        else if(!result){
               alert("check properly");
               res.render("loginform1");
               
        }
        else{hash=result.repeat;
        resolve(result);
      }
    })
    })
    hashtable.then((hashdetails)=>{
      const empTable=new Promise((resolve,reject)=>{ 
        bcrypt.compare(req.body.pword, hash, function(err1, result1) {
          if(err1){
            reject(err1);
          }
        else{
          resolve(result1);
        }
      })
      })
    empTable.then((deptDetails)=>{
      if(deptDetails==true){
        req.session.auth=true; 
        req.session.ename=req.body.uname;
        var user={"user":req.session.ename};
        jwt.sign({user}, 'secretkey', { expiresIn: '86400s' }, (err, token) => {
        req.session.tk=token;
        res.redirect("/home");
        });

      }
      else{
        alert("check Properly");
        res.render("loginform1");


      }
    })
     }); }
     else{
       alert("check properly");
       res.render("loginform1");
  
     }
  
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


//ajax

app.post("/showusername",function(req,res){
  console.log(req.body);
  let x=Object.keys(req.body)[0];
  var n={"username":x};
  dbcon.collection("users").findOne(n,function(err,result){
     if(!result){
       res.send("Check Properly");
     }
     else{
       res.send("correct");
     }
  })

})

//ajax

app.post("/showpassword",function(req,res){
  
  let x=Object.keys(req.body)[0];
  var y=x.split(",");
  var z={"username":y[0]};
  dbcon.collection("users").findOne(z,function(err,result){
    if(result){
    bcrypt.compare(y[1],result.userpassword,function(err,result1){
        if(result1==true){
          res.send("correct");
        }
        else{
          res.send("Check Properly");
        }
    })}
    else{
      res.send("Check Properly");
    }
  })

})

//sign up


   app.post('/saving',function(req,res){
    var q={"username":req.body.usern};
    var sobj;
    const empTable=new Promise((resolve,reject)=>{ 
      dbcon.collection("users").findOne(q,function(err, result){
        if(err){
          reject(err);
        }
      else{
        resolve(result);
      }
    })
    })
    empTable.then((deptDetails)=>{
      decimal=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
      if(deptDetails==null && req.body.favcolor && req.body.userp==req.body.cuserp && req.body.usern && req.body.userp && req.body.cuserp && decimal.test(req.body.userp) && decimal.test(req.body.cuserp)) 
      { const checkhash=new Promise((resolve,reject)=>{ 
        bcrypt.hash(req.body.userp, 10, function(err, hash) {
          if(err){
            reject(err);
          }
        else{  sobj={"username":req.body.usern,"userpassword":hash,"repeat":hash,"color":req.body.favcolor};
          resolve(hash);
        }
      })
      })
      checkhash.then((hashDetails)=>{
        const checkTable=new Promise((resolve,reject)=>{ 
          dbcon.collection("users").insertOne(sobj, function(err, res1){
            if(err){
              reject(err);
            }
          else{
            resolve(res1);
          }
        })
        })
        checkTable.then((checkDetails)=>{
              alert("Account created successfully");
              res.render("loginform1");
        }) 
      })
  
  
      }
      else{
        alert("check properly");
        res.render("loginform1");
      }
    })  
          })


app.get("/forgot",function(req,res){
  res.render("forgotpasswordform");
})

//forgot password form

app.post("/passwordvalidate",function(req,res){
  var q={"username":req.body.uname,"color":req.body.favcolor};
  dbcon.collection("users").findOne(q,function(err,result){
    if(!result){
      alert("please enter coorectly");
      res.render("forgotpasswordform");
    }
    else{
    res.render("forgotpasswordeditform",{"p":result});}
  })
  
}) 

//forgot password edit form

app.post("/passwordedit",function(req,res){
  var q={"username":req.body.uname,"color":req.body.favcolor}; 
  var sobj;
  decimal=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if(req.body.favcolor && req.body.userp==req.body.cuserp && req.body.usern && req.body.userp && req.body.cuserp && decimal.test(req.body.userp) && decimal.test(req.body.cuserp)) 
  {bcrypt.hash(req.body.userp, 10, function(err, hash) {
         sobj={"username":req.body.usern,"color":req.body.favcolor,"userpassword":hash,"repeat":hash}; 
         dbcon.collection("users").updateOne({"_id":ObjectId(req.body.pakey)},{$set:sobj}, function(err2, res3){
             alert("Password updated Succesfully");
             res.render("loginform1");
         })
  })
  
}
else{
  alert("Enter Password properly");
  res.render("loginform1");
}
}) 

app.get("/logout",function(req,res){
  req.session.destroy(function(){
    res.render("loginform1");
  })
})

app.get("/aggcheck",function(req,res){
  dbcon.collection("incomedata").aggregate([
{$match:{$and:[{personname:"Saiteja"},{Year:2022}]}},
    {$group:{_id:"$incometype",amount:{$sum:"$incomeamount"}}}
  ]
  ).toArray(function(err,result){
    console.log(result);
  })
})

app.post("/addition",function(req,res){
  var a=parseInt(req.body.val1)+parseInt(req.body.val2);

  res.send(a);
})

app.get("/add",function(req,res){
  res.render("a");
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
