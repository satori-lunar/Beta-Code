import { Navigate, useParams } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';

interface SlugProtectedRouteProps {
  children: React.ReactNode;
  requiredSlug?: string; // Optional: if provided, validates against a specific slug
  redirectTo?: string; // Where to redirect if slug is missing/invalid
}

export default function SlugProtectedRoute({ 
  children, 
  requiredSlug,
  redirectTo = '/'
}: SlugProtectedRouteProps) {
  const { slug } = useParams<{ slug: string }>();

  // If no slug in URL, deny access
  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4 bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            This page requires a valid access link. Please use the link provided to you.
          </p>
          <button
            onClick={() => window.location.href = redirectTo}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // If a specific slug is required, validate it
  if (requiredSlug && slug !== requiredSlug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4 bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Access Link</h1>
          <p className="text-gray-600 mb-6">
            The access link you used is not valid. Please check the link and try again.
          </p>
          <button
            onClick={() => window.location.href = redirectTo}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Slug is present and valid, allow access
  return <>{children}</>;
}

