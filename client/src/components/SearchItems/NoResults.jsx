import React from 'react';
import { SearchX, PackageSearch, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const NoResults = ({ message }) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">

      
      <h2 className="mb-3 text-center text-2xl font-bold text-gray-800">
        We're Sorry! 😔
      </h2>
      
      <p className="mb-2 text-center text-lg text-gray-600">
        {message}
      </p>
      
      <p className="mb-8 text-center text-gray-500">
        Don't worry! We have many other amazing offers waiting for you
      </p>

      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
        >
          <PackageSearch className="h-5 w-5" />
          Go Back
        </button>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
        >
          Explore Other Offers
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          Try:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          <li>• Checking for spelling mistakes</li>
          <li>• Using more general keywords</li>
          <li>• Removing filters to see more results</li>
        </ul>
      </div>
    </div>
  );
};

export default NoResults;