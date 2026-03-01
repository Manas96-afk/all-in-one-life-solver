const Joi = require('joi');
const AnalysisService = require('../services/analysisService');
const Report = require('../models/Report');
const logger = require('../utils/logger');

// Validation schemas
const analyzeDatasetSchema = Joi.object({
  dataset: Joi.array().items(Joi.object()).min(1).max(100000).required(),
  options: Joi.object({
    includeCorrelations: Joi.boolean().default(true),
    includeOutliers: Joi.boolean().default(true),
    includeTrends: Joi.boolean().default(true),
    includeCategories: Joi.boolean().default(true),
    maxInsights: Joi.number().integer().min(1).max(100).default(50)
  }).default({})
});

const saveReportSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required(),
  description: Joi.string().trim().max(500).allow(''),
  analysisResults: Joi.object().required(),
  datasetInfo: Joi.object().required(),
  tags: Joi.array().items(Joi.string().trim().max(50)).max(10).default([]),
  isPublic: Joi.boolean().default(false)
});

/**
 * Analyze dataset and return insights
 * @route POST /api/v1/analysis/analyze
 */
exports.analyzeDataset = async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = analyzeDatasetSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      });
    }

    const { dataset, options } = value;

    logger.info(`Starting analysis for dataset with ${dataset.length} rows`);

    // Perform analysis based on options
    const analysisResults = {};

    // Always include summary
    analysisResults.summary = AnalysisService.generateSummary(dataset);

    // Conditional analysis based on options
    if (options.includeCorrelations) {
      analysisResults.correlations = AnalysisService.calculateCorrelationMatrix(dataset);
    }

    if (options.includeOutliers) {
      analysisResults.outliers = AnalysisService.detectOutliers(dataset);
    }

    if (options.includeTrends) {
      analysisResults.trends = AnalysisService.analyzeTrends(dataset);
    }

    if (options.includeCategories) {
      analysisResults.categories = AnalysisService.generateCategoryInsights(dataset);
    }

    // Compile all insights
    const allInsights = [];
    
    if (analysisResults.correlations?.insights) {
      allInsights.push(...analysisResults.correlations.insights);
    }
    if (analysisResults.outliers?.insights) {
      allInsights.push(...analysisResults.outliers.insights);
    }
    if (analysisResults.trends?.insights) {
      allInsights.push(...analysisResults.trends.insights);
    }
    if (analysisResults.categories?.insights) {
      allInsights.push(...analysisResults.categories.insights);
    }

    // Limit insights if requested
    const limitedInsights = allInsights.slice(0, options.maxInsights);

    // Generate executive summary
    const executiveSummary = generateExecutiveSummary(analysisResults, limitedInsights);

    const response = {
      ...analysisResults,
      insights: limitedInsights,
      executiveSummary,
      metadata: {
        analysisTimestamp: new Date().toISOString(),
        datasetSize: dataset.length,
        columnsAnalyzed: Object.keys(analysisResults.summary.columns).length,
        insightsGenerated: limitedInsights.length,
        analysisOptions: options
      }
    };

    logger.info(`Analysis completed successfully. Generated ${limitedInsights.length} insights`);

    res.status(200).json({
      status: 'success',
      message: 'Dataset analysis completed successfully',
      data: response
    });

  } catch (error) {
    logger.error(`Analysis error: ${error.message}`);
    next(error);
  }
};

/**
 * Save analysis report
 * @route POST /api/v1/analysis/report/save
 */
exports.saveReport = async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = saveReportSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      });
    }

    const { title, description, analysisResults, datasetInfo, tags, isPublic } = value;

    // Generate insights from analysis results
    const insights = generateInsightsFromResults(analysisResults);

    // Create report
    const report = await Report.create({
      title,
      description,
      userId: req.user.id,
      fileName: datasetInfo.fileName || 'Unknown',
      fileSize: datasetInfo.fileSize || 0,
      datasetInfo: {
        rowCount: datasetInfo.rowCount || 0,
        columnCount: datasetInfo.columnCount || 0,
        columns: datasetInfo.columns || []
      },
      analysisResults,
      insights,
      tags,
      isPublic,
      status: 'completed'
    });

    logger.info(`Report saved successfully: ${report._id} by user ${req.user.id}`);

    res.status(201).json({
      status: 'success',
      message: 'Report saved successfully',
      data: {
        reportId: report._id,
        title: report.title,
        createdAt: report.createdAt
      }
    });

  } catch (error) {
    logger.error(`Save report error: ${error.message}`);
    next(error);
  }
};

/**
 * Get saved report by ID
 * @route GET /api/v1/analysis/report/:id
 */
exports.getReport = async (req, res, next) => {
  try {
    const reportId = req.params.id;

    // Validate ObjectId
    if (!reportId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid report ID format'
      });
    }

    const report = await Report.findById(reportId).populate('userId', 'name email');

    if (!report) {
      return res.status(404).json({
        status: 'error',
        message: 'Report not found'
      });
    }

    // Check access permissions
    if (!report.isPublic && (!req.user || report.userId._id.toString() !== req.user.id)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied to this report'
      });
    }

    logger.info(`Report accessed: ${reportId} by ${req.user?.id || 'anonymous'}`);

    res.status(200).json({
      status: 'success',
      data: report
    });

  } catch (error) {
    logger.error(`Get report error: ${error.message}`);
    next(error);
  }
};

/**
 * Get user's reports
 * @route GET /api/v1/analysis/reports
 */
exports.getUserReports = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = { userId: req.user.id };

    // Add filters
    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.tags) {
      const tags = req.query.tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tags };
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Execute query
    const reports = await Report.find(query)
      .select('title description fileName fileSize datasetInfo.rowCount datasetInfo.columnCount tags isPublic status createdAt updatedAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReports = await Report.countDocuments(query);
    const totalPages = Math.ceil(totalReports / limit);

    logger.info(`Retrieved ${reports.length} reports for user ${req.user.id}`);

    res.status(200).json({
      status: 'success',
      data: {
        reports,
        pagination: {
          currentPage: page,
          totalPages,
          totalReports,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    logger.error(`Get user reports error: ${error.message}`);
    next(error);
  }
};

/**
 * Delete report
 * @route DELETE /api/v1/analysis/report/:id
 */
exports.deleteReport = async (req, res, next) => {
  try {
    const reportId = req.params.id;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({
        status: 'error',
        message: 'Report not found'
      });
    }

    // Check ownership
    if (report.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this report'
      });
    }

    await Report.findByIdAndDelete(reportId);

    logger.info(`Report deleted: ${reportId} by user ${req.user.id}`);

    res.status(200).json({
      status: 'success',
      message: 'Report deleted successfully'
    });

  } catch (error) {
    logger.error(`Delete report error: ${error.message}`);
    next(error);
  }
};

/**
 * Get analysis statistics
 * @route GET /api/v1/analysis/stats
 */
exports.getAnalysisStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user's report statistics
    const stats = await Report.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalReports: { $sum: 1 },
          totalDataRows: { $sum: '$datasetInfo.rowCount' },
          avgDatasetSize: { $avg: '$datasetInfo.rowCount' },
          recentReports: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const userStats = stats[0] || {
      totalReports: 0,
      totalDataRows: 0,
      avgDatasetSize: 0,
      recentReports: 0
    };

    // Get recent activity
    const recentReports = await Report.find({ userId })
      .select('title createdAt datasetInfo.rowCount')
      .sort({ createdAt: -1 })
      .limit(5);

    logger.info(`Stats retrieved for user ${userId}`);

    res.status(200).json({
      status: 'success',
      data: {
        statistics: userStats,
        recentActivity: recentReports
      }
    });

  } catch (error) {
    logger.error(`Get analysis stats error: ${error.message}`);
    next(error);
  }
};

// Helper functions

function generateExecutiveSummary(analysisResults, insights) {
  const summary = {
    dataOverview: '',
    keyFindings: [],
    recommendations: []
  };

  if (analysisResults.summary) {
    const { rowCount, columnCount } = analysisResults.summary;
    summary.dataOverview = `Dataset contains ${rowCount} rows and ${columnCount} columns.`;
  }

  // Extract key findings from insights
  insights.forEach(insight => {
    if (insight.type === 'correlation' && Math.abs(insight.value) > 0.8) {
      summary.keyFindings.push(`Strong correlation detected: ${insight.description}`);
    }
    if (insight.type === 'outlier' && insight.percentage > 5) {
      summary.keyFindings.push(`Significant outliers found: ${insight.description}`);
    }
    if (insight.type === 'trend') {
      summary.keyFindings.push(`Trend identified: ${insight.description}`);
    }
  });

  // Generate basic recommendations
  if (summary.keyFindings.length > 0) {
    summary.recommendations.push('Review identified patterns for business insights');
    summary.recommendations.push('Investigate outliers for data quality issues');
    summary.recommendations.push('Consider trend implications for forecasting');
  }

  return summary;
}

function generateInsightsFromResults(analysisResults) {
  const insights = [];

  // Extract insights from each analysis type
  if (analysisResults.correlations?.insights) {
    analysisResults.correlations.insights.forEach(insight => {
      insights.push({
        type: 'correlation',
        title: `Correlation: ${insight.columns?.join(' & ')}`,
        description: insight.description,
        importance: Math.abs(insight.value) > 0.9 ? 'high' : 'medium'
      });
    });
  }

  if (analysisResults.outliers?.insights) {
    analysisResults.outliers.insights.forEach(insight => {
      insights.push({
        type: 'outlier',
        title: `Outliers in ${insight.column}`,
        description: insight.description,
        importance: insight.percentage > 10 ? 'high' : 'medium'
      });
    });
  }

  if (analysisResults.trends?.insights) {
    analysisResults.trends.insights.forEach(insight => {
      insights.push({
        type: 'trend',
        title: `Trend: ${insight.valueColumn}`,
        description: insight.description,
        importance: Math.abs(insight.slope) > 1 ? 'high' : 'medium'
      });
    });
  }

  if (analysisResults.categories?.insights) {
    analysisResults.categories.insights.forEach(insight => {
      insights.push({
        type: 'category',
        title: `Category Analysis: ${insight.column}`,
        description: insight.description,
        importance: 'medium'
      });
    });
  }

  return insights;
}

module.exports = exports;