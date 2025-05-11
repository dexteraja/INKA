import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, varchar, json, uniqueIndex, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "recruiter", "candidate"]);
export const applicationStatusEnum = pgEnum("application_status", ["pending", "reviewing", "interview", "offer", "rejected", "hired"]);
export const departmentEnum = pgEnum("department", ["engineering", "operations", "management", "customer_service", "maintenance"]);
export const jobTypeEnum = pgEnum("job_type", ["full_time", "part_time", "contract", "temporary", "internship"]);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: userRoleEnum("role").notNull().default("candidate"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  candidates: many(candidates),
  applications: many(applications),
  jobs: many(jobs),
}));

// Candidates profile table
export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country"),
  resumeUrl: text("resume_url"),
  bio: text("bio"),
  skills: text("skills").array(),
  experience: integer("experience").default(0),
  education: text("education"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Candidates relations
export const candidatesRelations = relations(candidates, ({ one, many }) => ({
  user: one(users, {
    fields: [candidates.userId],
    references: [users.id],
  }),
  applications: many(applications),
}));

// Jobs table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  department: departmentEnum("department").notNull(),
  jobType: jobTypeEnum("job_type").notNull().default("full_time"),
  location: text("location").notNull(),
  salary: text("salary"),
  requirements: text("requirements").array(),
  responsibilities: text("responsibilities").array(),
  benefits: text("benefits").array(),
  postedBy: integer("posted_by").references(() => users.id),
  isActive: boolean("is_active").default(true).notNull(),
  deadline: timestamp("deadline"),
  vacancies: integer("vacancies").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Jobs relations
export const jobsRelations = relations(jobs, ({ many, one }) => ({
  applications: many(applications),
  recruiter: one(users, {
    fields: [jobs.postedBy],
    references: [users.id],
  }),
}));

// Applications table
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull().references(() => jobs.id, { onDelete: "cascade" }),
  candidateId: integer("candidate_id").notNull().references(() => candidates.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: applicationStatusEnum("status").notNull().default("pending"),
  coverLetter: text("cover_letter"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  interviewDate: timestamp("interview_date"),
  interviewFeedback: text("interview_feedback"),
});

// Applications relations
export const applicationsRelations = relations(applications, ({ one }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  candidate: one(candidates, {
    fields: [applications.candidateId],
    references: [candidates.id],
  }),
  user: one(users, {
    fields: [applications.userId],
    references: [users.id],
  }),
}));

// Interviews table
export const interviews = pgTable("interviews", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  scheduledFor: timestamp("scheduled_for").notNull(),
  interviewerId: integer("interviewer_id").references(() => users.id),
  status: text("status").notNull().default("scheduled"),
  feedback: text("feedback"),
  rating: integer("rating"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Interviews relations
export const interviewsRelations = relations(interviews, ({ one }) => ({
  application: one(applications, {
    fields: [interviews.applicationId],
    references: [applications.id],
  }),
  interviewer: one(users, {
    fields: [interviews.interviewerId],
    references: [users.id],
  }),
}));

// Schemas for inserts
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCandidateSchema = createInsertSchema(candidates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInterviewSchema = createInsertSchema(interviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for the schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Candidate = typeof candidates.$inferSelect;

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

export type InsertInterview = z.infer<typeof insertInterviewSchema>;
export type Interview = typeof interviews.$inferSelect;
