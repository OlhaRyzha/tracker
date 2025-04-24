import { AxiosError } from 'axios';

export const handleAxiosError = (error: unknown) => {
  if (error instanceof AxiosError) {
    return error?.response?.data?.error || 'An error occurred';
  }
  return 'An unknown error occurred';
};
