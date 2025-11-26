const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('../src/models/Category');

async function run() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/polyspack-ecommerce';
  await mongoose.connect(mongoUri);
  const cat = await Category.findOne();
  if (!cat) {
    console.log('No category found');
  } else {
    console.log('Category id:', cat._id.toString());
    console.log('Name:', cat.name);
  }
  await mongoose.connection.close();
}

run().catch(e=>{console.error(e);process.exit(1)});
