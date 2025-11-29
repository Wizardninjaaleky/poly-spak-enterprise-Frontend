import mongoose from 'mongoose';

const customSolutionSchema = new mongoose.Schema({
  // Product Type Selection
  productType: {
    type: String,
    required: true,
    enum: ['jerrican', 'bottle', 'drum', 'container', 'custom'],
  },

  // Specifications
  specifications: {
    capacity: {
      type: Number,
      required: true,
      min: 100,
      max: 20000,
    },
    material: {
      type: String,
      required: true,
      enum: ['HDPE', 'LDPE', 'PET', 'PP'],
    },
    color: {
      type: String,
      required: true,
    },
    features: [{
      type: String,
    }],
  },

  // Volume and Timeline
  volume: {
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    urgency: {
      type: String,
      required: true,
      enum: ['monthly', 'quarterly', 'one-time'],
    },
    timeline: {
      type: String,
      required: true,
    },
  },

  // Contact Information
  contact: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
  },

  // Additional Message
  message: {
    type: String,
    trim: true,
  },

  // Uploaded Files
  files: [{
    filename: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],

  // Status Management
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'quoted', 'accepted', 'rejected', 'completed'],
    default: 'pending',
  },

  // Quote Details (filled by admin)
  estimatedPrice: {
    type: Number,
  },
  estimatedTimeline: {
    type: String,
  },

  // Internal Notes
  notes: [{
    text: String,
    author: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],

  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },

  // CRM Integration
  crmId: {
    type: String,
  },
  crmSyncedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
customSolutionSchema.index({ 'contact.email': 1 });
customSolutionSchema.index({ status: 1, submittedAt: -1 });
customSolutionSchema.index({ productType: 1 });

export default mongoose.model('CustomSolution', customSolutionSchema);
