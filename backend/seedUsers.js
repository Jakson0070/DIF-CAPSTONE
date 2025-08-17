// backend/seedUsers.js
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const users = [
  {
    username: 'johndoe',
    displayName: 'John Doe',
    email: 'john@example.com',
    password: '$2b$10$HGSK4WOqsdoSlE3C3A4sKuKFpG0G.CLBPjpw5IcdFXRqllu.Kj6zW', // hashed 'password123'
    bio: '✨ Content Creator\n📍 San Francisco, CA',
    website: 'johndoe.com',
    isVerified: true,
    isPrivate: false,
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe',
  },
  {
    username: 'janedoe',
    displayName: 'Jane Doe',
    email: 'jane@example.com',
    password: '$2b$10$HGSK4WOqsdoSlE3C3A4sKuKFpG0G.CLBPjpw5IcdFXRqllu.Kj6zW',
    bio: 'Designer, Traveler, Dreamer',
    website: 'janedoe.com',
    isVerified: false,
    isPrivate: true,
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=janedoe',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany({});
  await User.insertMany(users);
  console.log('Seeded users!');
  mongoose.disconnect();
}

seed();
