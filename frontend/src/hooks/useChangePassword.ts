import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export function useChangePassword() {
    return useMutation({
        mutationFn: async (passwords: { oldPassword: string, newPassword: string }) => {
            const { data } = await api.post('/api/auth/change', passwords);
            return data;
        },
        onMutate: () => {
            toast.loading('CHANGING ACCESS PROTOCOL', { id: 'change-toast' });
        },
        onSuccess: (data: any) => {
            toast.success(data.message || 'CHANGED PROTOCOL', { id: 'change-toast' });
        },
        onError: (error: any) => {
            const errorMsg = error.response?.data?.message || 'PROTOCOL CHANGE FAILED';
      toast.error(errorMsg, { id: 'change-toast' });
        }
    });
}