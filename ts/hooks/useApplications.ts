import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '../lib/queryClient';
import type { Application, InsertApplication } from '@shared/schema';

// Get all applications for a user
export const useUserApplications = (userId: number) => {
  return useQuery({
    queryKey: ['applications', 'user', userId],
    queryFn: async () => {
      const response = await apiRequest(`/api/applications/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user applications');
      }
      
      const data = await response.json();
      return data.data as Application[];
    }
  });
};

// Get all applications for a job
export const useJobApplications = (jobId: number) => {
  return useQuery({
    queryKey: ['applications', 'job', jobId],
    queryFn: async () => {
      const response = await apiRequest(`/api/applications/job/${jobId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch job applications');
      }
      
      const data = await response.json();
      return data.data as Application[];
    }
  });
};

// Get a specific application by ID
export const useApplication = (id: number) => {
  return useQuery({
    queryKey: ['applications', id],
    queryFn: async () => {
      const response = await apiRequest(`/api/applications/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch application');
      }
      
      const data = await response.json();
      return data.data as Application;
    }
  });
};

// Submit a new application
export const useSubmitApplication = () => {
  return useMutation({
    mutationFn: async (applicationData: InsertApplication) => {
      const response = await apiRequest('/api/applications', {
        method: 'POST',
        body: JSON.stringify(applicationData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit application');
      }
      
      const data = await response.json();
      return data.data as Application;
    },
    onSuccess: (data) => {
      // Invalidate affected queries
      queryClient.invalidateQueries({ queryKey: ['applications', 'user', data.candidateId] });
      queryClient.invalidateQueries({ queryKey: ['applications', 'job', data.jobId] });
    }
  });
};

// Update application status
export const useUpdateApplicationStatus = () => {
  return useMutation({
    mutationFn: async ({ 
      id, 
      status 
    }: { 
      id: number; 
      status: Application['status']; 
    }) => {
      const response = await apiRequest(`/api/applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update application status');
      }
      
      const data = await response.json();
      return data.data as Application;
    },
    onSuccess: (data) => {
      // Invalidate affected queries
      queryClient.invalidateQueries({ queryKey: ['applications', data.id] });
      queryClient.invalidateQueries({ queryKey: ['applications', 'user', data.candidateId] });
      queryClient.invalidateQueries({ queryKey: ['applications', 'job', data.jobId] });
    }
  });
};