import { useParams, Link } from 'wouter';
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useJob } from '@/hooks/useJobs';
import { useAuth } from '@/contexts/AuthContext';
import { useSubmitApplication } from '@/hooks/useApplications';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  MapPin,
  Briefcase,
  Building,
  Calendar,
  Users,
  ArrowLeft,
  FileText,
  CheckCircle,
  Clock,
} from 'lucide-react';

// Application form schema
const applicationSchema = z.object({
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters'),
  resumeUrl: z.string().url('Please enter a valid URL to your resume'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  additionalInfo: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

export default function JobDetail() {
  const params = useParams<{ id: string }>();
  const jobId = parseInt(params.id);
  const { data: job, isLoading } = useJob(jobId);
  const { user, isAuthenticated } = useAuth();
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const { toast } = useToast();
  const submitApplication = useSubmitApplication();

  // Form setup
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      coverLetter: '',
      resumeUrl: '',
      phoneNumber: '',
      additionalInfo: '',
    },
  });

  // Handle application submission
  const onSubmit = async (data: ApplicationFormValues) => {
    if (!job || !user) return;
    
    try {
      await submitApplication.mutateAsync({
        jobId: job.id,
        userId: user.id,
        candidateId: user.id, // Note: In a real app, you'd use the candidate ID from a separate table
        status: 'pending',
        coverLetter: data.coverLetter,
        notes: `Resume: ${data.resumeUrl}\nPhone: ${data.phoneNumber}\n${data.additionalInfo || ''}`, // Store URL and phone in notes
      });
      
      toast({
        title: 'Application Submitted',
        description: 'Your application has been successfully submitted.',
        variant: 'default',
      });
      
      setIsApplyDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Application Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
            </div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-semibold mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-8">The job you're looking for doesn't exist or has been removed.</p>
          <Link href="/jobs">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Job Header */}
      <section className="bg-primary/10 py-12">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                  {job.department.replace('_', ' ')}
                </span>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  {job.jobType.replace('_', ' ')}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{job.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1" />
                  {job.jobType.replace('_', ' ')}
                </div>
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  {job.department.replace('_', ' ')}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {job.vacancies} {job.vacancies === 1 ? 'vacancy' : 'vacancies'}
                </div>
                {job.deadline && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-4 md:mt-0">
              <div className="text-xl font-semibold text-primary">{job.salary}</div>
              <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" disabled={!isAuthenticated}>
                    Apply Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <DialogHeader>
                        <DialogTitle>Apply for {job.title}</DialogTitle>
                        <DialogDescription>
                          Complete the application form below to apply for this position.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <FormField
                          control={form.control}
                          name="coverLetter"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cover Letter</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Introduce yourself and explain why you are a good fit for this position..."
                                  className="min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="resumeUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Resume URL</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://example.com/my-resume.pdf"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 (555) 123-4567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="additionalInfo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Information (Optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Any additional information you'd like to share..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsApplyDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={submitApplication.isPending}
                        >
                          {submitApplication.isPending ? 'Submitting...' : 'Submit Application'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              {!isAuthenticated && (
                <p className="text-sm text-muted-foreground text-center">
                  <Link href="/login">
                    <a className="text-primary hover:underline">Sign in</a>
                  </Link>{' '}
                  to apply for this position
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Job Details */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <Tabs defaultValue="description">
                <TabsList className="mb-6">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="space-y-4">
                  <h2 className="text-2xl font-semibold">Job Description</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{job.description}</p>
                </TabsContent>
                <TabsContent value="requirements" className="space-y-4">
                  <h2 className="text-2xl font-semibold">Requirements</h2>
                  <ul className="space-y-2">
                    {job.requirements && job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="responsibilities" className="space-y-4">
                  <h2 className="text-2xl font-semibold">Responsibilities</h2>
                  <ul className="space-y-2">
                    {job.responsibilities && job.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="benefits" className="space-y-4">
                  <h2 className="text-2xl font-semibold">Benefits</h2>
                  <ul className="space-y-2">
                    {job.benefits && job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
            <div className="lg:w-1/3">
              <div className="bg-card border rounded-lg p-6 sticky top-24">
                <h3 className="text-xl font-semibold mb-4">Job Overview</h3>
                <Separator className="mb-4" />
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Job Type</p>
                      <p className="text-muted-foreground">{job.jobType.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Building className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Department</p>
                      <p className="text-muted-foreground">{job.department.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Vacancies</p>
                      <p className="text-muted-foreground">{job.vacancies}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Briefcase className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Salary</p>
                      <p className="text-muted-foreground">{job.salary}</p>
                    </div>
                  </div>
                  {job.deadline && (
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Application Deadline</p>
                        <p className="text-muted-foreground">{new Date(job.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Posted</p>
                      <p className="text-muted-foreground">{new Date(job.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <Separator className="my-6" />
                <Link href={`/apply/${job.id}`}>
                  <Button className="w-full" disabled={!isAuthenticated}>
                    Apply Now
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    <Link href="/login">
                      <a className="text-primary hover:underline">Sign in</a>
                    </Link>{' '}
                    to apply for this position
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Jobs */}
      <section className="py-12 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Similar Jobs</h2>
            <Link href="/jobs">
              <Button variant="outline">View All Jobs</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* This would ideally be filled with related jobs from the API */}
            <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
              <p className="text-muted-foreground mb-2">Check out our other openings</p>
              <h3 className="text-xl font-semibold mb-4">Looking for more opportunities?</h3>
              <Link href="/jobs">
                <Button variant="outline" className="w-full">Browse All Jobs</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}