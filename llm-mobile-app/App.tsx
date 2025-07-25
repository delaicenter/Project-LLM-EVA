// App.tsx
import React from 'react';
import { AuthProvider } from './app/services';
import AppRoutes from './app/navigation/routes';

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}