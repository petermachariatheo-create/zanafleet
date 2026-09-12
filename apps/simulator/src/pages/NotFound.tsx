import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
      <p className="text-gray-600">The requested simulator page does not exist.</p>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
      >
        Return to simulator home
      </button>
    </main>
  );
};

export default NotFound;
