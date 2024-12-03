import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

export function useListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortBy, setSortBy] = useState('title');
  const [filterVerified, setFilterVerified] = useState(false);

  const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  // Fetch Data
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${BackendUrl}/get-Listing`);
      setListings(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError(true);
      setLoading(false);
    }
  }, [BackendUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sorting logic
  const sortedListings = useCallback(() => {
    if (!listings || listings.length === 0) {
      return [];
    }

    return [...listings].sort((a, b) => {
      if (sortBy === 'title') {
        const aTitle = a?.listing?.Title || '';
        const bTitle = b?.listing?.Title || '';
        return aTitle.localeCompare(bTitle);
      }

      const aDiscount = a?.listing?.Items?.[0]?.Discount || 0;
      const bDiscount = b?.listing?.Items?.[0]?.Discount || 0;
      return bDiscount - aDiscount;
    });
  }, [listings, sortBy]);

  // Filtering logic
  const filteredListings = useMemo(() => {
    const sorted = sortedListings(); 
    console.log(sorted)
    if (filterVerified) {
      return sorted.filter(item => item?.ListingPlan !== 'Free'); // Adjusted based on the data structure
    }

    return sorted; // If no filter is applied, return the sorted listings
  }, [sortedListings, filterVerified]);

  return {
    listings: filteredListings,
    loading,
    error,
    sortBy,
    setSortBy,
    filterVerified,
    setFilterVerified,
  };
}
