import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: { type: String, required: false },
  firstName: { type: String, required: false, trim: true },
  lastName: { type: String, required: false, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  role: { type: String, enum: ['admin', 'customer', 'sales'], default: 'customer' },
  passwordHash: { type: String, required: true, select: false },
  phone: { type: String, required: false },
  profilePhoto: { type: String, default: null }, // Profile photo URL
  company: { type: String, trim: true },
  accountType: { type: String, enum: ['individual', 'business', 'personal'], default: 'individual' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  agreeToMarketing: { type: Boolean, default: false },
  resetPasswordCode: { type: String },
  resetPasswordExpiry: { type: Date },
  lastLogin: { type: Date },
  addresses: [
    {
      street: { type: String },
      city: { type: String },
      county: { type: String },
      country: { type: String, default: 'Kenya' },
      zipCode: { type: String },
    },
  ],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

// Virtual for password
userSchema.virtual('password').set(function(password) {
  this._password = password;
  this.passwordHash = password; // Trigger the pre-save hook
});

// Encrypt password using bcrypt before saving (if modified)
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  // and we have a plain-text password to work with.
  if (!this.isModified('passwordHash') || !this._password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  this._password = undefined; // Do not store the plain password
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d', // Use JWT_EXPIRE from env or default
  });
};

export default mongoose.model('User', userSchema);
