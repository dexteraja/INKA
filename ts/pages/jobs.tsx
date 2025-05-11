import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useJobs } from '@/hooks/useJobs';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { 
  ChevronRight, 
  Search, 
  Briefcase, 
  MapPin, 
  Clock, 
  Building 
} from 'lucide-react';

export default function JobsList() {
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');

  // Apply filters
  const { data: jobs, isLoading } = useJobs({
    query: searchQuery,
    department: departmentFilter || undefined,
    jobType: jobTypeFilter || undefined,
  });

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will be sent automatically due to state changes
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary/10 py-12">
        <div className="container px-4 mx-auto">
          <h1 className="text-4xl font-bold mb-4">Karir Perkeretaapian</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Jelajahi lowongan pekerjaan terkini di PT INKA dan bergabunglah dengan tim profesional kami dalam membentuk masa depan transportasi kereta api Indonesia.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b">
        <div className="container px-4 mx-auto">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-2">
              <div className="relative">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  placeholder="Search jobs by title or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
            </div>
            <div>
              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="customer_service">Customer Service</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={jobTypeFilter}
                onValueChange={setJobTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Job Types</SelectItem>
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((index) => (
                <Card key={index} className="animate-pulse">
                  <CardHeader>
                    <div className="h-7 bg-muted rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-4"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-10 bg-muted rounded w-1/4"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : jobs && jobs.length > 0 ? (
            <div className="space-y-6">
              {jobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {job.department.replace('_', ' ')}
                            </span>
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                              {job.jobType.replace('_', ' ')}
                            </span>
                          </div>
                          <CardTitle className="text-2xl">{job.title}</CardTitle>
                        </div>
                        <div className="text-right">
                          <CardDescription className="text-sm">Posted: {new Date(job.createdAt).toLocaleDateString()}</CardDescription>
                          {job.deadline && (
                            <CardDescription className="text-sm">
                              Deadline: {new Date(job.deadline).toLocaleDateString()}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{job.shortDescription}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {job.vacancies} {job.vacancies === 1 ? 'opening' : 'openings'}
                        </div>
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          {job.department.replace('_', ' ')}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {job.jobType.replace('_', ' ')}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/20 flex justify-between">
                      <div className="text-primary font-medium">{job.salary}</div>
                      <Button variant="ghost" className="gap-2">
                        View Details <ChevronRight className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No matching jobs found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Try adjusting your search filters or check back later for new opportunities.
              </p>
              {(searchQuery || departmentFilter || jobTypeFilter) && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setDepartmentFilter('');
                    setJobTypeFilter('');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}