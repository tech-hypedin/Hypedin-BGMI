import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function useSubmitApplication() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (formData: any) => {
      // Hits your Express backend via the 'Smart Axios' instance
      const { data } = await api.post('/api/applications/submit', formData);
      return data;
    },
    onMutate: () => {
        toast.loading('UPLOADING INTEL TO COMMAND...', { id: 'submit-toast' });
    },
    onSuccess: (data) => {
      // Immediate feedback for the user
      toast.success(data.message, { id: 'submit-toast' });

      // setTimeout(() => {
      //   router.push('/');
      // }, 1500);
    },
    onError: (error: any) => {
      // Extract the error message from the Axios error object
      const errorMsg = error.response?.data?.message || 'SIGNAL INTERRUPTED';
      
      // Update the EXISTING toast to an error state instead of stacking a new one
      toast.error(errorMsg, { id: 'submit-toast' });
      
      console.error('Tactical Error:', errorMsg);
    }
  });
}