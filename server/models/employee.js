const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    position: String
})

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;