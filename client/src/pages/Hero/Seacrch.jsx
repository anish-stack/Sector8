import React, { useState } from 'react';
import { Search } from 'lucide-react';

export function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href=`/search-offer?q=${query}`
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for anything..."
          className="w-full px-6 py-4 text-lg rounded-full border-2 border-green-500 
          bg-red-500/10 backdrop-blur-md text-white placeholder-white/70
          focus:outline-none focus:border-white focus:bg-red-500/20 transition-all
          shadow-lg"


        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2
                   hover:bg-white/10 rounded-full transition-all"
        >
          <Search className="w-6 h-6 text-white" />
        </button>
      </div>
    </form>
  );
}