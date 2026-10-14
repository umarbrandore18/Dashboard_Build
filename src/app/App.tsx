import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { FilterProvider } from '@/context/FilterContext';
import { ToastProvider } from '@/context/ToastContext';
import { AppRoutes } from './routes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <FilterProvider>
          <AppRoutes />
        </FilterProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};
export default App;

