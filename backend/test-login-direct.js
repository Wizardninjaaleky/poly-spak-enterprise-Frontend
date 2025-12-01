import { login } from './src/controllers/newAuthController.js';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to database first
await connectDB(process.env.MONGO_URI);
console.log('✅ Connected to MongoDB\n');

// Mock request and response objects
const req = {
  body: {
    email: 'janekamunge4@gmail.com',
    password: 'Jane2024!Admin'
  }
};

const res = {
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    console.log('\n=== Response ===');
    console.log('Status Code:', this.statusCode);
    console.log('Response Data:', JSON.stringify(data, null, 2));
    process.exit(this.statusCode === 200 ? 0 : 1);
  }
};

console.log('Testing login with:');
console.log('Email:', req.body.email);
console.log('Password:', req.body.password);
console.log();

await login(req, res);
