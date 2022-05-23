const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  
  url:{type: String},
  name:{type: String},
  price:{type: Number},
  type:{type: String},
  quantity: {type: Number}  
  
},{ timestamps: true });

module.exports = mongoose.model('Product', productSchema);

