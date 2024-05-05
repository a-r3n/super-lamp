const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');  // Adjust the path as necessary

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizdb';

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));

const users = [
    { email: "true@email.com", password: "password", isSubscribed: true },
    { email: "false@email.com", password: "password", isSubscribed: false }
];

const seedUsers = async () => {
    try {
        await User.deleteMany({});  // Clear the users collection
        const hashedUsers = await Promise.all(users.map(async user => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return { ...user, password: hashedPassword };
        }));
        await User.insertMany(hashedUsers);
        console.log('Users seeded successfully!');
    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedUsers();
