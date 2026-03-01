const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a report title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: [true, 'File name is required']
  },
  fileSize: {
    type: Number,
    required: true
  },
  datasetInfo: {
    rowCount: {
      type: Number,
      required: true
    },
    columnCount: {
      type: Number,
      required: true
    },
    columns: [{
      name: String,
      type: String,
      nullCount: Number,
      uniqueCount: Number
    }]
  },
  analysisResults: {
    summary: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    correlations: {
      type: mongoose.Schema.Types.Mixed
    },
    trends: {
      type: mongoose.Schema.Types.Mixed
    },
    outliers: {
      type: mongoose.Schema.Types.Mixed
    },
    categories: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  insights: [{
    type: {
      type: String,
      enum: ['trend', 'correlation', 'outlier', 'category', 'summary'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    importance: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ tags: 1 });
reportSchema.index({ status: 1 });

// Virtual for report age
reportSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update updatedAt
reportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Report', reportSchema);