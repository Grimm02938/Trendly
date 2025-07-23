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

// Location Selector Modal
const LocationSelector = ({ isOpen, onClose, onSelect }) => {
  const [countries, setCountries] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto`}>
        <div className="text-center mb-6">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>Welcome to Trendly!</h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Choose your location and preferences</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Ship to
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className={`w-full p-3 border ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-800'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className={`w-full p-3 border ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-800'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              {languages.map(language => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Currency
            </label>
            <input
              type="text"
              value={selectedCurrency}
              readOnly
              className={`w-full p-3 border ${isDark ? 'border-gray-600 bg-gray-600 text-gray-300' : 'border-gray-300 bg-gray-50 text-gray-600'} rounded-lg`}
            />
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

// Header Component
const Header = ({ onLocationClick }) => {
  const { userPrefs } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">Trendly</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trending products..."
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
              >
                🔍
              </button>
            </form>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Location */}
            <button
              onClick={onLocationClick}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600"
            >
              <span>{userPrefs.countryFlag}</span>
              <span>{userPrefs.currency}</span>
            </button>

            {/* Cart */}
            <button className="relative p-2 text-gray-600 hover:text-blue-600">
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth buttons */}
            <div className="flex space-x-2">
              <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                Login
              </button>
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Categories Component
const Categories = () => {
  const [categories, setCategories] = useState([]);

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
    <div className="bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
          {categories.map(category => (
            <div
              key={category.id}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer text-center"
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="text-sm font-medium text-gray-700">{category.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  const { userPrefs } = useUser();
  
  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
            -{discountPercentage}%
          </div>
        )}
        <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs">
          🔥 Trending
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-blue-600">
              {userPrefs.currency} {product.price}
            </span>
            {product.original_price && (
              <span className="text-sm text-gray-500 line-through">
                {userPrefs.currency} {product.original_price}
              </span>
            )}
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// Trending Products Component
const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const { userPrefs } = useUser();

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
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">🔥 Trending Now</h2>
          <p className="text-gray-600">Discover the hottest products everyone's talking about</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover What's
              <span className="block text-yellow-300">Trending</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              From viral TikTok finds to must-have gadgets - shop the latest trends at unbeatable prices
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Shop Now
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
                View Trending
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1530735038726-a73fd6e6a349?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwxfHxzaG9wcGluZ3xlbnwwfHx8Ymx1ZXwxNzUzMTQ4NDE3fDA&ixlib=rb-4.1.0&q=85"
              alt="Trending Shopping"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [showLocationSelector, setShowLocationSelector] = useState(true);
  const [userPrefs, setUserPrefs] = useState({
    country: 'US',
    countryName: 'United States',
    countryFlag: '🇺🇸',
    language: 'en',
    languageName: 'English',
    currency: 'USD'
  });

  // Initialize sample data on app load
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
    
    try {
      await axios.post(`${API}/user-preferences`, {
        country: preferences.country,
        language: preferences.language,
        currency: preferences.currency
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userPrefs, setUserPrefs }}>
      <div className="App min-h-screen bg-gray-50">
        <LocationSelector
          isOpen={showLocationSelector}
          onClose={() => setShowLocationSelector(false)}
          onSelect={handleLocationSelect}
        />
        
        <Header onLocationClick={() => setShowLocationSelector(true)} />
        <HeroSection />
        <Categories />
        <TrendingProducts />
        
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Trendly</h3>
            <p className="text-gray-400">Your one-stop shop for trending products worldwide</p>
          </div>
        </footer>
      </div>
    </UserContext.Provider>
  );
}

export default App;