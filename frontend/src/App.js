import React, { useState, useEffect, createContext, useContext } from "react";
import "./App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Context for user preferences
const UserContext = createContext();

// Context for theme
const ThemeContext = createContext();

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Bell Icon Component (StockX style)
const BellIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C10.9 2 10 2.9 10 4V4.29C7.03 5.17 5 7.9 5 11V16L3 18V19H21V18L19 16V11C19 7.9 16.97 5.17 14 4.29V4C14 2.9 13.1 2 12 2ZM12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z"/>
  </svg>
);

// Search Icon Component
const SearchIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5S5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14Z"/>
  </svg>
);

// Cart Icon Component
const CartIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22S9 21.1 9 20S8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 3H1ZM17 18C15.9 18 15.01 18.9 15.01 20S15.9 22 17 22S19 21.1 19 20S18.1 18 17 18Z"/>
  </svg>
);

// Modern Theme Toggle Icon Component
const ThemeToggleIcon = ({ isDark, className }) => {
  if (isDark) {
    // Light mode icon (sun rays)
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
      </svg>
    );
  } else {
    // Dark mode icon (moon)
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"/>
      </svg>
    );
  }
};

// Category Icon Components - Temporary colorful icons (easily replaceable with your custom ones)
const CategoryIcons = {
  'makeup': ({ className }) => (
    <div className={`${className} flex items-center justify-center text-4xl bg-gradient-to-br from-pink-400 to-purple-500 rounded-full`}>
      💄
    </div>
  ),
  'high-tech': ({ className }) => (
    <div className={`${className} flex items-center justify-center text-4xl bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full`}>
      📱
    </div>
  ),
  'tiktok-trends': ({ className }) => (
    <div className={`${className} flex items-center justify-center text-4xl bg-gradient-to-br from-red-400 to-pink-500 rounded-full`}>
      📱
    </div>
  ),
  'fashion': ({ className }) => (
    <div className={`${className} flex items-center justify-center text-4xl bg-gradient-to-br from-orange-400 to-red-500 rounded-full`}>
      👗
    </div>
  ),
  'home-living': ({ className }) => (
    <div className={`${className} flex items-center justify-center text-4xl bg-gradient-to-br from-green-400 to-blue-500 rounded-full`}>
      🏠
    </div>
  ),
  'outdoor-garden': ({ className }) => (
    <div className={`${className} flex items-center justify-center text-4xl bg-gradient-to-br from-green-400 to-teal-500 rounded-full`}>
      🌿
    </div>
  ),
  'health-wellness': ({ className }) => (
    <div className={`${className} flex items-center justify-center text-4xl bg-gradient-to-br from-red-400 to-pink-500 rounded-full`}>
      💊
    </div>
  ),
  'sports-fitness': ({ className }) => (
    <div className={`${className} flex items-center justify-center text-4xl bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full`}>
      ⚽
    </div>
  ),
  'cooking': ({ className }) => (
    <div className={`${className} flex items-center justify-center text-4xl bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full`}>
      🍳
    </div>
  )
};

// Mobile Menu Component with FIXED scrolling and all categories visible
const MobileMenu = ({ isOpen, onClose, categories }) => {
  const { isDark } = useTheme();
  
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 md:hidden ${
          isOpen ? 'bg-opacity-50 opacity-100' : 'bg-opacity-0 opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Menu Panel with PROPER height for scrolling all categories */}
      <div className={`fixed top-0 left-0 h-full w-80 ${isDark ? 'bg-gray-900' : 'bg-white'} z-50 transform transition-transform duration-300 ease-out md:hidden shadow-2xl flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header - Fixed at top */}
        <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} trendly-font`}>Browse</h2>
            <button 
              onClick={onClose}
              className={`p-2 rounded-lg ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'} transition-colors`}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Categories - FIXED scrollable section with proper height calculation */}
        <div className="flex-1 overflow-y-auto px-6 py-4" style={{maxHeight: 'calc(100vh - 200px)'}}>
          <div className="space-y-4">
            {categories.map(category => {
              const IconComponent = CategoryIcons[category.id];
              return (
                <div
                  key={category.id}
                  className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    isDark 
                      ? 'hover:bg-gray-800 text-white' 
                      : 'hover:bg-gray-50 text-gray-800'
                  } group`}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    {IconComponent && <IconComponent className="w-12 h-12" />}
                  </div>
                  <span className="font-bold trendly-font text-base tracking-wide">{category.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Buttons - Fixed at bottom with REDUCED pink intensity */}
        <div className={`p-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} space-y-3 flex-shrink-0`}>
          <button className={`w-full py-3 px-4 border-2 ${isDark ? 'border-rose-300 text-rose-300 hover:bg-rose-300' : 'border-rose-400 text-rose-400 hover:bg-rose-400'} hover:text-white rounded-xl transition-all duration-200 font-medium trendly-font`}>
            Log In
          </button>
          <button className="w-full py-3 px-4 bg-gradient-to-r from-rose-400 to-pink-300 text-white rounded-xl hover:from-rose-500 hover:to-pink-400 transition-all duration-200 font-medium shadow-lg trendly-font">
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
};

// Location Selector Modal
const LocationSelector = ({ isOpen, onClose, onSelect }) => {
  const [countries, setCountries] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [countrySearch, setCountrySearch] = useState('');
  const [languageSearch, setLanguageSearch] = useState('');
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countriesRes, languagesRes] = await Promise.all([
          axios.get(`${API}/countries`),
          axios.get(`${API}/languages`)
        ]);
        setCountries(countriesRes.data.countries);
        setLanguages(languagesRes.data.languages);
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };
    if (isOpen) fetchData();
  }, [isOpen]);

  const handleCountryChange = (countryCode) => {
    const country = countries.find(c => c.code === countryCode);
    setSelectedCountry(countryCode);
    setSelectedCurrency(country?.currency || 'USD');
  };

  const handleCountryClick = (countryCode) => {
    handleCountryChange(countryCode);
    setCountrySearch('');
  };

  const handleLanguageClick = (languageCode) => {
    setSelectedLanguage(languageCode);
    setLanguageSearch('');
  };

  const handleConfirm = () => {
    const country = countries.find(c => c.code === selectedCountry);
    const language = languages.find(l => l.code === selectedLanguage);
    onSelect({
      country: selectedCountry,
      countryName: country?.name || '',
      countryFlag: country?.flag || '',
      language: selectedLanguage,
      languageName: language?.name || '',
      currency: selectedCurrency
    });
    onClose();
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredLanguages = languages.filter(language =>
    language.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
    language.code.toLowerCase().includes(languageSearch.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className={`${isDark ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'} rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border`}>
        <div className="text-center mb-6">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-2 trendly-font`}>Welcome to Trendly!</h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} trendly-font`}>Choose your location and preferences</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2 trendly-font`}>
              Ship to
            </label>
            <input
              type="text"
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              placeholder="Search countries..."
              className={`w-full p-3 border ${isDark ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500'} rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent mb-2 transition-all`}
            />
            <div className={`border ${isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'} rounded-xl max-h-40 overflow-y-auto`}>
              {filteredCountries.map(country => (
                <div
                  key={country.code}
                  onClick={() => handleCountryClick(country.code)}
                  className={`p-3 cursor-pointer hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} ${
                    selectedCountry === country.code ? (isDark ? 'bg-rose-700' : 'bg-rose-100') : ''
                  } flex items-center space-x-2 transition-colors`}
                >
                  <span>{country.flag}</span>
                  <span className="trendly-font">{country.name}</span>
                  {selectedCountry === country.code && <span className="ml-auto text-rose-500">✓</span>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2 trendly-font`}>
              Language
            </label>
            <input
              type="text"
              value={languageSearch}
              onChange={(e) => setLanguageSearch(e.target.value)}
              placeholder="Search languages..."
              className={`w-full p-3 border ${isDark ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500'} rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent mb-2 transition-all`}
            />
            <div className={`border ${isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'} rounded-xl max-h-40 overflow-y-auto`}>
              {filteredLanguages.map(language => (
                <div
                  key={language.code}
                  onClick={() => handleLanguageClick(language.code)}
                  className={`p-3 cursor-pointer hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} ${
                    selectedLanguage === language.code ? (isDark ? 'bg-rose-700' : 'bg-rose-100') : ''
                  } transition-colors`}
                >
                  <span className="trendly-font">{language.name}</span>
                  {selectedLanguage === language.code && <span className="ml-auto text-rose-500">✓</span>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2 trendly-font`}>
              Currency
            </label>
            <input
              type="text"
              value={selectedCurrency}
              readOnly
              className={`w-full p-3 border ${isDark ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-gray-50 text-gray-600'} rounded-xl trendly-font`}
            />
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full mt-6 bg-gradient-to-r from-rose-400 to-pink-300 text-white py-3 px-6 rounded-xl hover:from-rose-500 hover:to-pink-400 transition-all font-medium shadow-lg trendly-font"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

// Header Component with PERFECT mobile logo centering
const Header = ({ onLocationClick, onMenuClick }) => {
  const { userPrefs } = useUser();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b transition-all duration-300 sticky top-0 z-30`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button 
            onClick={onMenuClick}
            className={`md:hidden p-2 rounded-lg ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
          >
            <div className="w-5 h-5 flex flex-col justify-between">
              <span className="w-full h-0.5 bg-current"></span>
              <span className="w-full h-0.5 bg-current"></span>
              <span className="w-full h-0.5 bg-current"></span>
            </div>
          </button>

          {/* Logo - PERFECTLY CENTERED on all screen sizes */}
          <div className="flex items-center flex-1 justify-center">
            <h1 className="text-2xl font-black bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent trendly-logo tracking-tighter">
              Trendly
            </h1>
          </div>

          {/* Search Bar - Hidden on mobile, visible on tablet+ */}
          <div className="hidden sm:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trending products..."
                className={`w-full pl-4 pr-12 py-3 border ${isDark ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500'} rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all trendly-font`}
              />
              <button
                type="submit"
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-rose-400' : 'text-gray-400 hover:text-rose-600'} transition-colors`}
              >
                <SearchIcon className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications with professional bell icon */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-lg ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'} transition-colors relative`}
              >
                <BellIcon className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  3
                </span>
              </button>
            </div>

            {/* Location with border */}
            <button
              onClick={onLocationClick}
              className={`hidden sm:flex items-center space-x-1 text-sm px-3 py-2 border-2 ${isDark ? 'text-gray-300 hover:text-rose-400 border-gray-600 hover:border-rose-400' : 'text-gray-600 hover:text-rose-600 border-gray-300 hover:border-rose-500'} transition-all rounded-lg trendly-font font-medium`}
            >
              <span>{userPrefs.countryFlag}</span>
              <span>{userPrefs.currency}</span>
            </button>

            {/* Cart with border */}
            <button className={`flex items-center space-x-2 px-3 py-2 border-2 ${isDark ? 'text-gray-300 hover:text-rose-400 border-gray-600 hover:border-rose-400' : 'text-gray-600 hover:text-rose-600 border-gray-300 hover:border-rose-500'} transition-all rounded-lg`}>
              <div className="relative">
                <CartIcon className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-sm font-medium trendly-font">Cart</span>
            </button>

            {/* Auth buttons - REDUCED pink intensity */}
            <div className="hidden md:flex space-x-2">
              <button className={`px-4 py-2 text-sm ${isDark ? 'text-rose-300 hover:bg-gray-800 border-rose-300' : 'text-rose-400 hover:bg-rose-50 border-rose-400'} rounded-xl transition-colors border-2 trendly-font font-medium`}>
                Login
              </button>
              <button className="px-4 py-2 text-sm bg-gradient-to-r from-rose-400 to-pink-300 text-white rounded-xl hover:from-rose-500 hover:to-pink-400 transition-all shadow-lg trendly-font font-medium">
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="sm:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trending products..."
              className={`w-full pl-4 pr-12 py-3 border ${isDark ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500'} rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all trendly-font`}
            />
            <button
              type="submit"
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-rose-400' : 'text-gray-400 hover:text-rose-600'} transition-colors`}
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

// Categories Component with PROPER IMAGES in your style
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API}/categories`);
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-12 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* IMPROVED title with major e-commerce store styling */}
        <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-8 text-center trendly-category-title tracking-wide`}>
          Shop by Category
        </h2>
        {/* Mobile: 3 columns (3x3 grid for 9 categories), Desktop: up to 6 columns */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
          {categories.map(category => {
            const IconComponent = CategoryIcons[category.id];
            return (
              <div
                key={category.id}
                className="text-center cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg mx-auto hover:shadow-xl">
                  {IconComponent && <IconComponent className="w-16 h-16" />}
                </div>
                <div className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'} leading-relaxed max-w-24 mx-auto trendly-font tracking-wide`}>
                  {category.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  const { userPrefs } = useUser();
  const { isDark } = useTheme();
  
  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className={`${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1`}>
      <div className="relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-rose-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{discountPercentage}%
          </div>
        )}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-amber-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          Trending
        </div>
      </div>
      
      <div className="p-4">
        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-2 line-clamp-2 trendly-font`}>{product.name}</h3>
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3 line-clamp-2 trendly-font`}>{product.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold bg-gradient-to-r from-rose-500 to-pink-400 bg-clip-text text-transparent trendly-font">
              {userPrefs.currency} {product.price}
            </span>
            {product.original_price && (
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} line-through trendly-font`}>
                {userPrefs.currency} {product.original_price}
              </span>
            )}
          </div>
          <button className="bg-gradient-to-r from-rose-500 to-pink-400 text-white px-4 py-2 rounded-xl hover:from-rose-600 hover:to-pink-500 transition-all text-sm font-medium shadow-lg trendly-font">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// Floating Buttons Component with CLEAN theme toggle (NO PINK)
const FloatingButtons = () => {
  const { isDark, toggleTheme } = useTheme();
  const [showAssistant, setShowAssistant] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    
    setTimeout(() => {
      const responses = [
        "Hello! I'm here to help you with your shopping on Trendly. What can I assist you with?",
        "I'd be happy to help you find trending products or answer questions about our categories!",
        "Looking for something specific? I can help you search through our product catalog.",
        "Feel free to ask me about product recommendations, shipping, or any other questions!"
      ];
      const response = { text: responses[Math.floor(Math.random() * responses.length)], sender: 'assistant' };
      setMessages(prev => [...prev, response]);
    }, 1000);
    
    setInputMessage('');
  };

  return (
    <>
      {/* CLEAN Theme Toggle - NO PINK, just elegant grays */}
      <button
        onClick={toggleTheme}
        className={`fixed bottom-6 left-6 w-14 h-14 rounded-full ${
          isDark 
            ? 'bg-gradient-to-br from-slate-600 to-slate-800 hover:from-slate-500 hover:to-slate-700' 
            : 'bg-gradient-to-br from-gray-100 to-gray-300 hover:from-white hover:to-gray-200'
        } shadow-xl hover:shadow-2xl transition-all z-50 flex items-center justify-center group border-2 ${
          isDark ? 'border-slate-500/30' : 'border-gray-300/50'
        }`}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <ThemeToggleIcon isDark={isDark} className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-700'} group-hover:scale-110 transition-transform duration-200`} />
      </button>

      {/* Assistant Button - UPDATED icon */}
      <button
        onClick={() => setShowAssistant(!showAssistant)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-rose-500 to-pink-400 hover:from-rose-600 hover:to-pink-500 text-white shadow-xl hover:shadow-2xl transition-all z-50 flex items-center justify-center text-xl"
        title="Chat with AI assistant"
      >
        💬
      </button>

      {/* Assistant Chat Window */}
      {showAssistant && (
        <div className={`fixed bottom-24 right-6 w-80 h-96 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-rose-500 to-pink-400">
            <h3 className="font-semibold text-white trendly-font">AI Assistant</h3>
            <button
              onClick={() => setShowAssistant(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
              </svg>
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 && (
              <div className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm trendly-font`}>
                Hi! I'm your shopping assistant. Ask me anything!
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl max-w-xs ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-400 text-white ml-auto'
                    : isDark
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-800'
                } trendly-font text-sm`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className={`flex-1 p-2 border ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-800'} rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all trendly-font`}
              />
              <button
                onClick={handleSendMessage}
                className="px-3 py-2 bg-gradient-to-r from-rose-500 to-pink-400 text-white rounded-xl hover:from-rose-600 hover:to-pink-500 transition-all text-sm trendly-font"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Trending Products Component with professional styling
const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const { userPrefs } = useUser();
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await axios.get(`${API}/products/trending?country=${userPrefs.country}&limit=12`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      }
    };
    fetchTrendingProducts();
  }, [userPrefs.country]);

  return (
    <div className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-white'} transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 trendly-category-title tracking-wide`}>Trending Now</h2>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} trendly-font`}>Discover the hottest products everyone's talking about</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [userPrefs, setUserPrefs] = useState(() => {
    const saved = localStorage.getItem('trendly-user-prefs');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      country: 'US',
      countryName: 'United States',
      countryFlag: '🇺🇸',
      language: 'en',
      languageName: 'English',
      currency: 'USD'
    };
  });

  const [initialLoad, setInitialLoad] = useState(true);
  
  useEffect(() => {
    const saved = localStorage.getItem('trendly-user-prefs');
    if (!saved && initialLoad) {
      setShowLocationSelector(true);
    }
    setInitialLoad(false);
  }, [initialLoad]);

  // Theme state - Dark mode by default
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('trendly-theme');
    return saved === 'light' ? false : true; // Default to dark mode
  });

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('trendly-theme', newTheme ? 'dark' : 'light');
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API}/categories`);
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Initialize sample data
  useEffect(() => {
    const initSampleData = async () => {
      try {
        await axios.post(`${API}/init-sample-data`);
        console.log('Sample data initialized');
      } catch (error) {
        console.error('Error initializing sample data:', error);
      }
    };
    initSampleData();
  }, []);

  const handleLocationSelect = async (preferences) => {
    setUserPrefs(preferences);
    localStorage.setItem('trendly-user-prefs', JSON.stringify(preferences));
    
    try {
      await axios.post(`${API}/user-preferences`, {
        country: preferences.country,
        language: preferences.language,
        currency: preferences.currency
      });
      console.log('User preferences saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <UserContext.Provider value={{ userPrefs, setUserPrefs }}>
        <div className={`App min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-all duration-300`}>
          <LocationSelector
            isOpen={showLocationSelector}
            onClose={() => setShowLocationSelector(false)}
            onSelect={handleLocationSelect}
          />
          
          <MobileMenu 
            isOpen={showMobileMenu}
            onClose={() => setShowMobileMenu(false)}
            categories={categories}
          />
          
          <Header 
            onLocationClick={() => setShowLocationSelector(true)} 
            onMenuClick={() => setShowMobileMenu(true)}
          />
          <Categories />
          <TrendingProducts />
          
          <FloatingButtons />
          
          {/* Footer - CLEAN without external branding */}
          <footer className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-800'} py-12 border-t`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h3 className="text-3xl font-black bg-gradient-to-r from-rose-500 to-pink-400 bg-clip-text text-transparent mb-4 trendly-logo tracking-tighter">Trendly</h3>
              <p className="text-gray-400 trendly-font">Your one-stop shop for trending products worldwide</p>
            </div>
          </footer>
        </div>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;