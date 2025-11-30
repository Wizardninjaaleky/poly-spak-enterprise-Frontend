import HeroSlide from '../models/HeroSlide.js';

// Get all hero slides (public)
export const getHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find()
      .sort({ order: 1, createdAt: -1 });
    
    res.json({
      success: true,
      slides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hero slides',
      error: error.message
    });
  }
};

// Get active hero slides only (public)
export const getActiveHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find({ isActive: true })
      .sort({ order: 1 });
    
    res.json({
      success: true,
      slides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching active slides',
      error: error.message
    });
  }
};

// Create new hero slide (admin only)
export const createHeroSlide = async (req, res) => {
  try {
    const { title, subtitle, imageUrl, buttonText, buttonLink, order, isActive } = req.body;

    // Validation
    if (!title || !subtitle || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title, subtitle, and image URL are required'
      });
    }

    const newSlide = new HeroSlide({
      title,
      subtitle,
      imageUrl,
      buttonText: buttonText || 'Shop Now',
      buttonLink: buttonLink || '/products',
      order: order || 1,
      isActive: isActive !== undefined ? isActive : true
    });

    await newSlide.save();

    res.status(201).json({
      success: true,
      message: 'Hero slide created successfully',
      slide: newSlide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating hero slide',
      error: error.message
    });
  }
};

// Update hero slide (admin only)
export const updateHeroSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const slide = await HeroSlide.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found'
      });
    }

    res.json({
      success: true,
      message: 'Hero slide updated successfully',
      slide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating hero slide',
      error: error.message
    });
  }
};

// Delete hero slide (admin only)
export const deleteHeroSlide = async (req, res) => {
  try {
    const { id } = req.params;

    const slide = await HeroSlide.findByIdAndDelete(id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: 'Hero slide not found'
      });
    }

    res.json({
      success: true,
      message: 'Hero slide deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting hero slide',
      error: error.message
    });
  }
};
