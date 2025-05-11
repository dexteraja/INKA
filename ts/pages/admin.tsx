import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { useJobs } from '@/hooks/useJobs';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Job, Application, User } from '@shared/schema';

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  // Fetch jobs data
  const { data: jobs, isLoading: isLoadingJobs } = useJobs();
  
  // Fetch applications data
  const { data: applications, isLoading: isLoadingApplications } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const response = await apiRequest('/api/applications');
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const data = await response.json();
      return data.data as Application[];
    },
    enabled: isAdmin // Only fetch if user is admin
  });
  
  // Fetch users data
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiRequest('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      return data.data as User[];
    },
    enabled: isAdmin // Only fetch if user is admin
  });
  
  // Check if user is admin, redirect if not
  useEffect(() => {
    if (user && !isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access the admin panel.',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [user, isAdmin, navigate, toast]);
  
  // Stats calculation
  const totalJobs = jobs?.length || 0;
  const activeJobs = jobs?.filter(job => job.isActive).length || 0;
  const totalApplications = applications?.length || 0;
  const totalUsers = users?.length || 0;
  
  const isLoading = isLoadingJobs || isLoadingApplications || isLoadingUsers;

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Mengelola platform rekrutmen PT INKA
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">{totalJobs}</span>
                  <span className="text-muted-foreground">Total Jobs</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">{activeJobs}</span>
                  <span className="text-muted-foreground">Active Jobs</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">{totalApplications}</span>
                  <span className="text-muted-foreground">Applications</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">{totalUsers}</span>
                  <span className="text-muted-foreground">Registered Users</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs for different admin sections */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="jobs">Manage Jobs</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Applications</CardTitle>
                    <CardDescription>
                      Latest job applications received
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {applications && applications.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {applications.slice(0, 5).map((application) => (
                            <TableRow key={application.id}>
                              <TableCell className="font-medium">
                                {application.candidateId}
                              </TableCell>
                              <TableCell>
                                {jobs?.find(job => job.id === application.jobId)?.title || 'Unknown Job'}
                              </TableCell>
                              <TableCell>
                                <Badge variant={application.status === 'rejected' ? 'destructive' : 'default'}>
                                  {application.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(application.createdAt).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        No applications found
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Jobs</CardTitle>
                    <CardDescription>
                      Latest job postings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {jobs && jobs.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Applications</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {jobs.slice(0, 5).map((job) => (
                            <TableRow key={job.id}>
                              <TableCell className="font-medium">
                                {job.title}
                              </TableCell>
                              <TableCell>
                                {job.department}
                              </TableCell>
                              <TableCell>
                                <Badge variant={job.isActive ? 'default' : 'secondary'}>
                                  {job.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {applications?.filter(app => app.jobId === job.id).length || 0}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        No jobs found
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Jobs Tab */}
            <TabsContent value="jobs">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>All Jobs</CardTitle>
                    <CardDescription>
                      Manage job listings across the platform
                    </CardDescription>
                  </div>
                  <Button onClick={() => navigate('/admin/jobs/new')}>
                    Add New Job
                  </Button>
                </CardHeader>
                <CardContent>
                  {jobs && jobs.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Applications</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobs.map((job) => (
                          <TableRow key={job.id}>
                            <TableCell className="font-medium">
                              {job.title}
                            </TableCell>
                            <TableCell>
                              {job.department}
                            </TableCell>
                            <TableCell>
                              {job.jobType}
                            </TableCell>
                            <TableCell>
                              {job.location}
                            </TableCell>
                            <TableCell>
                              <Badge variant={job.isActive ? 'default' : 'secondary'}>
                                {job.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {applications?.filter(app => app.jobId === job.id).length || 0}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/jobs/edit/${job.id}`)}>
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No jobs found. Get started by adding your first job posting.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Applications Tab */}
            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>All Applications</CardTitle>
                  <CardDescription>
                    Review and manage candidate applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {applications && applications.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Applicant ID</TableHead>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Applied On</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applications.map((application) => (
                          <TableRow key={application.id}>
                            <TableCell className="font-medium">
                              {application.candidateId}
                            </TableCell>
                            <TableCell>
                              {jobs?.find(job => job.id === application.jobId)?.title || 'Unknown Job'}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  application.status === 'hired' ? 'default' :
                                  application.status === 'rejected' ? 'destructive' :
                                  application.status === 'offer' ? 'outline' : 'secondary'
                                }
                              >
                                {application.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(application.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/applications/${application.id}`)}>
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No applications have been submitted yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>
                      Manage users and access rights
                    </CardDescription>
                  </div>
                  <Button onClick={() => navigate('/admin/users/new')}>
                    Add New User
                  </Button>
                </CardHeader>
                <CardContent>
                  {users && users.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name/Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Registered On</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{user.username}</span>
                                <span className="text-sm text-muted-foreground">{user.email}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.role === 'admin' ? 'outline' : 'secondary'}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant="default">
                                Active
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/users/edit/${user.id}`)}>
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                                  Disable
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No users found. Get started by adding your first user.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}