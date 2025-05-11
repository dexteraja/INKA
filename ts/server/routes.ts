import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCandidateSchema, insertJobSchema, insertApplicationSchema, insertInterviewSchema } from "@shared/schema";
import { z } from "zod";

// Validation and error handling middleware
const validateRequest = (schema: z.ZodType<any, any>) => {
  return (req: Request, res: Response, next: Function) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      next(error);
    }
  };
};

// Import file handling utilities
import { uploadSingleFile, uploadMultipleFiles, processResume, processApplicationDocuments, deleteFile } from "./file-handler";
import { WebSocketServer } from 'ws';

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", validateRequest(insertUserSchema), async (req, res) => {
    try {
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(req.body.username);
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: "Username already exists"
        });
      }

      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists"
        });
      }

      const user = await storage.createUser(req.body);
      
      // Create candidate profile if role is candidate
      if (user.role === "candidate") {
        await storage.createCandidate({
          userId: user.id,
          // Add other required fields for candidate
        });
      }

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({
        success: true,
        data: userWithoutPassword
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Error creating user"
      });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Basic validation
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required"
        });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password"
        });
      }
      
      // In a real app, we'd use bcrypt.compare here
      if (user.password !== password) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password"
        });
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json({
        success: true,
        data: userWithoutPassword
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Error during login"
      });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID"
        });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json({
        success: true,
        data: userWithoutPassword
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving user"
      });
    }
  });

  app.get("/api/users/email/:email", async (req, res) => {
    try {
      const email = req.params.email;
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required"
        });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json({
        success: true,
        data: userWithoutPassword
      });
    } catch (error) {
      console.error("Get user by email error:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving user by email"
      });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID"
        });
      }
      
      // Ensure user exists
      const existingUser = await storage.getUser(userId);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      
      const updatedUser = await storage.updateUser(userId, req.body);
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found or could not be updated"
        });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.status(200).json({
        success: true,
        data: userWithoutPassword
      });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({
        success: false,
        message: "Error updating user"
      });
    }
  });

  // Candidate routes
  app.get("/api/candidates/:id", async (req, res) => {
    try {
      const candidateId = parseInt(req.params.id);
      if (isNaN(candidateId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid candidate ID"
        });
      }
      
      const candidate = await storage.getCandidate(candidateId);
      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: "Candidate not found"
        });
      }
      
      res.status(200).json({
        success: true,
        data: candidate
      });
    } catch (error) {
      console.error("Get candidate error:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving candidate"
      });
    }
  });

  app.get("/api/users/:userId/candidate", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID"
        });
      }
      
      const candidate = await storage.getCandidateByUserId(userId);
      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: "Candidate profile not found"
        });
      }
      
      res.status(200).json({
        success: true,
        data: candidate
      });
    } catch (error) {
      console.error("Get candidate by user ID error:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving candidate profile"
      });
    }
  });

  app.patch("/api/candidates/:id", validateRequest(insertCandidateSchema.partial()), async (req, res) => {
    try {
      const candidateId = parseInt(req.params.id);
      if (isNaN(candidateId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid candidate ID"
        });
      }
      
      // Ensure candidate exists
      const existingCandidate = await storage.getCandidate(candidateId);
      if (!existingCandidate) {
        return res.status(404).json({
          success: false,
          message: "Candidate not found"
        });
      }
      
      const updatedCandidate = await storage.updateCandidate(candidateId, req.body);
      if (!updatedCandidate) {
        return res.status(404).json({
          success: false,
          message: "Candidate not found or could not be updated"
        });
      }
      
      res.status(200).json({
        success: true,
        data: updatedCandidate
      });
    } catch (error) {
      console.error("Update candidate error:", error);
      res.status(500).json({
        success: false,
        message: "Error updating candidate"
      });
    }
  });

  // Job routes
  app.get("/api/jobs", async (req, res) => {
    try {
      const { query, department, jobType, active } = req.query;
      
      let jobs;
      if (query || department || jobType) {
        jobs = await storage.searchJobs(
          query as string, 
          department as string, 
          jobType as string
        );
      } else if (active === 'true') {
        jobs = await storage.getActiveJobs();
      } else {
        jobs = await storage.getAllJobs();
      }
      
      res.status(200).json({
        success: true,
        data: jobs
      });
    } catch (error) {
      console.error("Get jobs error:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving jobs"
      });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      if (isNaN(jobId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid job ID"
        });
      }
      
      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found"
        });
      }
      
      res.status(200).json({
        success: true,
        data: job
      });
    } catch (error) {
      console.error("Get job error:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving job"
      });
    }
  });

  app.post("/api/jobs", validateRequest(insertJobSchema), async (req, res) => {
    try {
      const job = await storage.createJob(req.body);
      
      res.status(201).json({
        success: true,
        data: job
      });
    } catch (error) {
      console.error("Create job error:", error);
      res.status(500).json({
        success: false,
        message: "Error creating job"
      });
    }
  });

  app.patch("/api/jobs/:id", validateRequest(insertJobSchema.partial()), async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      if (isNaN(jobId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid job ID"
        });
      }
      
      // Ensure job exists
      const existingJob = await storage.getJob(jobId);
      if (!existingJob) {
        return res.status(404).json({
          success: false,
          message: "Job not found"
        });
      }
      
      const updatedJob = await storage.updateJob(jobId, req.body);
      if (!updatedJob) {
        return res.status(404).json({
          success: false,
          message: "Job not found or could not be updated"
        });
      }
      
      res.status(200).json({
        success: true,
        data: updatedJob
      });
    } catch (error) {
      console.error("Update job error:", error);
      res.status(500).json({
        success: false,
        message: "Error updating job"
      });
    }
  });

  // Application routes
  app.get("/api/applications/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID"
        });
      }
      
      const applications = await storage.getUserApplications(userId);
      
      res.status(200).json({
        success: true,
        data: applications
      });
    } catch (error) {
      console.error("Get user applications error:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving applications"
      });
    }
  });

  app.get("/api/applications/job/:jobId", async (req, res) => {
    try {
      const jobId = parseInt(req.params.jobId);
      if (isNaN(jobId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid job ID"
        });
      }
      
      const applications = await storage.getJobApplications(jobId);
      
      res.status(200).json({
        success: true,
        data: applications
      });
    } catch (error) {
      console.error("Get job applications error:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving applications"
      });
    }
  });

  app.get("/api/applications/:id", async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      if (isNaN(applicationId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid application ID"
        });
      }
      
      const application = await storage.getApplication(applicationId);
      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found"
        });
      }
      
      res.status(200).json({
        success: true,
        data: application
      });
    } catch (error) {
      console.error("Get application error:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving application"
      });
    }
  });

  app.post("/api/applications", validateRequest(insertApplicationSchema), async (req, res) => {
    try {
      const application = await storage.createApplication(req.body);
      
      res.status(201).json({
        success: true,
        data: application
      });
    } catch (error) {
      console.error("Create application error:", error);
      res.status(500).json({
        success: false,
        message: "Error creating application"
      });
    }
  });

  app.patch("/api/applications/:id", validateRequest(insertApplicationSchema.partial()), async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      if (isNaN(applicationId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid application ID"
        });
      }
      
      // Ensure application exists
      const existingApplication = await storage.getApplication(applicationId);
      if (!existingApplication) {
        return res.status(404).json({
          success: false,
          message: "Application not found"
        });
      }
      
      const updatedApplication = await storage.updateApplication(applicationId, req.body);
      if (!updatedApplication) {
        return res.status(404).json({
          success: false,
          message: "Application not found or could not be updated"
        });
      }
      
      res.status(200).json({
        success: true,
        data: updatedApplication
      });
    } catch (error) {
      console.error("Update application error:", error);
      res.status(500).json({
        success: false,
        message: "Error updating application"
      });
    }
  });

  // Interview routes
  app.get("/api/interviews/application/:applicationId", async (req, res) => {
    try {
      const applicationId = parseInt(req.params.applicationId);
      if (isNaN(applicationId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid application ID"
        });
      }
      
      const interviews = await storage.getApplicationInterviews(applicationId);
      
      res.status(200).json({
        success: true,
        data: interviews
      });
    } catch (error) {
      console.error("Get application interviews error:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving interviews"
      });
    }
  });

  app.get("/api/interviews/:id", async (req, res) => {
    try {
      const interviewId = parseInt(req.params.id);
      if (isNaN(interviewId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid interview ID"
        });
      }
      
      const interview = await storage.getInterview(interviewId);
      if (!interview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found"
        });
      }
      
      res.status(200).json({
        success: true,
        data: interview
      });
    } catch (error) {
      console.error("Get interview error:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving interview"
      });
    }
  });

  app.post("/api/interviews", validateRequest(insertInterviewSchema), async (req, res) => {
    try {
      const interview = await storage.createInterview(req.body);
      
      res.status(201).json({
        success: true,
        data: interview
      });
    } catch (error) {
      console.error("Create interview error:", error);
      res.status(500).json({
        success: false,
        message: "Error creating interview"
      });
    }
  });

  app.patch("/api/interviews/:id", validateRequest(insertInterviewSchema.partial()), async (req, res) => {
    try {
      const interviewId = parseInt(req.params.id);
      if (isNaN(interviewId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid interview ID"
        });
      }
      
      // Ensure interview exists
      const existingInterview = await storage.getInterview(interviewId);
      if (!existingInterview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found"
        });
      }
      
      const updatedInterview = await storage.updateInterview(interviewId, req.body);
      if (!updatedInterview) {
        return res.status(404).json({
          success: false,
          message: "Interview not found or could not be updated"
        });
      }
      
      res.status(200).json({
        success: true,
        data: updatedInterview
      });
    } catch (error) {
      console.error("Update interview error:", error);
      res.status(500).json({
        success: false,
        message: "Error updating interview"
      });
    }
  });

  // File upload routes
  app.post("/api/upload/resume", uploadSingleFile("resume"), processResume, (req, res) => {
    try {
      // Get the processed file data from the middleware
      const fileData = (req as any).processedFile;
      
      if (!fileData) {
        return res.status(400).json({
          success: false,
          message: "No file was processed"
        });
      }
      
      res.status(200).json({
        success: true,
        data: fileData
      });
    } catch (error) {
      console.error("Resume upload error:", error);
      res.status(500).json({
        success: false,
        message: "Error uploading resume"
      });
    }
  });
  
  app.post("/api/upload/application-documents", uploadMultipleFiles("documents"), processApplicationDocuments, (req, res) => {
    try {
      // Get the processed files data from the middleware
      const filesData = (req as any).processedFiles;
      
      if (!filesData || filesData.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files were processed"
        });
      }
      
      res.status(200).json({
        success: true,
        data: filesData
      });
    } catch (error) {
      console.error("Documents upload error:", error);
      res.status(500).json({
        success: false,
        message: "Error uploading documents"
      });
    }
  });
  
  app.delete("/api/upload/file/:filename", deleteFile);

  // WebSocket setup for real-time chat
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    // Send welcome message
    ws.send(JSON.stringify({
      type: 'system',
      message: 'Welcome to the Virtual Railway Recruitment chat support! How can we help you today?',
      timestamp: new Date().toISOString()
    }));
    
    // Handle messages from client
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received:', data);
        
        // Echo back message for now (in real app, would process or forward to appropriate handler)
        setTimeout(() => {
          if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({
              type: 'agent',
              message: `Thank you for your message. Our recruitment team will respond shortly.`,
              timestamp: new Date().toISOString()
            }));
          }
        }, 1000);
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  return httpServer;
}
