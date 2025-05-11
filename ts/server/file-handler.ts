import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Setup file storage
const storage = multer.diskStorage({
  destination: './uploads',
  filename: function(req, file, cb) {
    // Generate unique filename with original extension
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  }
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads', { recursive: true });
}

// File filter for allowed file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allowed document types
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    // Accept the file
    cb(null, true);
  } else {
    // Reject the file
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, PNG, XLS, XLSX, and TXT files are allowed.'));
  }
};

// Configure multer
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  fileFilter: fileFilter
});

// Middleware for single file upload
export const uploadSingleFile = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const uploader = upload.single(fieldName);
    
    uploader(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        return res.status(400).json({
          success: false,
          message: `File upload error: ${err.message}`
        });
      } else if (err) {
        // Another error occurred
        return res.status(500).json({
          success: false,
          message: `Server error: ${err.message}`
        });
      }
      
      // File uploaded successfully, proceed
      next();
    });
  };
};

// Middleware for multiple file uploads
export const uploadMultipleFiles = (fieldName: string, maxCount: number = 5) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const uploader = upload.array(fieldName, maxCount);
    
    uploader(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        return res.status(400).json({
          success: false,
          message: `File upload error: ${err.message}`
        });
      } else if (err) {
        // Another error occurred
        return res.status(500).json({
          success: false,
          message: `Server error: ${err.message}`
        });
      }
      
      // Files uploaded successfully, proceed
      next();
    });
  };
};

// Process resume file after upload
export const processResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false, 
        message: "No resume file uploaded"
      });
    }
    
    // Get file information
    const fileInfo = {
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      type: 'resume',
      uploadDate: new Date().toISOString()
    };
    
    // In a real application, process the resume content here
    // For example, extract text, parse skills, education, experience, etc.
    
    // Attach the processed file info to the request object for the route handler
    (req as any).processedFile = fileInfo;
    
    next();
  } catch (error) {
    console.error('Resume processing error:', error);
    return res.status(500).json({
      success: false,
      message: "Error processing resume file"
    });
  }
};

// Process application documents after upload
export const processApplicationDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false, 
        message: "No documents uploaded"
      });
    }
    
    // Process each file
    const processedFiles = files.map(file => {
      return {
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
        type: getDocumentType(file.originalname),
        uploadDate: new Date().toISOString()
      };
    });
    
    // Attach the processed files info to the request object for the route handler
    (req as any).processedFiles = processedFiles;
    
    next();
  } catch (error) {
    console.error('Document processing error:', error);
    return res.status(500).json({
      success: false,
      message: "Error processing document files"
    });
  }
};

// Helper function to determine document type from filename
function getDocumentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  
  switch (ext) {
    case '.pdf':
      return 'pdf';
    case '.doc':
    case '.docx':
      return 'word';
    case '.jpg':
    case '.jpeg':
    case '.png':
      return 'image';
    case '.xls':
    case '.xlsx':
      return 'spreadsheet';
    case '.txt':
      return 'text';
    default:
      return 'other';
  }
}

// Handle file deletion
export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    
    // Validate filename
    if (!filename || filename.includes('..')) {
      return res.status(400).json({
        success: false,
        message: "Invalid filename"
      });
    }
    
    const filePath = path.join('./uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found"
      });
    }
    
    // Delete the file
    fs.unlinkSync(filePath);
    
    res.status(200).json({
      success: true,
      message: "File deleted successfully"
    });
  } catch (error) {
    console.error('File deletion error:', error);
    return res.status(500).json({
      success: false,
      message: "Error deleting file"
    });
  }
};