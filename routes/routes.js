const express = require('express'); //import express module
const router = express.Router();    //allows us to do route handling in this file as opposed to in the server.js file
const path = require('path');       //used for path.join to get directory name
const User = require('../models/userAccounts');  //import the userAccounts.js file so that we can create a new object and save to database

var session;

//sign up route handler
router.post('/sign_up', async (req, res) => {
    const accountExists = await User.exists({username: req.body.username})
        if(accountExists) {
            console.log('account exists');
            res.send('no');
            return;
        }

    //log the name entered
    console.log(req.body);
    
    if(req.body.password!=req.body.passwordCheck) {
        console.log('unsuccessful account creation, passwords do not match');
        res.send('passwords do not match');
        return
    }

    //create the user object according to the schema defined in userAccounts.js, and save it to database
    var user = new User( {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        settlerWins: 0,
        settlerLosses: 0,
        nativeWins: 0,
        nativeLosses: 0,
        sessionID: req.sessionID
    })

    user.save(err => {
        if(err)
            console.error(err);
        else
            console.log('new user added: ', user);
    })
    res.send('ok');
})


//sign-in route handler
router.post('/sign_in', async(req, res) => {
    session = req.session;
    const opts = {new: true};

    const user = await User.findOneAndUpdate(  {
        "username": req.body.username,
        "password": req.body.password
    },
        {
        $set: {
            sessionID: req.sessionID
            }
        },
        opts
    );

    session.userID = user.username;
    session.sessionID = req.sessionID;

    if(!user) {
        console.log('username or password incorrect');
        res.send('incorrect login');
    }

    else {
       console.log('user logged in: \n %s', user);
       res.redirect('/');
    }
})


//logout route handler, destroys session
router.post('/logout', async(req, res) => {
    if(req.session) {
        req.session.destroy( ()=> {
            console.log('logout successful')
            res.redirect('/');
        })
    }
})


//account deletion route handler
router.post('/delete_acct', async(req, res) => {
    var username = req.body.username;
    var pw = req.body.password;

       const user = await User.findOneAndDelete({username: username, password: pw});
       if(!user) {
        console.log('user does not exist');
        res.send('no');
       }
        else {
            console.log('user %s deleted', user);
            res.send('deleted');
        }
    });


//edit accout route handler
router.post('/edit_acct', async(req, res) => {
 

})


//direct to index page
router.get("*", (req, res) => {
    console.log('lol');
   res.sendFile(path.resolve(__dirname, "client", "build",     
    "index.html"));
 });

//export the router so tha these route handlers can be used, it is imported in the server.js file
module.exports = router;
