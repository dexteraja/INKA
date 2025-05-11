import { 
  users, type User, type InsertUser,
  candidates, type Candidate, type InsertCandidate,
  jobs, type Job, type InsertJob,
  applications, type Application, type InsertApplication,
  interviews, type Interview, type InsertInterview
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, or, like, inArray } from "drizzle-orm";

// Interface with CRUD methods for our application
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  
  // Candidate methods
  getCandidate(id: number): Promise<Candidate | undefined>;
  getCandidateByUserId(userId: number): Promise<Candidate | undefined>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  updateCandidate(id: number, candidateData: Partial<InsertCandidate>): Promise<Candidate | undefined>;
  
  // Job methods
  getJob(id: number): Promise<Job | undefined>;
  getAllJobs(): Promise<Job[]>;
  getActiveJobs(): Promise<Job[]>;
  searchJobs(query: string, department?: string, jobType?: string): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, jobData: Partial<InsertJob>): Promise<Job | undefined>;
  
  // Application methods
  getApplication(id: number): Promise<Application | undefined>;
  getUserApplications(userId: number): Promise<Application[]>;
  getJobApplications(jobId: number): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: number, applicationData: Partial<InsertApplication>): Promise<Application | undefined>;
  
  // Interview methods
  getInterview(id: number): Promise<Interview | undefined>;
  getApplicationInterviews(applicationId: number): Promise<Interview[]>;
  createInterview(interview: InsertInterview): Promise<Interview>;
  updateInterview(id: number, interviewData: Partial<InsertInterview>): Promise<Interview | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  // Candidate methods
  async getCandidate(id: number): Promise<Candidate | undefined> {
    const [candidate] = await db.select().from(candidates).where(eq(candidates.id, id));
    return candidate;
  }
  
  async getCandidateByUserId(userId: number): Promise<Candidate | undefined> {
    const [candidate] = await db.select().from(candidates).where(eq(candidates.userId, userId));
    return candidate;
  }
  
  async createCandidate(candidate: InsertCandidate): Promise<Candidate> {
    const [newCandidate] = await db.insert(candidates).values(candidate).returning();
    return newCandidate;
  }
  
  async updateCandidate(id: number, candidateData: Partial<InsertCandidate>): Promise<Candidate | undefined> {
    const [updatedCandidate] = await db
      .update(candidates)
      .set({ ...candidateData, updatedAt: new Date() })
      .where(eq(candidates.id, id))
      .returning();
    return updatedCandidate;
  }
  
  // Job methods
  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }
  
  async getAllJobs(): Promise<Job[]> {
    return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  }
  
  async getActiveJobs(): Promise<Job[]> {
    return await db
      .select()
      .from(jobs)
      .where(eq(jobs.isActive, true))
      .orderBy(desc(jobs.createdAt));
  }
  
  async searchJobs(query: string, department?: string, jobType?: string): Promise<Job[]> {
    let conditions = [eq(jobs.isActive, true)];
    
    if (query) {
      conditions.push(
        or(
          like(jobs.title, `%${query}%`),
          like(jobs.description, `%${query}%`),
          like(jobs.shortDescription, `%${query}%`),
          like(jobs.location, `%${query}%`)
        )
      );
    }
    
    if (department) {
      conditions.push(eq(jobs.department, department as any)); // Cast needed for enum
    }
    
    if (jobType) {
      conditions.push(eq(jobs.jobType, jobType as any)); // Cast needed for enum
    }
    
    return await db
      .select()
      .from(jobs)
      .where(and(...conditions))
      .orderBy(desc(jobs.createdAt));
  }
  
  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }
  
  async updateJob(id: number, jobData: Partial<InsertJob>): Promise<Job | undefined> {
    const [updatedJob] = await db
      .update(jobs)
      .set({ ...jobData, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();
    return updatedJob;
  }
  
  // Application methods
  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application;
  }
  
  async getUserApplications(userId: number): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.userId, userId))
      .orderBy(desc(applications.createdAt));
  }
  
  async getJobApplications(jobId: number): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.jobId, jobId))
      .orderBy(desc(applications.createdAt));
  }
  
  async createApplication(application: InsertApplication): Promise<Application> {
    const [newApplication] = await db.insert(applications).values(application).returning();
    return newApplication;
  }
  
  async updateApplication(id: number, applicationData: Partial<InsertApplication>): Promise<Application | undefined> {
    const [updatedApplication] = await db
      .update(applications)
      .set({ ...applicationData, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();
    return updatedApplication;
  }
  
  // Interview methods
  async getInterview(id: number): Promise<Interview | undefined> {
    const [interview] = await db.select().from(interviews).where(eq(interviews.id, id));
    return interview;
  }
  
  async getApplicationInterviews(applicationId: number): Promise<Interview[]> {
    return await db
      .select()
      .from(interviews)
      .where(eq(interviews.applicationId, applicationId))
      .orderBy(asc(interviews.scheduledFor));
  }
  
  async createInterview(interview: InsertInterview): Promise<Interview> {
    const [newInterview] = await db.insert(interviews).values(interview).returning();
    return newInterview;
  }
  
  async updateInterview(id: number, interviewData: Partial<InsertInterview>): Promise<Interview | undefined> {
    const [updatedInterview] = await db
      .update(interviews)
      .set({ ...interviewData, updatedAt: new Date() })
      .where(eq(interviews.id, id))
      .returning();
    return updatedInterview;
  }
}

export const storage = new DatabaseStorage();
