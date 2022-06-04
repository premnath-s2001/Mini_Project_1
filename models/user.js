const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String},
    email: {type: String, required: true},
    password: {type: String, required: true},
    mobile1: {type: String},
    mobile2: {type: String},
    pincode: {type: String},
    address: {type: String}
},{ timestamps: true });

module.exports = mongoose.model('Customer', userSchema);

