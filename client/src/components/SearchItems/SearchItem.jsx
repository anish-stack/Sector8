import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import SearchItemHeader from './SearchItemHeader';
import SearchCard from './SearchCard';
import NoResults from './NoResults';

const SearchItem = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [safeMsg, setSafeMsg] = useState('');

  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const sort = searchParams.get('sort');
  const discount = searchParams.get('discount');
  const price = searchParams.get('price');


  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      // Add filters to the API call
      const params = new URLSearchParams({
        q: query,
        ...(sort && { sort }),
        ...(discount && { discount }),
        ...(price && { price }),
      });

      const { data: response } = await axios.get(
        `https://api.naideal.com/api/v1/Other/search_min?${params.toString()}`
      );
      console.log(response.data)
      if (response.data.length > 0) {

        let sortedData = [...response.data];
        if (sort === 'price_high') {
          sortedData.sort((a, b) => b.Items[0]?.MrpPrice - a.Items[0]?.MrpPrice);
        } else if (sort === 'price_low') {
          sortedData.sort((a, b) => a.Items[0]?.MrpPrice - b.Items[0]?.MrpPrice);
        } else if (sort === 'discount_high') {
          sortedData.sort((a, b) => b.Items[0]?.Discount - a.Items[0]?.Discount);
        } else if (sort === 'oldest') {
          sortedData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
        if (response.show === true) {
          setSafeMsg(response.message)
        } else {
          setSafeMsg('')
        }
        setData(sortedData);

      } else {
        setError('No results found');
      }
    } catch (err) {
      console.log(err)
      setError('Error in fetching data');
      // toast.error('Failed to fetch search results');
    } finally {
      setLoading(false);
    }
  }, [query, sort, discount, price]);

  useEffect(() => {
    if (query) {
      fetchData();
    }
  }, [query, fetchData]);

  if (!query) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <h2 className="text-xl font-semibold text-gray-600">
          Enter a search query to begin
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchItemHeader />
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <NoResults message={error} />
        ) : (
          <>
            {safeMsg && (
              <div className="bg-green-100 border border-green-400 text-green-700 rounded-md p-4 mb-4">
                <p className="text-sm font-medium">{safeMsg}</p>
              </div>
            )}

            <SearchCard data={data} />
          </>
        )}
      </div>
    </div>
  );
};

export default SearchItem;