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
    setCountrySearch(''); // Clear search after selection
  };

  const handleLanguageClick = (languageCode) => {
    setSelectedLanguage(languageCode);
    setLanguageSearch(''); // Clear search after selection
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

  // Filter countries and languages based on search
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
            <input
              type="text"
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              placeholder="Search countries..."
              className={`w-full p-3 border ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-800'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2`}
            />
            <div className={`border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} rounded-lg max-h-40 overflow-y-auto`}>
              {filteredCountries.map(country => (
                <div
                  key={country.code}
                  onClick={() => handleCountryClick(country.code)}
                  className={`p-3 cursor-pointer hover:${isDark ? 'bg-gray-600' : 'bg-gray-100'} ${
                    selectedCountry === country.code ? (isDark ? 'bg-blue-700' : 'bg-blue-100') : ''
                  } flex items-center space-x-2`}
                >
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                  {selectedCountry === country.code && <span className="ml-auto text-blue-500">✓</span>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Language
            </label>
            <input
              type="text"
              value={languageSearch}
              onChange={(e) => setLanguageSearch(e.target.value)}
              placeholder="Search languages..."
              className={`w-full p-3 border ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-800'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2`}
            />
            <div className={`border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} rounded-lg max-h-40 overflow-y-auto`}>
              {filteredLanguages.map(language => (
                <div
                  key={language.code}
                  onClick={() => handleLanguageClick(language.code)}
                  className={`p-3 cursor-pointer hover:${isDark ? 'bg-gray-600' : 'bg-gray-100'} ${
                    selectedLanguage === language.code ? (isDark ? 'bg-blue-700' : 'bg-blue-100') : ''
                  }`}
                >
                  <span>{language.name}</span>
                  {selectedLanguage === language.code && <span className="ml-auto text-blue-500">✓</span>}
                </div>
              ))}
            </div>
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
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">Trendly</h1>
          </div>

          {/* Enlarged Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trending products..."
                className={`w-full pl-4 pr-12 py-3 border ${isDark ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              />
              <button
                type="submit"
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-600'} transition-colors`}
              >
                🔍
              </button>
            </form>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications - StockX style */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-lg ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} transition-colors relative`}
              >
                🔔
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
              {showNotifications && (
                <div className={`absolute right-0 top-full mt-2 w-80 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg z-50`}>
                  <div className="p-4">
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-3`}>Notifications</h3>
                    <div className="space-y-3">
                      <div className={`p-3 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded`}>
                        <p className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>New trending product: LED Face Mask</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>2 hours ago</p>
                      </div>
                      <div className={`p-3 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded`}>
                        <p className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Price drop: Wireless Charging Pad</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Location */}
            <button
              onClick={onLocationClick}
              className={`flex items-center space-x-1 text-sm ${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}
            >
              <span>{userPrefs.countryFlag}</span>
              <span>{userPrefs.currency}</span>
            </button>

            {/* Cart with text */}
            <button className={`flex items-center space-x-2 ${isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>
              <div className="relative">
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium">Cart</span>
            </button>

            {/* Auth buttons - StockX style */}
            <div className="flex space-x-2">
              <button className={`px-4 py-2 text-sm ${isDark ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-50'} rounded-lg transition-colors border-2 border-blue-600`}>
                Login
              </button>
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
    <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-50'} py-8 transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-8 text-center`}>Shop by Category</h2>
        <div className="flex justify-center">
          <div className="grid grid-cols-5 md:grid-cols-10 gap-6">
            {categories.map(category => (
              <div
                key={category.id}
                className="text-center cursor-pointer group"
              >
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center text-white text-2xl mb-2 group-hover:scale-110 transition-transform shadow-lg`}>
                  {category.icon}
                </div>
                <div className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} leading-tight max-w-20`}>
                  {category.name}
                </div>
              </div>
            ))}
          </div>
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
    <div className={`${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden`}>
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
        <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'} mb-2 line-clamp-2`}>{product.name}</h3>
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3 line-clamp-2`}>{product.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-blue-600">
              {userPrefs.currency} {product.price}
            </span>
            {product.original_price && (
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} line-through`}>
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

// Floating Buttons Component
const FloatingButtons = () => {
  const { isDark, toggleTheme } = useTheme();
  const [showAssistant, setShowAssistant] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate ChatGPT response
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
      {/* Theme Toggle - Bottom Left */}
      <button
        onClick={toggleTheme}
        className={`fixed bottom-6 left-6 w-12 h-12 rounded-full ${isDark ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-800 hover:bg-gray-900'} text-white shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center`}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* Assistant Button - Bottom Right */}
      <button
        onClick={() => setShowAssistant(!showAssistant)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center"
        title="Chat with AI assistant"
      >
        🤖
      </button>

      {/* Assistant Chat Window */}
      {showAssistant && (
        <div className={`fixed bottom-24 right-6 w-80 h-96 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-xl z-50 flex flex-col`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>AI Assistant</h3>
            <button
              onClick={() => setShowAssistant(false)}
              className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 && (
              <div className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                Hi! I'm your shopping assistant. Ask me anything!
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg max-w-xs ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white ml-auto'
                    : isDark
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className={`flex-1 p-2 border ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-800'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              <button
                onClick={handleSendMessage}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
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
    <div className={`py-12 ${isDark ? 'bg-gray-900' : 'bg-white'} transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>🔥 Trending Now</h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Discover the hottest products everyone's talking about</p>
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

// Hero Section Component - Removed as requested

// Main App Component
function App() {
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [userPrefs, setUserPrefs] = useState(() => {
    // Load saved preferences from localStorage
    const saved = localStorage.getItem('trendly-user-prefs');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed;
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

  // Show location selector only if no saved preferences
  const [initialLoad, setInitialLoad] = useState(true);
  
  useEffect(() => {
    const saved = localStorage.getItem('trendly-user-prefs');
    if (!saved && initialLoad) {
      setShowLocationSelector(true);
    }
    setInitialLoad(false);
  }, [initialLoad]);

  // Theme state
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('trendly-theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('trendly-theme', newTheme ? 'dark' : 'light');
  };

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
    // Save to localStorage for persistence
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
        <div className={`App min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors`}>
          <LocationSelector
            isOpen={showLocationSelector}
            onClose={() => setShowLocationSelector(false)}
            onSelect={handleLocationSelect}
          />
          
          <Header onLocationClick={() => setShowLocationSelector(true)} />
          <Categories />
          <TrendingProducts />
          
          {/* Footer */}
          <footer className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-800 text-white'} py-8`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Trendly</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-400'}`}>Your one-stop shop for trending products worldwide</p>
            </div>
          </footer>
        </div>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;