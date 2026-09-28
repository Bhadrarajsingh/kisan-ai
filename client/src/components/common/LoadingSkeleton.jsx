import React from 'react';

export const LoadingSkeleton = ({ count = 4, type = 'card' }) => {
  if (type === 'chart') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="h-6 w-1/3 bg-slate-200 rounded-md skeleton-shimmer"></div>
        <div className="h-64 w-full bg-slate-100 rounded-xl skeleton-shimmer"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <div className="flex justify-between items-center">
            <div className="w-10 h-10 rounded-xl bg-slate-200 skeleton-shimmer"></div>
            <div className="w-16 h-6 rounded-full bg-slate-200 skeleton-shimmer"></div>
          </div>
          <div className="h-8 w-24 bg-slate-200 rounded-md skeleton-shimmer"></div>
          <div className="h-4 w-3/4 bg-slate-100 rounded skeleton-shimmer"></div>
          <div className="h-2 w-full bg-slate-100 rounded-full skeleton-shimmer"></div>
        </div>
      ))}
    </div>
  );
};

export const ErrorState = ({ message = 'Failed to load live data', onRetry }) => {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3 text-xl">
        ⚠️
      </div>
      <h4 className="text-sm font-bold text-rose-900 mb-1">Notice</h4>
      <p className="text-xs text-rose-700 max-w-md mx-auto mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
};

export default LoadingSkeleton;
