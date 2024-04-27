var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var Login = require('../models/login.js')
var db = require("../db.js");


// /* GET users listing. */
router.get('/', async function (req, res, next) {
    if (req.body.first_name){
        var logins = await Login.find({first_name: req.body.name})
    }
    else{
        var logins = await Login.find({})
    }
    
    res.send(logins);
});

router.post('/', async function (req, res) {
    const eid = req.body.eid
    const username = req.body.first_name;
    const password = req.body.last_name;

    let newLogin = new Login({eid: eid, username:username, password: password})

    
    /**
     * This function below allows us to verify that both
     * the username and password for the user are correct. 
     * If they are, we indicate a successful login.
     */
    // var verifyUser = await loginVerify(username, password)

    // console.log(verifyUser)
    await newLogin.save();
    res.send("Login Added").status(200)

})

router.delete('/', async function (req, res){
    if(req.body.id != undefined){
        try{
            console.log(typeof(req.body.id))
            await Login.findByIdAndDelete(req.body.id);
            res.status(200).json({ success: true, msg: 'Login Deleted' });
        }
        catch(error){
            console.log('Error:', error)
        }
    }
    else{
        await Login.deleteMany({})

    }

})

router.put('/', async function (req, res){
    try{
        console.log(req.body.id)
        const updatedLogin = await Order.findByIdAndUpdate(req.body.id, req.body.data, { new: true })

        if (!updatedLogin) {
            return res.status(404).json({ message: 'Field not found' });
          }
    } catch (error) {
        console.error('Error updating field:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
})

module.exports = router;
