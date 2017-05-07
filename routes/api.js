const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Register
// newUser non può essere sostituito  da let newUser = req.body
// cripta ta password e se non c'è errore restituisce il Json con success true o false
router.post('/register', (req, res, next) => {
  let newUser = new User({
   name: req.body.name,
    email: req.body.email,
   username: req.body.username,
  password: req.body.password
   });
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(function(err, resource) {
        if (err) {
            res.json({success: false, msg:'Failed to register user'});
        } else {
            res.json({success: true, msg:'User registered'});
              }
              console.log(resource); // resource restituisce quanto trasmesso
    });
    });
  });

});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

 const query = {username: username}
User.findOne(query, function(err, user) {
        if(err) throw err;
        if(!user){
      return res.json({success: false, msg: 'User not found'});
        }
  
  bcrypt.compare(password, user.password, (err, isMatch) => {
      
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
  console.log('questo e risultato '+req.user);
});

/*
// user
router.get('/user/:id', function (req, res, next) {
  const id = req.params.id;
  UserModel.findOne({_id:id},function(err,result){
                  if(err){
            res.send(err);
          }
          else{
        res.json(result);
      }
             })
     });
*/
// get users
router.get('/get', function(req, res, next) {
    User.find({}, function(err,  result) {
        if (err) {
            res.json({ resStatus: 'error' , msg:'Error ! Data Not updated'})
        } else {
            res.json( result);
        }
    });
});

// Update 

router.put('/update', function(req, res, next){
  var id = req.body._id;

  User.findOneAndUpdate({_id:id} ,{$set:req.body , }, {new: true},function(err , result){
        if(err){
            //res.send(err);
            res.json({ resStatus: 'error' , msg:'Error ! Data Not updated'})
        }else {
        res.json(result);
        }
    });
   
});

router.delete('/delete/:id', function(request, response) {
    var id = request.params.id;
    User.remove({ _id: id }, function(err, resource) {
        if (err) {
            return response.send(err);
        } else {
            response.send(resource);
        }
    })
});


module.exports = router;
