import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '../lib/queryClient';
import type { Job, InsertJob } from '@shared/schema';

export interface JobFilter {
  query?: string;
  department?: string;
  jobType?: string;
  active?: boolean;
}

export const useJobs = (filters?: JobFilter) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      // Build query string
      const params = new URLSearchParams();
      
      if (filters?.query) {
        params.append('query', filters.query);
      }
      
      if (filters?.department) {
        params.append('department', filters.department);
      }
      
      if (filters?.jobType) {
        params.append('jobType', filters.jobType);
      }
      
      if (filters?.active !== undefined) {
        params.append('active', filters.active.toString());
      }
      
      const queryString = params.toString();
      const url = `/api/jobs${queryString ? `?${queryString}` : ''}`;
      
      // Fetch jobs with the updated apiRequest syntax
      const response = await apiRequest(url);
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const data = await response.json();
      return data.data as Job[];
    }
  });
};

export const useJob = (id: number) => {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: async () => {
      const response = await apiRequest(`/api/jobs/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch job');
      }
      
      const data = await response.json();
      return data.data as Job;
    }
  });
};

export const useCreateJob = () => {
  return useMutation({
    mutationFn: async (jobData: InsertJob) => {
      const response = await apiRequest('/api/jobs', {
        method: 'POST',
        body: JSON.stringify(jobData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create job');
      }
      
      const data = await response.json();
      return data.data as Job;
    },
    onSuccess: () => {
      // Invalidate jobs cache to refresh data
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
};

export const useUpdateJob = (id: number) => {
  return useMutation({
    mutationFn: async (jobData: Partial<InsertJob>) => {
      const response = await apiRequest(`/api/jobs/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(jobData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update job');
      }
      
      const data = await response.json();
      return data.data as Job;
    },
    onSuccess: () => {
      // Invalidate specific job and jobs list cache
      queryClient.invalidateQueries({ queryKey: ['jobs', id] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
};