import Product from '../models/Product.js';

export const createProduct = async (req, res) => {
  try {
    const data = req.body;
    data.createdBy = req.user?.id;
    const p = await Product.create(data);
    res.status(201).json(p);
  } catch (err) {
    console.error('CREATE PRODUCT ERR:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('GET PRODUCTS ERR:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProduct = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) {
    console.error('GET PRODUCT ERR:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) {
    console.error('UPDATE PRODUCT ERR:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('DELETE PRODUCT ERR:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const summary = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const aggregation = await Product.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);
    const products = aggregation.map(a => ({ date: a._id, count: a.count }));
    res.json({ totalProducts, products });
  } catch (err) {
    console.error('SUMMARY ERR:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
