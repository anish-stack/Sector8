import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export function useListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortBy, setSortBy] = useState('title');
  const [filterVerified, setFilterVerified] = useState(false);

  const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

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

  const sortedListings = useCallback(() => {
    return [...listings].sort((a, b) => {
      if (sortBy === 'title') {
        return a.listing.Title.localeCompare(b.listing.Title);
      }
      const aDiscount = a.listing.Items[0]?.Discount || 0;
      const bDiscount = b.listing.Items[0]?.Discount || 0;
      return bDiscount - aDiscount;
    });
  }, [listings, sortBy]);

  const filteredListings = useCallback(() => {
    const sorted = sortedListings();
    if (filterVerified) {
      return sorted.filter(item => item.shopDetails.ListingPlan !== 'Free');
    }
    return sorted;
  }, [sortedListings, filterVerified]);

  return {
    listings: filteredListings(),
    loading,
    error,
    sortBy,
    setSortBy,
    filterVerified,
    setFilterVerified
  };
}
