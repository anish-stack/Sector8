import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

const SearchItemHeader = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [showFilters, setShowFilters] = useState(false);

    const currentSort = searchParams.get('sort') || 'newest';
    const currentDiscount = searchParams.get('discount') || 'all';
    const currentPrice = searchParams.get('price') || 'all';

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            const params = { q: searchTerm };
            if (currentSort !== 'newest') params.sort = currentSort;
            if (currentDiscount !== 'all') params.discount = currentDiscount;
            if (currentPrice !== 'all') params.price = currentPrice;
            setSearchParams(params);
        }
    };

    const handleSort = (value) => {
        const params = new URLSearchParams(searchParams);
        if (value === 'newest') {
            params.delete('sort');
        } else {
            params.set('sort', value);
        }
        setSearchParams(params);
    };

    const handleFilter = (type, value) => {
        const params = new URLSearchParams(searchParams);
        if (value === 'all') {
            params.delete(type);
        } else {
            params.set(type, value);
        }
        setSearchParams(params);
    };

    const clearFilters = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.set('q', searchTerm);
        setSearchParams(params);
    };

    const hasActiveFilters = currentSort !== 'newest' || currentDiscount !== 'all' || currentPrice !== 'all';

    return (
        <div className="sticky top-0 z-10 bg-white shadow-md">
            <div className="container mx-auto px-4 py-3">
                <div className="flex flex-col space-y-3 lg:space-y-0">
                    {/* Search Bar Row */}
                    <div className="flex items-center gap-2">
                        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                            <div className="relative flex-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">

                                    <i className="fa-solid fa-magnifying-glass h-5 w-5 text-gray-400"></i>
                                </div>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search products, shops, categories..."
                                    className="block w-full rounded-lg border-0 py-3 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                                Search
                            </button>
                        </form>

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 lg:hidden"
                        >
                            <SlidersHorizontal className="h-5 w-5" />
                            <span className="hidden sm:inline">Filters</span>
                        </button>
                    </div>

                    {/* Filters Row */}
                    <div
                        className={`flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between ${showFilters ? 'block' : 'hidden lg:flex'
                            }`}
                    >
                        <div className="flex flex-1 mt-5 flex-col gap-3 sm:flex-row sm:items-center">
                            {/* Sort Dropdown */}
                            <div className="relative flex-1 sm:max-w-[200px]">
                                <select
                                    value={currentSort}
                                    onChange={(e) => handleSort(e.target.value)}
                                    className="block w-full appearance-none rounded-lg border-0 bg-white py-2.5 pl-4 pr-8 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="price_high">Price: High to Low</option>
                                    <option value="price_low">Price: Low to High</option>
                                    <option value="discount_high">Highest Discount</option>
                                </select>
                                <ArrowUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>

                            {/* Discount Filter */}
                            <div className="relative flex-1 sm:max-w-[200px]">
                                <select
                                    value={currentDiscount}
                                    onChange={(e) => handleFilter('discount', e.target.value)}
                                    className="block w-full appearance-none rounded-lg border-0 bg-white py-2.5 pl-4 pr-8 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Discounts</option>
                                    <option value="50plus">50% & Above</option>
                                    <option value="30plus">30% & Above</option>
                                    <option value="20plus">20% & Above</option>
                                </select>
                                <ArrowUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>

                            {/* Price Filter */}
                            <div className="relative flex-1 sm:max-w-[200px]">
                                <select
                                    value={currentPrice}
                                    onChange={(e) => handleFilter('price', e.target.value)}
                                    className="block w-full appearance-none rounded-lg border-0 bg-white py-2.5 pl-4 pr-8 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Prices</option>
                                    <option value="under500">Under ₹500</option>
                                    <option value="500to1000">₹500 - ₹1000</option>
                                    <option value="1000plus">Above ₹1000</option>
                                </select>
                                <ArrowUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="inline-flex mt-4 items-center gap-2 rounded-lg border border-gray-300 bg-green-400 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-600"
                            >
                                <X className="h-4 w-4" />
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchItemHeader;