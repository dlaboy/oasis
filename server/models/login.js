const mongoose = require("mongoose");

const LoginSchema = new mongoose.Schema({
    eid : {type: mongoose.Schema.Types.ObjectId, ref:"Employee"},
    username: String,
    password: String,
})

const Login = mongoose.model('Login', LoginSchema);

module.exports = Login;