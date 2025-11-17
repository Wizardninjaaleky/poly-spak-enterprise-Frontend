import Category from '../models/Category.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

export const createCategory = async (req, res) => {
  try {
    const c = await Category.create({ name: req.body.name });
    res.status(201).json(c);
  } catch (err) {
    console.error('CREATE CAT ERR:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const cats = await Category.find().sort({ name: 1 });
    res.json(cats);
  } catch (err) {
    console.error('GET CATS ERR:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('GET USERS ERR:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('GET ORDERS ERR:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['pending','shipped','delivered'];
    if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Not found' });
    res.json(order);
  } catch (err) {
    console.error('UPDATE ORDER ERR:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
