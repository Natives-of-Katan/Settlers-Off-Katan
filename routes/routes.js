const express = require('express'); //import express module
const router = express.Router();    //allows us to do route handling in this file as opposed to in the server.js file
const path = require('path');       //used for path.join to get directory name
const User = require('../models/userAccounts');  //import the userAccounts.js file so that we can create a new object and save to database


//handle post request to /name (form data)
router.post('/sign_up', async (req, res) => {

    //log the name entered
    ;console.log(req.body);  

    //create the user object according to the schema defined in userAccounts.js, and save it to database
    var user = new User( {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        settlerWins: 0,
        settlerLosses: 0,
        nativeWins: 0,
        nativeLosses: 0,
    })

    user.save(err => {
        if(err)
            console.error(err);
        else
            console.log('new user account for %s added!', req.body.username);
    })
    res.redirect('/');
})

//handle GET request for names
router.get('/getNames', async(req, res) => {
    const users = await User.find();
    console.log(users);
    res.send(users);
})

router.get("*", (req, res) => {
   res.sendFile(path.resolve(__dirname, "client", "build",     
    "index.html"));
    //res.send("we are online!");
 });

//export the router so tha these route handlers can be used, it is imported in the server.js file
module.exports = router;
