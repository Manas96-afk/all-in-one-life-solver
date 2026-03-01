const logger = require('../utils/logger');

class AnalysisService {
  /**
   * Generate comprehensive dataset summary
   * @param {Array} dataset - Array of objects representing the dataset
   * @returns {Object} Summary statistics
   */
  static generateSummary(dataset) {
    try {
      if (!Array.isArray(dataset) || dataset.length === 0) {
        throw new Error('Invalid dataset provided');
      }

      const summary = {
        rowCount: dataset.length,
        columnCount: 0,
        columns: {},
        dataTypes: {},
        missingValues: {},
        uniqueValues: {}
      };

      // Get all unique column names
      const allColumns = new Set();
      dataset.forEach(row => {
        Object.keys(row).forEach(col => allColumns.add(col));
      });

      summary.columnCount = allColumns.size;

      // Analyze each column
      allColumns.forEach(column => {
        const values = dataset.map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '');
        const nonNullValues = values.length;
        const nullCount = dataset.length - nonNullValues;

        // Determine data type
        const numericValues = values.filter(val => !isNaN(parseFloat(val)) && isFinite(val)).map(val => parseFloat(val));
        const isNumeric = numericValues.length > 0 && numericValues.length / nonNullValues > 0.8;

        summary.columns[column] = {
          type: isNumeric ? 'numeric' : 'categorical',
          nullCount,
          nonNullCount: nonNullValues,
          uniqueCount: new Set(values).size
        };

        if (isNumeric && numericValues.length > 0) {
          const sorted = numericValues.sort((a, b) => a - b);
          const sum = numericValues.reduce((acc, val) => acc + val, 0);
          const mean = sum / numericValues.length;
          
          // Calculate median
          const median = sorted.length % 2 === 0
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)];

          // Calculate standard deviation
          const variance = numericValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numericValues.length;
          const stdDev = Math.sqrt(variance);

          summary.columns[column] = {
            ...summary.columns[column],
            min: Math.min(...numericValues),
            max: Math.max(...numericValues),
            mean: parseFloat(mean.toFixed(4)),
            median: parseFloat(median.toFixed(4)),
            stdDev: parseFloat(stdDev.toFixed(4)),
            sum: parseFloat(sum.toFixed(4))
          };
        } else {
          // For categorical data, get frequency distribution
          const frequencies = {};
          values.forEach(val => {
            frequencies[val] = (frequencies[val] || 0) + 1;
          });
          
          const sortedFreqs = Object.entries(frequencies)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10); // Top 10 most frequent values

          summary.columns[column] = {
            ...summary.columns[column],
            topValues: sortedFreqs
          };
        }
      });

      return summary;
    } catch (error) {
      logger.error(`Summary generation error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Calculate correlation matrix for numeric columns
   * @param {Array} dataset - Array of objects representing the dataset
   * @returns {Object} Correlation matrix and insights
   */
  static calculateCorrelationMatrix(dataset) {
    try {
      if (!Array.isArray(dataset) || dataset.length === 0) {
        return { matrix: {}, insights: [] };
      }

      // Get numeric columns
      const numericColumns = [];
      const firstRow = dataset[0];
      
      Object.keys(firstRow).forEach(column => {
        const values = dataset.map(row => parseFloat(row[column])).filter(val => !isNaN(val));
        if (values.length > dataset.length * 0.5) { // At least 50% numeric values
          numericColumns.push(column);
        }
      });

      if (numericColumns.length < 2) {
        return { matrix: {}, insights: ['Not enough numeric columns for correlation analysis'] };
      }

      const matrix = {};
      const insights = [];

      // Calculate correlation for each pair
      for (let i = 0; i < numericColumns.length; i++) {
        matrix[numericColumns[i]] = {};
        
        for (let j = 0; j < numericColumns.length; j++) {
          const col1 = numericColumns[i];
          const col2 = numericColumns[j];
          
          if (i === j) {
            matrix[col1][col2] = 1;
            continue;
          }

          const correlation = this.calculatePearsonCorrelation(dataset, col1, col2);
          matrix[col1][col2] = parseFloat(correlation.toFixed(4));

          // Generate insights for strong correlations
          if (Math.abs(correlation) > 0.7 && i < j) {
            const strength = Math.abs(correlation) > 0.9 ? 'very strong' : 'strong';
            const direction = correlation > 0 ? 'positive' : 'negative';
            insights.push({
              type: 'correlation',
              columns: [col1, col2],
              value: correlation,
              description: `${strength} ${direction} correlation between ${col1} and ${col2} (${correlation.toFixed(3)})`
            });
          }
        }
      }

      return { matrix, insights, numericColumns };
    } catch (error) {
      logger.error(`Correlation calculation error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Calculate Pearson correlation coefficient between two columns
   */
  static calculatePearsonCorrelation(dataset, col1, col2) {
    const pairs = dataset
      .map(row => [parseFloat(row[col1]), parseFloat(row[col2])])
      .filter(([x, y]) => !isNaN(x) && !isNaN(y));

    if (pairs.length < 2) return 0;

    const n = pairs.length;
    const sumX = pairs.reduce((sum, [x]) => sum + x, 0);
    const sumY = pairs.reduce((sum, [, y]) => sum + y, 0);
    const sumXY = pairs.reduce((sum, [x, y]) => sum + x * y, 0);
    const sumX2 = pairs.reduce((sum, [x]) => sum + x * x, 0);
    const sumY2 = pairs.reduce((sum, [, y]) => sum + y * y, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  /**
   * Detect outliers using IQR method
   * @param {Array} dataset - Array of objects representing the dataset
   * @returns {Object} Outliers information
   */
  static detectOutliers(dataset) {
    try {
      if (!Array.isArray(dataset) || dataset.length === 0) {
        return { outliers: {}, insights: [] };
      }

      const outliers = {};
      const insights = [];

      // Get numeric columns
      const firstRow = dataset[0];
      Object.keys(firstRow).forEach(column => {
        const values = dataset
          .map((row, index) => ({ value: parseFloat(row[column]), index }))
          .filter(item => !isNaN(item.value));

        if (values.length < 4) return; // Need at least 4 values for IQR

        // Sort values
        const sortedValues = values.map(item => item.value).sort((a, b) => a - b);
        
        // Calculate quartiles
        const q1Index = Math.floor(sortedValues.length * 0.25);
        const q3Index = Math.floor(sortedValues.length * 0.75);
        const q1 = sortedValues[q1Index];
        const q3 = sortedValues[q3Index];
        const iqr = q3 - q1;
        
        // Calculate outlier bounds
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;

        // Find outliers
        const columnOutliers = values.filter(item => 
          item.value < lowerBound || item.value > upperBound
        );

        if (columnOutliers.length > 0) {
          outliers[column] = {
            count: columnOutliers.length,
            percentage: parseFloat(((columnOutliers.length / values.length) * 100).toFixed(2)),
            bounds: { lower: lowerBound, upper: upperBound },
            values: columnOutliers.map(item => ({
              value: item.value,
              rowIndex: item.index
            })).slice(0, 20) // Limit to first 20 outliers
          };

          insights.push({
            type: 'outlier',
            column,
            count: columnOutliers.length,
            percentage: outliers[column].percentage,
            description: `Found ${columnOutliers.length} outliers in ${column} (${outliers[column].percentage}% of data)`
          });
        }
      });

      return { outliers, insights };
    } catch (error) {
      logger.error(`Outlier detection error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Analyze trends in time-series data
   * @param {Array} dataset - Array of objects representing the dataset
   * @returns {Object} Trend analysis results
   */
  static analyzeTrends(dataset) {
    try {
      if (!Array.isArray(dataset) || dataset.length === 0) {
        return { trends: {}, insights: [] };
      }

      const trends = {};
      const insights = [];

      // Try to identify date/time columns
      const dateColumns = this.identifyDateColumns(dataset);
      
      if (dateColumns.length === 0) {
        return { 
          trends: {}, 
          insights: ['No date/time columns found for trend analysis'] 
        };
      }

      // For each date column, analyze trends with numeric columns
      dateColumns.forEach(dateCol => {
        const numericColumns = this.getNumericColumns(dataset);
        
        numericColumns.forEach(numCol => {
          const trendData = this.calculateTrend(dataset, dateCol, numCol);
          
          if (trendData) {
            const trendKey = `${dateCol}_${numCol}`;
            trends[trendKey] = trendData;

            if (Math.abs(trendData.slope) > 0.1) {
              const direction = trendData.slope > 0 ? 'increasing' : 'decreasing';
              insights.push({
                type: 'trend',
                dateColumn: dateCol,
                valueColumn: numCol,
                direction,
                slope: trendData.slope,
                description: `${numCol} shows ${direction} trend over ${dateCol} (slope: ${trendData.slope.toFixed(4)})`
              });
            }
          }
        });
      });

      return { trends, insights };
    } catch (error) {
      logger.error(`Trend analysis error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate category insights and frequency distributions
   * @param {Array} dataset - Array of objects representing the dataset
   * @returns {Object} Category analysis results
   */
  static generateCategoryInsights(dataset) {
    try {
      if (!Array.isArray(dataset) || dataset.length === 0) {
        return { categories: {}, insights: [] };
      }

      const categories = {};
      const insights = [];

      // Analyze categorical columns
      const firstRow = dataset[0];
      Object.keys(firstRow).forEach(column => {
        const values = dataset.map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '');
        const uniqueValues = new Set(values);
        
        // Consider as categorical if unique values are less than 50% of total values or less than 20 unique values
        const isCategorial = uniqueValues.size < values.length * 0.5 || uniqueValues.size <= 20;
        
        if (isCategorial && uniqueValues.size > 1) {
          // Calculate frequency distribution
          const frequencies = {};
          values.forEach(val => {
            frequencies[val] = (frequencies[val] || 0) + 1;
          });

          // Sort by frequency
          const sortedFreqs = Object.entries(frequencies)
            .sort(([,a], [,b]) => b - a)
            .map(([value, count]) => ({
              value,
              count,
              percentage: parseFloat(((count / values.length) * 100).toFixed(2))
            }));

          categories[column] = {
            totalValues: values.length,
            uniqueCount: uniqueValues.size,
            distribution: sortedFreqs,
            topValue: sortedFreqs[0],
            diversity: parseFloat((uniqueValues.size / values.length).toFixed(4))
          };

          // Generate insights
          const topValue = sortedFreqs[0];
          if (topValue.percentage > 50) {
            insights.push({
              type: 'category',
              column,
              description: `${column} is dominated by '${topValue.value}' (${topValue.percentage}% of data)`
            });
          }

          if (uniqueValues.size > 10) {
            insights.push({
              type: 'category',
              column,
              description: `${column} has high diversity with ${uniqueValues.size} unique values`
            });
          }
        }
      });

      return { categories, insights };
    } catch (error) {
      logger.error(`Category analysis error: ${error.message}`);
      throw error;
    }
  }

  // Helper methods
  static identifyDateColumns(dataset) {
    const dateColumns = [];
    const firstRow = dataset[0];
    
    Object.keys(firstRow).forEach(column => {
      const sampleValues = dataset.slice(0, 10).map(row => row[column]);
      const dateCount = sampleValues.filter(val => {
        if (!val) return false;
        const date = new Date(val);
        return !isNaN(date.getTime()) && val.toString().length > 8;
      }).length;
      
      if (dateCount > sampleValues.length * 0.7) {
        dateColumns.push(column);
      }
    });
    
    return dateColumns;
  }

  static getNumericColumns(dataset) {
    const numericColumns = [];
    const firstRow = dataset[0];
    
    Object.keys(firstRow).forEach(column => {
      const values = dataset.map(row => parseFloat(row[column])).filter(val => !isNaN(val));
      if (values.length > dataset.length * 0.5) {
        numericColumns.push(column);
      }
    });
    
    return numericColumns;
  }

  static calculateTrend(dataset, dateCol, valueCol) {
    try {
      const points = dataset
        .map(row => ({
          x: new Date(row[dateCol]).getTime(),
          y: parseFloat(row[valueCol])
        }))
        .filter(point => !isNaN(point.x) && !isNaN(point.y))
        .sort((a, b) => a.x - b.x);

      if (points.length < 2) return null;

      // Calculate linear regression
      const n = points.length;
      const sumX = points.reduce((sum, point) => sum + point.x, 0);
      const sumY = points.reduce((sum, point) => sum + point.y, 0);
      const sumXY = points.reduce((sum, point) => sum + point.x * point.y, 0);
      const sumX2 = points.reduce((sum, point) => sum + point.x * point.x, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      // Calculate R-squared
      const yMean = sumY / n;
      const totalSumSquares = points.reduce((sum, point) => sum + Math.pow(point.y - yMean, 2), 0);
      const residualSumSquares = points.reduce((sum, point) => {
        const predicted = slope * point.x + intercept;
        return sum + Math.pow(point.y - predicted, 2);
      }, 0);
      
      const rSquared = 1 - (residualSumSquares / totalSumSquares);

      return {
        slope: parseFloat(slope.toFixed(8)),
        intercept: parseFloat(intercept.toFixed(4)),
        rSquared: parseFloat(rSquared.toFixed(4)),
        dataPoints: points.length,
        startDate: new Date(points[0].x).toISOString(),
        endDate: new Date(points[points.length - 1].x).toISOString()
      };
    } catch (error) {
      logger.error(`Trend calculation error: ${error.message}`);
      return null;
    }
  }

  /**
   * Perform complete analysis on dataset
   * @param {Array} dataset - Array of objects representing the dataset
   * @returns {Object} Complete analysis results
   */
  static performCompleteAnalysis(dataset) {
    try {
      logger.info(`Starting complete analysis for dataset with ${dataset.length} rows`);

      const results = {
        summary: this.generateSummary(dataset),
        correlations: this.calculateCorrelationMatrix(dataset),
        outliers: this.detectOutliers(dataset),
        trends: this.analyzeTrends(dataset),
        categories: this.generateCategoryInsights(dataset)
      };

      // Compile all insights
      const allInsights = [
        ...(results.correlations.insights || []),
        ...(results.outliers.insights || []),
        ...(results.trends.insights || []),
        ...(results.categories.insights || [])
      ];

      results.insights = allInsights;
      results.analysisMetadata = {
        timestamp: new Date().toISOString(),
        processingTime: Date.now(),
        datasetSize: dataset.length,
        columnsAnalyzed: Object.keys(results.summary.columns).length
      };

      logger.info(`Analysis completed successfully with ${allInsights.length} insights generated`);
      return results;
    } catch (error) {
      logger.error(`Complete analysis error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = AnalysisService;