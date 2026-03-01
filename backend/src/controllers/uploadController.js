const multer = require('multer');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const Joi = require('joi');
const logger = require('../utils/logger');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    
    // Create upload directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  const allowedExtensions = ['.csv', '.xls', '.xlsx'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV and Excel files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 20 * 1024 * 1024, // 20MB default
    files: 1
  }
});

// Validation schema
const uploadValidation = Joi.object({
  parseOptions: Joi.object({
    delimiter: Joi.string().max(1).default(','),
    encoding: Joi.string().valid('utf8', 'latin1', 'ascii').default('utf8'),
    skipEmptyLines: Joi.boolean().default(true),
    maxRows: Joi.number().integer().min(1).max(100000).default(10000)
  }).default({})
});

/**
 * Upload and parse CSV/Excel file
 * @route POST /api/v1/upload
 */
exports.uploadFile = async (req, res, next) => {
  try {
    // Handle file upload
    upload.single('file')(req, res, async (err) => {
      if (err) {
        logger.error(`File upload error: ${err.message}`);
        
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            status: 'error',
            message: 'File too large. Maximum size is 20MB.'
          });
        }
        
        return res.status(400).json({
          status: 'error',
          message: err.message
        });
      }

      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'No file uploaded'
        });
      }

      try {
        // Validate request body
        const { error, value } = uploadValidation.validate(req.body);
        if (error) {
          // Clean up uploaded file
          fs.unlinkSync(req.file.path);
          return res.status(400).json({
            status: 'error',
            message: error.details[0].message
          });
        }

        const parseOptions = value.parseOptions;
        const filePath = req.file.path;
        const fileExtension = path.extname(req.file.originalname).toLowerCase();

        logger.info(`Processing file: ${req.file.originalname}, Size: ${req.file.size} bytes`);

        let dataset;

        // Parse file based on extension
        if (fileExtension === '.csv') {
          dataset = await parseCSV(filePath, parseOptions);
        } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
          dataset = await parseExcel(filePath, parseOptions);
        } else {
          // Clean up file
          fs.unlinkSync(filePath);
          return res.status(400).json({
            status: 'error',
            message: 'Unsupported file format'
          });
        }

        // Clean up uploaded file after parsing
        fs.unlinkSync(filePath);

        // Validate dataset
        if (!dataset || dataset.length === 0) {
          return res.status(400).json({
            status: 'error',
            message: 'File appears to be empty or could not be parsed'
          });
        }

        // Limit dataset size
        if (dataset.length > parseOptions.maxRows) {
          dataset = dataset.slice(0, parseOptions.maxRows);
        }

        // Generate dataset metadata
        const metadata = generateDatasetMetadata(dataset, req.file);

        logger.info(`File parsed successfully: ${dataset.length} rows, ${Object.keys(dataset[0] || {}).length} columns`);

        res.status(200).json({
          status: 'success',
          message: 'File uploaded and parsed successfully',
          data: {
            dataset,
            metadata,
            parseOptions
          }
        });

      } catch (parseError) {
        // Clean up file on parse error
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        
        logger.error(`File parsing error: ${parseError.message}`);
        return res.status(400).json({
          status: 'error',
          message: `Failed to parse file: ${parseError.message}`
        });
      }
    });

  } catch (error) {
    logger.error(`Upload controller error: ${error.message}`);
    next(error);
  }
};

/**
 * Get upload status and file info
 * @route GET /api/v1/upload/status
 */
exports.getUploadStatus = async (req, res, next) => {
  try {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    
    // Get upload directory stats
    let stats = {
      uploadsEnabled: true,
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 20 * 1024 * 1024,
      supportedFormats: ['CSV', 'Excel (.xlsx, .xls)'],
      uploadPath: uploadPath
    };

    // Check if upload directory exists and is writable
    try {
      fs.accessSync(uploadPath, fs.constants.W_OK);
    } catch (err) {
      stats.uploadsEnabled = false;
      stats.error = 'Upload directory not writable';
    }

    res.status(200).json({
      status: 'success',
      data: stats
    });

  } catch (error) {
    logger.error(`Upload status error: ${error.message}`);
    next(error);
  }
};

// Helper functions

/**
 * Parse CSV file
 */
async function parseCSV(filePath, options) {
  return new Promise((resolve, reject) => {
    const results = [];
    const { delimiter, encoding, skipEmptyLines, maxRows } = options;

    fs.createReadStream(filePath, { encoding })
      .pipe(csv({ 
        separator: delimiter,
        skipEmptyLines,
        mapHeaders: ({ header }) => header.trim()
      }))
      .on('data', (data) => {
        if (results.length < maxRows) {
          // Clean and validate row data
          const cleanedData = {};
          Object.keys(data).forEach(key => {
            const cleanKey = key.trim();
            const value = data[key];
            cleanedData[cleanKey] = value !== null && value !== undefined ? value.toString().trim() : '';
          });
          results.push(cleanedData);
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(new Error(`CSV parsing failed: ${error.message}`));
      });
  });
}

/**
 * Parse Excel file
 */
async function parseExcel(filePath, options) {
  try {
    const { maxRows } = options;
    
    // Read the workbook
    const workbook = XLSX.readFile(filePath);
    
    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new Error('No worksheets found in Excel file');
    }
    
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '',
      blankrows: false
    });

    if (jsonData.length === 0) {
      throw new Error('Excel file appears to be empty');
    }

    // Get headers from first row
    const headers = jsonData[0].map(header => 
      header ? header.toString().trim() : `Column_${Math.random().toString(36).substr(2, 9)}`
    );

    // Convert to array of objects
    const results = [];
    for (let i = 1; i < Math.min(jsonData.length, maxRows + 1); i++) {
      const row = jsonData[i];
      const rowObject = {};
      
      headers.forEach((header, index) => {
        const value = row[index];
        rowObject[header] = value !== null && value !== undefined ? value.toString().trim() : '';
      });
      
      results.push(rowObject);
    }

    return results;
  } catch (error) {
    throw new Error(`Excel parsing failed: ${error.message}`);
  }
}

/**
 * Generate dataset metadata
 */
function generateDatasetMetadata(dataset, fileInfo) {
  if (!dataset || dataset.length === 0) {
    return null;
  }

  const columns = Object.keys(dataset[0]);
  const columnInfo = {};

  // Analyze each column
  columns.forEach(column => {
    const values = dataset.map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '');
    const nonEmptyCount = values.length;
    const emptyCount = dataset.length - nonEmptyCount;
    
    // Determine data type
    const numericValues = values.filter(val => !isNaN(parseFloat(val)) && isFinite(val));
    const isNumeric = numericValues.length > 0 && numericValues.length / nonEmptyCount > 0.8;
    
    columnInfo[column] = {
      type: isNumeric ? 'numeric' : 'text',
      totalCount: dataset.length,
      nonEmptyCount,
      emptyCount,
      uniqueCount: new Set(values).size,
      sampleValues: values.slice(0, 5)
    };
  });

  return {
    fileName: fileInfo.originalname,
    fileSize: fileInfo.size,
    mimeType: fileInfo.mimetype,
    rowCount: dataset.length,
    columnCount: columns.length,
    columns: columnInfo,
    uploadedAt: new Date().toISOString()
  };
}

module.exports = exports;