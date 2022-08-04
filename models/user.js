const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({
    name: {type: String},
    email: {type: String, required: true},
    password: {type: String, required: true},
    mobile1: {type: String,required: true},
    mobile2: {type: String},
    pincode: {type: String},
    address: {type: String},
    cart: {
        items: [{
            productId: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
            quantity: {type: Number, required: true},
        },],
        expires: {type: Date, default: Date.now() + 60 * 60},
    },
},{ timestamps: true });

customerSchema.methods.addToCart = function(product,quantity) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = quantity;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + quantity;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity,
        });
    }
    const updatedCart = {
        items: updatedCartItems,
    };
    this.cart = updatedCart;
    return this.save();
};

customerSchema.methods.removeFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter((item) => {
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
};

customerSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
};

module.exports = mongoose.model('Customer', customerSchema);
