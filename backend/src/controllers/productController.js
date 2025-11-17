import Product from '../models/Product.js';

export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, quantity, available, imageUrl } = req.body;
    const product = await Product.create({
      name, description, category, price, quantity, available, imageUrl, createdBy: req.user?.id
    });
    res.status(201).json(product);
  } catch (err) {
    console.error('CREATE PRODUCT ERROR:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('GET PRODUCTS ERROR:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProduct = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) {
    console.error('GET PRODUCT ERROR:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    console.error('UPDATE PRODUCT ERROR:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('DELETE PRODUCT ERROR:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// summary for dashboard
export const summary = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const aggregation = await Product.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);
    const products = aggregation.map(a => ({ date: a._id, count: a.count }));
    res.json({ totalProducts, products });
  } catch (err) {
    console.error('SUMMARY ERROR:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
