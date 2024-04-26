var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
var Employee = require('../models/employee.js')
var db = require("../db.js");


// /* GET users listing. */
router.get('/', async function (req, res, next) {
    if (req.body.first_name){
        var employees = await Employee.find({first_name: req.body.name})
    }
    else{
        var employees = await Employee.find({})
    }
    
    res.send(employees);
});

router.post('/', async function (req, res) {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const position = req.body.position;

    


    let newEmployee = new Employee({first_name: first_name, last_name:last_name, position: position})

    
    /**
     * This function below allows us to verify that both
     * the username and password for the user are correct. 
     * If they are, we indicate a successful login.
     */
    // var verifyUser = await loginVerify(username, password)

    // console.log(verifyUser)
    await newEmployee.save();
    res.send("Employee Added").status(200)

})

router.delete('/', async function (req, res){
    if(req.body.id != undefined){
        try{
            console.log(typeof(req.body.id))
            await Employee.findByIdAndDelete(req.body.id);
            res.status(200).json({ success: true, msg: 'Employee Deleted' });
        }
        catch(error){
            console.log('Error:', error)
        }
    }
    else{
        await Order.deleteMany({})

    }

})

router.put('/', async function (req, res){
    try{
        console.log(req.body.id)
        const updatedEmployee = await Order.findByIdAndUpdate(req.body.id, req.body.data, { new: true })

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Field not found' });
          }
    } catch (error) {
        console.error('Error updating field:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
})

module.exports = router;
