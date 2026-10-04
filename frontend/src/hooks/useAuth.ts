import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import api from '@/lib/api';

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: any) => {
    	const { data } = await api.post('/api/auth/login', credentials);

      	return data;
    },
    onMutate: () => {
    	toast.loading('AUTHENTICATING CREDENTIALS...', { id: 'auth-toast' });
    },
    onSuccess: (data) => {
    	toast.success(data.message || 'ACCESS GRANTED', { id: 'auth-toast' });

		  localStorage.setItem('userId', data.resUser?._id);

		  const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get('from');

      if (redirectUrl) {
        router.replace(decodeURIComponent(redirectUrl));
      } else if (data.resUser?.role === 'Admin') {
        router.replace('/admin');
      } else if (data.resUser?.role === 'Ambassador') {
        router.replace('/dashboard');
      } else if (data.resUser?.role === 'Manager') {
        router.replace('/manager');
      } else {
        router.replace('/');
      }
    },
    onError: (error: any) => {
    	const errorMsg = error.response?.data?.message || 'LOGIN FAILED: UNAUTHORIZED';
		console.log(error);
    	toast.error(errorMsg, { id: 'auth-toast' });
    }
  });
}