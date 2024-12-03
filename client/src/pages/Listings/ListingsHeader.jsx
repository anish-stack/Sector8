import React from 'react'
import { ListFilter, SortAsc } from 'lucide-react';

const ListingsHeader = ({ total,
    sortBy,
    setSortBy,
    filterVerified,
    setFilterVerified}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Explore Listings</h1>
      <p className="text-gray-600 mt-1">Discover {total} amazing businesses</p>
    </div>

    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <SortAsc className="w-5 h-5 text-gray-500" />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option value="title">Sort by name</option>
          <option value="discount">Sort by discount</option>
        </select>
      </div>

      <button
        onClick={() => setFilterVerified(!filterVerified)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          filterVerified
            ? 'bg-purple-100 text-purple-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <ListFilter className="w-4 h-4" />
        Verified Only
      </button>
    </div>
  </div>

  )
}

export default ListingsHeader
