import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-3xl mb-4 shadow-glass border border-blue-200">
        404
      </div>
      <h2 className="text-2xl font-black text-blue-950">Page Not Found</h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm">
        The requested residential screen does not exist or has been moved.
      </p>
      <div className="mt-6">
        <Link to="/dashboard">
          <Button variant="primary" icon={Home}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
