import { Quantum } from 'ldrs/react';
import 'ldrs/react/Quantum.css';

interface LoaderProps {
  loading: boolean;
}

export const Loader = ({ loading }: LoaderProps) => {
  return (
    <div
      data-testid={loading.toString()}
      className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50'>
      <Quantum
        size='45'
        speed='1.75'
        color='black'
      />
    </div>
  );
};
