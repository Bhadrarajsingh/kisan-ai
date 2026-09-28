import React from 'react';
import { Link } from 'react-router-dom';
import { CloudRain, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-agri-100 text-agri-700 flex items-center justify-center mx-auto text-2xl font-black">
          404
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Page Not Found</h1>
        <p className="text-xs text-slate-600">
          The requested meteorological or agricultural route does not exist. Please return to the main dashboard.
        </p>
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-agri-600 hover:bg-agri-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
