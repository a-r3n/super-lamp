const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
  isSubscribed: { type: Boolean, default: false },
  stripeCustomerId: { type: String, required: false }
});

module.exports = mongoose.model('User', userSchema);
