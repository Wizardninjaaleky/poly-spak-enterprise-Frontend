import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash: hashed,
      role: role === 'admin' ? 'admin' : 'customer'
    });

    res.status(201).json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role }});
  } catch (err) {
    console.error('REGISTER ERROR:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Provide email and password' });

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role }});
  } catch (err) {
    console.error('LOGIN ERROR:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    res.json({ success: true, user: req.user });
  } catch (err) {
    console.error('GETME ERROR:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Temporary admin creation (remove after first use)
export const createAdmin = async (req, res) => {
  try {
    const { email = 'admin@polyspack.com', password = 'Admin123!' } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Admin exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name: 'Super Admin', email, role: 'admin', passwordHash: hashed });
    res.json({ success: true, message: 'Admin created', user: { email: user.email }});
  } catch (err) {
    console.error('CREATE ADMIN ERROR:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
