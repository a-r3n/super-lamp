// models/Subscriber.js
const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true  // Ensure emails are unique in the collection
    }
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscriber;
