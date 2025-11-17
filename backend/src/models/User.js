import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'user'], default: 'admin' }, // default admin for convenience; change in prod
  passwordHash: { type: String, required: true, select: false }
}, { timestamps: true });

// instance method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  // Already hashed before saving in controllers; keep this for safety
  next();
});

export default mongoose.model('User', userSchema);
