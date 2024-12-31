import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios'
const Header = ({ locationDetails }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [activeTab, setActiveTab] = useState('normal');
    const [searchInput, setSearchInput] = useState('');
    const [advancedSearchInput, setAdvancedSearchInput] = useState('');
    const [pincodeInput, setPincodeInput] = useState('');
    const ShopToken = localStorage.getItem('ShopToken')
    const PartnerToken = localStorage.getItem('B2bToken')

    const [data, setData] = useState([])
    const [city, setCity] = useState([])

    const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL

    const fetchData = async () => {
        try {
            const response = await axios.get(`${BackendUrl}/admin-get-categories`)
            const data = response.data.data
            setData(data)
        } catch (error) {
            console.log(error)
        }
    }
    const fetchCity = async () => {
        try {
            const response = await axios.get(`${BackendUrl}/admin-get-city`);
            const data = response.data
            setCity(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
        fetchCity()
    }, [])

    const location = useLocation()
    const [showTabs, setShowTabs] = useState()
    const handleShowTabs = () => {
        if (location.pathname === "/") {
            setShowTabs(true)
        } else {
            setShowTabs(false)
        }
    }
    useEffect(() => {
        handleShowTabs()
    }, [location.pathname])
    const handleSearch = () => {
        if (activeTab === 'normal') {
            const query = `?query=${searchInput}&city=${document.getElementById('city').value}&searchType=${activeTab}`;
            window.location.href = `/Search${query}`;
        } else if (activeTab === 'advanced') {
            const query = `?query=${advancedSearchInput}&city=${document.getElementById('city').value}&ShopCategory=${document.getElementById('category').value}&pincode=${pincodeInput}&searchType=${activeTab}`;
            window.location.href = `/Search${query}`;
        }
    };
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className='w-full shadow-md'>
            <div className='max-w-[1400px] flex items-center justify-between mx-auto px-3 py-4'>
                <div className="logo p-2">
                    <Link to={'/'} className='text-xl font-extrabold text-slate-900 md:text-2xl'>
                        Nai <span className='text-green-400'>Deal</span>
                    </Link>
                </div>
                <nav className="flex items-center gap-3">
                    <ul className='hidden md:flex items-center justify-center gap-3'>
                        <li><Link className='text-slate-900 font-bold text-lg' to={'/Advertise-With-us'}>Advertise</Link></li>
                        <li><Link className='text-slate-900 font-bold text-lg' to={'/Free-Listing'}>Free Listing</Link></li>
                        <li><a className='text-green-400 font-bold text-lg' href="tel:+919953825382">+91 99-5382-5382</a></li>
                        {ShopToken ? (
                            <li className='space-x-2'><a className='text-slate-900 font-bold text-lg' href="/Shop-Dashboard">Dashboard</a></li>
                        ) : null}
                        {PartnerToken ? (
                            <li className='space-x-2'><a className='text-slate-900 font-bold text-lg' href="/Partner-Dashboard">Partner Dashboard</a></li>
                        ) : null}
                        {
                            ShopToken || PartnerToken ? (null) : (
                                <li> <Link className='text-slate-900 space-x-3 font-bold text-lg' to="/Shop-login">Login</Link></li>

                            )
                        }                    </ul>
                    <div className="flex items-center md:hidden">
                        <button className="text-gray-700 focus:outline-none" onClick={toggleMenu}>
                            {showMenu ? (
                                <i className="fas fa-times fa-lg"></i>
                            ) : (
                                <i className="fas fa-bars fa-lg"></i>
                            )}
                        </button>
                    </div>
                </nav>
            </div>
            {showTabs ? (
                <>
                    <hr className='border-[0.5px] border-black max-w-[1400px] mx-auto bg-black' />

                    <div className='tabs w-full  mt-9 mx-auto flex items-center justify-around p-3'>
                        <div className='w-1/3' onDoubleClick={() => setActiveTab('')}>
                            <button
                                className={`bg-blue-500 text-white w-full  py-2 px-4 rounded-full shadow hover:bg-blue-600 transition-all duration-300 ${activeTab === 'normal' ? 'ring-2 ring-blue-300' : ''}`}
                                onClick={() => setActiveTab('normal')}

                            >
                                Search <i className="fas fa-search ml-3 fa-lg"></i>
                            </button>
                        </div>
                        <div className='w-1/3' onDoubleClick={() => setActiveTab('')}>
                            <button
                                className={`bg-green-500 text-white  w-full py-2 px-4 rounded-full shadow hover:bg-green-600 transition-all duration-300 ${activeTab === 'advanced' ? 'ring-2 ring-green-300' : ''}`}
                                onClick={() => setActiveTab('advanced')}

                            >
                                Advanced Search <i className="fa-brands fa-lg ml-3 fa-searchengin"></i>
                            </button>
                        </div>
                    </div>
                    {activeTab === 'normal' && (
                        <div className={`tab-search mb-5 grid grid-cols-1 md:gap-3 lg:grid-cols-3 md:grid-cols-3 max-w-7xl w-full mx-auto p-3`}>
                            <div className='md:mb-4 md:py-6 w-full'>
                                <label className='block text-gray-700 text-sm font-bold md:mb-2' htmlFor='city'>Select City</label>
                                <select id='city' className='block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline'>
                                    {locationDetails && locationDetails.city ? (
                                        <>
                                            <option value={locationDetails.city}>{locationDetails.city}</option>
                                            {city && city.map((city, index) => (
                                                <option key={index} value={city.cityName}>{city.cityName}</option>
                                            ))}
                                        </>
                                    ) : (
                                        city && city.map((city, index) => (
                                            <option key={index} value={city.cityName}>{city.cityName}</option>
                                        ))
                                    )}
                                </select>
                            </div>



                            <div className='md:mb-4 py-6 w-full'>
                                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='search'>Type What You Want</label>
                                <input
                                    id='search'
                                    type='text'
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className='shadow appearance-none border border-black rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                />
                            </div>
                            <div className='w-full md:py-6 block'>
                                <label className='block text-gray-700 text-sm font-bold' htmlFor='advanced-search'>&nbsp;</label>

                                <button
                                    className='bg-blue-500 w-full text-white py-2 px-4 rounded-full shadow hover:bg-blue-600 transition-all duration-300'
                                    onClick={handleSearch}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    )}
                    {activeTab === 'advanced' && (
                        <div className={`tab-search grid grid-cols-1 md:gap-3 md:grid-cols-4 lg:grid-cols-5 max-w-7xl mx-auto p-3`}>
                            <div className='md:mb-4 py-2 md:py-6 w-full'>
                                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='city'>Select City</label>
                                <select id='city' className='block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline'>
                                    {locationDetails && locationDetails.city ? (
                                        <>
                                            <option value={locationDetails.city}>{locationDetails.city}</option>
                                            {city && city.map((city, index) => (
                                                <option key={index} value={city.cityName}>{city.cityName}</option>
                                            ))}
                                        </>
                                    ) : (
                                        city && city.map((city, index) => (
                                            <option key={index} value={city.cityName}>{city.cityName}</option>
                                        ))
                                    )}
                                </select>

                            </div>
                            <div className='md:mb-4 py-2 md:py-6 w-full'>
                                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='pincode'>Pincode</label>
                                <input
                                    id='pincode'
                                    type='text'
                                    value={pincodeInput}
                                    onChange={(e) => setPincodeInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className='shadow appearance-none border rounded border-black w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                />
                            </div>

                            <div className='md:mb-4 py-2 md:py-6 w-full'>
                                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='category'>Select Categories</label>
                                <select id='category' className='block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline'>
                                    {data && data.map((category, index) => (
                                        <option key={index} value={category.CategoriesName}>{category.CategoriesName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='md:mb-4 py-2 md:py-6 w-full'>
                                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='advanced-search'>Type What You Want</label>
                                <input
                                    id='advanced-search'
                                    type='text'
                                    value={advancedSearchInput}
                                    onChange={(e) => setAdvancedSearchInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className='shadow appearance-none border-black border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                />
                            </div>
                            <div className='w-full md:py-6 block'>
                                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='advanced-search'>&nbsp;</label>

                                <button
                                    className='bg-green-500 w-full text-white py-2 px-4 rounded-full shadow hover:bg-green-600 transition-all duration-300'
                                    onClick={handleSearch}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (null)}

            {showMenu && (
                <ul className={`md:hidden absolute menu flex flex-col items-center gap-3 ${showMenu ? 'show' : ''}`}>
                    <li><Link className='text-slate-900 font-bold text-lg' to={'/Advertise-With-us'}>Advertise</Link></li>
                    <li><Link className='text-slate-900 font-bold text-lg' to={'/Free-Listing'}>Free Listing</Link></li>
                    <li><a className='text-green-400 font-bold text-lg' href="tel:7217619794">98XXXXXXXX</a></li>
                </ul>
            )}
        </div>
    );
};

export default Header;
