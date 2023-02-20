const express = require('express'); //import express module
const router = express.Router();    //allows us to do route handling in this file as opposed to in the server.js file
const path = require('path');       //used for path.join to get directory name
const User = require('../models/userAccounts');  //import the userAccounts.js file so that we can create a new object and save to database

var session;

//handle request for profile data after user logs in
router.get('/account', async(req, res) => {
    console.log('incoming profile data request from: %s', req.sessionID);
    const userAccount = await User.findOne({sessionID: req.sessionID})
        if(userAccount) {
            const userData = {
                "username": userAccount.username,
                "email": userAccount.email,
                "settlerWins": userAccount.settlerWins,
                "settlerLosses": userAccount.settlerLosses,
                "nativeWins": userAccount.nativeWins,
                "nativeLosses": userAccount.nativeLosses
            }
            res.status(200).json({userData})
            console.log('sent userData for %s\n%s', req.sessionID, userData)
            return;
        }
        else {console.log('user not found');
            res.status(201).send('user not logged in');
    }
});

//sign up route handler
router.post('/sign_up', async (req, res) => {
    console.log("incoming account creation request from: %s", req.sessionID);
    const accountExists = await User.exists({username: req.body.username})
        if(accountExists) {
            console.log('account exists');
            res.status(201).send('username taken');
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
        else {
            console.log('new account created successfully for %s:\n: ', req.sessionID, user);
            res.status(200).send({"sessionID": req.sessionID});
        }
    })

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

    session.sessionID = req.sessionID;

    if(!user) {
        console.log('username or password incorrect');
        res.status(201).send('username or password incorrect');
    }

    else {
       console.log('user logged in: \n %s', user);
       res.status(200).send({"sessionID" : req.sessionID})
    }
})

//logout route handler, destroys session
router.post('/logout', async(req, res) => {
    if(req.session) {
        req.session.destroy( ()=> {
            console.log('logout successful')
            res.status(200).send('ok');
        })
    }
})


//account deletion route handler
router.post('/delete_acct', async(req, res) => {
    console.log('incoming delete profile request from: %s', req.sessionID);
    const user = await User.findOneAndDelete({"sessionID": req.sessionID});
    if(!user) {
    console.log('user does not exist');
    res.send('no');
    }
    else {
        console.log('successfully deleted user:%s\n %s',req.sessionID, user);
        res.status(200).end();
    }
    });


//edit accout route handler
router.post('/edit_account', async(req, res) => {
    const opts = {new:true};

    if(req.body.hasOwnProperty('username')) {
        const accountExists = await User.exists({username: req.body.username});
            if(accountExists) {
                res.status(201).send('username taken');
            }
            else {
                const user = await User.findOneAndUpdate({"sessionID" : req.sessionID},
                    {
                    $set: {
                        username: req.body.username,
                        }
                    },
                    opts
                );
                console.log("updated user account: %s", user);
                res.status(200).send(user);
            }
    }

    else if(req.body.hasOwnProperty('email')) {
        const user = await User.findOneAndUpdate({"sessionID" : req.sessionID},
            {
            $set: {
                email: req.body.email,
                }
            },
            opts
        );
        console.log("updated user account: %s", user);
        res.status(200).send(user);
    }

    else if(req.body.password === req.body.passwordCheck) {
        const user = await User.findOneAndUpdate({"sessionID" : req.sessionID},
        {
            $set: {
                password: req.body.password
                }
        },
        opts
        );
        console.log("updated user account: %s", user);
        res.status(200).send(user);
    }
})

//catchall handler to send index.html when requests are made
router.get("/*", (req, res) => {
   res.sendFile(path.join(__dirname, '..' ,"client", "build",     
    "index.html"));
 });

//export the router so that these route handlers can be used, it is imported in the server.js file
module.exports = router;
