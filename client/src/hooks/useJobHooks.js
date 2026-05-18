import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyJobs, getJobDetails, updateJobStatus, addServicesToJob, submitBill, updateMechanicLocation, getMechanicEarnings, generateFinalInvoice } from '../api/jobs.api';

export const useJobs = (status) => {
  return useQuery({
    queryKey: ['jobs', status],
    queryFn: () => getMyJobs(status),
  });
};

export const useJobDetails = (id) => {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: () => getJobDetails(id),
    enabled: !!id,
  });
};

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => updateJobStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs', id] });
    },
  });
};

export const useUpdateMechanicLocation = () => {
  return useMutation({
    mutationFn: ({ id, location }) => updateMechanicLocation(id, location),
  });
};

export const useSubmitBill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => submitBill(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs', id] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['earnings'] });
    },
  });
};

export const useMechanicEarnings = () => {
  return useQuery({
    queryKey: ['earnings'],
    queryFn: getMechanicEarnings,
  });
};

export const useGenerateFinalInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => generateFinalInvoice(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['jobs', id] });
      queryClient.invalidateQueries({ queryKey: ['earnings'] });
    },
  });
};
