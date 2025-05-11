import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FileUpload } from '@/components/FileUpload';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

// Form validation schema
const applicationSchema = z.object({
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter your full address"),
  education: z.string().min(5, "Please provide your educational background"),
  experience: z.string().min(5, "Please describe your relevant experience"),
  skills: z.string().min(5, "Please list your relevant skills"),
  references: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function ApplicationForm() {
  const [, setLocation] = useLocation();
  const { jobId } = useParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [job, setJob] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [supportingDocuments, setSupportingDocuments] = useState<any[]>([]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You need to log in to apply for jobs",
        variant: "destructive",
      });
      setLocation('/login');
    }
  }, [isAuthenticated, isLoading, setLocation, toast]);
  
  // Fetch job details
  useEffect(() => {
    if (jobId) {
      const fetchJob = async () => {
        try {
          const response = await fetch(`/api/jobs/${jobId}`);
          if (!response.ok) {
            throw new Error('Job not found');
          }
          
          const data = await response.json();
          setJob(data.data);
        } catch (error) {
          console.error('Error fetching job:', error);
          toast({
            title: "Error",
            description: "Failed to load job details",
            variant: "destructive",
          });
          setLocation('/jobs');
        }
      };
      
      fetchJob();
    }
  }, [jobId, setLocation, toast]);
  
  // Form definition
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      coverLetter: '',
      phoneNumber: '',
      address: '',
      education: '',
      experience: '',
      skills: '',
      references: '',
      agreeToTerms: false,
    },
  });
  
  const onResumeUploadComplete = (files: any[]) => {
    setResumeUploaded(true);
    toast({
      title: "Success",
      description: "Resume uploaded successfully",
      variant: "default",
    });
  };
  
  const onDocumentsUploadComplete = (files: any[]) => {
    setSupportingDocuments(files);
    toast({
      title: "Success",
      description: `${files.length} document(s) uploaded successfully`,
      variant: "default",
    });
  };
  
  const onSubmit = async (values: ApplicationFormValues) => {
    if (!resumeUploaded) {
      toast({
        title: "Missing Resume",
        description: "Please upload your resume before submitting",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to apply",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare application data
      const applicationData = {
        userId: user.uid,
        jobId: Number(jobId),
        coverLetter: values.coverLetter,
        status: 'pending',
        applicationData: {
          phoneNumber: values.phoneNumber,
          address: values.address,
          education: values.education,
          experience: values.experience,
          skills: values.skills,
          references: values.references,
          resumeId: resumeUploaded ? 'resume-id' : null,
          supportingDocuments: supportingDocuments.map(doc => doc.filename),
        },
      };
      
      // Submit application
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit application');
      }
      
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted",
        variant: "default",
      });
      
      // Play train whistle sound effect to celebrate submission
      const audio = new Audio('/sounds/train-whistle.mp3');
      audio.volume = 0.3;
      audio.play();
      
      // Redirect to profile page
      setTimeout(() => {
        setLocation('/profile');
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading || !job) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <Card className="border-orange-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
            <CardTitle className="text-2xl text-orange-800">Apply for Position</CardTitle>
            <CardDescription className="text-orange-700">
              {job.title} - {job.department}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="mb-8 p-4 bg-amber-50 rounded-md border border-amber-100">
              <h3 className="text-lg font-medium text-amber-800 mb-2">Position Details</h3>
              <p className="text-sm mb-2"><strong>Department:</strong> {job.department}</p>
              <p className="text-sm mb-2"><strong>Location:</strong> {job.location}</p>
              <p className="text-sm mb-2"><strong>Job Type:</strong> {job.jobType}</p>
              <p className="text-sm"><strong>Salary Range:</strong> {job.salaryRange}</p>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Resume Upload</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <FileUpload
                  uploadUrl="/api/upload/resume"
                  fieldName="resume"
                  allowedTypes={['.pdf', '.doc', '.docx']}
                  maxFiles={1}
                  maxSize={5}
                  onUploadComplete={onResumeUploadComplete}
                />
                
                {resumeUploaded && (
                  <div className="mt-3 flex items-center text-sm text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Resume uploaded successfully
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Supporting Documents (Optional)</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <FileUpload
                  uploadUrl="/api/upload/application-documents"
                  fieldName="documents"
                  allowedTypes={['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']}
                  maxFiles={3}
                  maxSize={10}
                  onUploadComplete={onDocumentsUploadComplete}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                You may upload certificates, recommendation letters, or other relevant documents.
              </p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="coverLetter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Letter</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your cover letter here..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Introduce yourself and explain why you're a good fit for this position.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(123) 456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Your current address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List your educational background and qualifications"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relevant Experience</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your work experience relevant to this position"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List your relevant skills and competencies"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="references"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>References (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List any professional references"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide the names and contact information of professional references (optional).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Terms and Conditions</FormLabel>
                        <FormDescription>
                          I agree to the terms and conditions of the application process and confirm that all information provided is accurate.
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {!resumeUploaded && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-2 text-amber-800">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <p className="text-sm">Please upload your resume before submitting your application.</p>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  disabled={isSubmitting || !resumeUploaded}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="bg-gray-50 border-t">
            <p className="text-xs text-gray-500">
              By submitting this application, you consent to our processing of your personal data for recruitment purposes in accordance with our privacy policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}