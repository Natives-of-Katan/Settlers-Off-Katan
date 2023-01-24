const express = require('express'); //import express module
const router = express.Router();    //allows us to do route handling in this file as opposed to in the server.js file
const path = require('path');       //used for path.join to get directory name
const User = require('../models/name_schema');  //import the name_schema.js file so that we can create a new object and save to database


//handle post request to /name (form data)
router.post('/name', async (req, res) => {

    //log the name entered
    console.log(req.body);  

    //create the user object according to the schema defined in name_schema.js, and save it to database
    var user = new User( {
        name: req.body.name
    })

    user.save(err => {
        if(err)
            console.error(err);
        else
            console.log('name added!');
    })
    res.send('ok');


})

//handle GET request for names
router.get('/getNames', async(req, res) => {
    const users = await User.find();
    console.log(users);
    res.send(users);
})

router.get("*", (req, res) => {
   /* res.sendFile(path.resolve(__dirname, "tech-demo-client", "build",     
    "index.html"));*/
    res.send("we are online!");
 });

//export the router so tha these route handlers can be used, it is imported in the server.js file
module.exports = router;
