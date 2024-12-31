import React from 'react'
import { useListings } from './useListings';
import ListingsHeader from './ListingsHeader';
import ListingCard from './ListingCard';
import { LoadingSkeleton } from './LoadingSkeleton';

const AllListing = ({ limit }) => {
  const {
    listings,
    loading,
    error,
    sortBy,
    setSortBy,
    filterVerified,
    setFilterVerified
  } = useListings();
  console.log(listings)
  if (loading) {
    return <LoadingSkeleton />;
  }
  if (error) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <ListingsHeader
          total={listings.length}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterVerified={filterVerified}
          setFilterVerified={setFilterVerified}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings && listings.length > 0 ? (
            listings.slice(0, limit).map((item, index) => (
              <ListingCard key={item._id} item={item} index={index} />
            ))
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No listings found</h2>
              <p className="text-gray-600">Please try a different search or filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllListing
