import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 text-center bg-white">
      <h1 className="text-9xl font-black text-brand-black tracking-tighter mb-4 opacity-10">404</h1>
      <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-4 uppercase tracking-tight">
        Page Not Found
      </h2>
      <p className="text-gray-500 text-lg max-w-md mx-auto mb-8">
        The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg">
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
