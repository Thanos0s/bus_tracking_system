import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SearchBar = ({ onRouteSearch, onDestinationSelect, className = '' }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchRef = useRef(null);

  // Mock search suggestions
  const [suggestions, setSuggestions] = useState([]);
  
  const mockDestinations = [
    { id: 'dest1', name: 'Sector 17 Plaza', type: 'landmark', routes: ['42A', '15B', '8C'] },
    { id: 'dest2', name: 'PGI Hospital', type: 'hospital', routes: ['15B', '22D'] },
    { id: 'dest3', name: 'Railway Station', type: 'transport', routes: ['8C', '42A'] },
    { id: 'dest4', name: 'Chandigarh University', type: 'education', routes: ['25F', '18G'] },
    { id: 'dest5', name: 'Industrial Area Phase 1', type: 'business', routes: ['22D', '30H'] },
    { id: 'dest6', name: 'Sector 22 Market', type: 'shopping', routes: ['8C', '12K'] },
    { id: 'dest7', name: 'ISBT Sector 43', type: 'transport', routes: ['15B', '25F'] },
    { id: 'dest8', name: 'Elante Mall', type: 'shopping', routes: ['42A', '18G'] }
  ];

  const mockRoutes = [
    { number: '42A', name: 'Sector 17 - Railway Station', stops: 15 },
    { number: '15B', name: 'PGI - ISBT Sector 43', stops: 22 },
    { number: '8C', name: 'University - Sector 22', stops: 18 },
    { number: '22D', name: 'Industrial Area - Hospital', stops: 12 },
    { number: '25F', name: 'University - ISBT', stops: 20 },
    { number: '18G', name: 'Elante - University', stops: 16 }
  ];

  // Load search history from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('search-history') || '[]');
    setSearchHistory(history?.slice(0, 5)); // Keep only last 5 searches
  }, []);

  // Handle search input changes
  useEffect(() => {
    if (searchQuery?.length > 0) {
      setIsSearching(true);
      
      // Simulate API delay
      const timer = setTimeout(() => {
        const filteredDestinations = mockDestinations?.filter(dest =>
          dest?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        );
        
        const filteredRoutes = mockRoutes?.filter(route =>
          route?.number?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          route?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        );

        setSuggestions([
          ...filteredDestinations?.map(dest => ({ ...dest, category: 'destination' })),
          ...filteredRoutes?.map(route => ({ ...route, category: 'route' }))
        ]);
        
        setIsSearching(false);
        setShowSuggestions(true);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query = searchQuery) => {
    if (!query?.trim()) return;

    // Add to search history
    const newHistory = [query, ...searchHistory?.filter(item => item !== query)]?.slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('search-history', JSON.stringify(newHistory));

    // Trigger search
    onRouteSearch?.(query);
    setShowSuggestions(false);
    
    // Navigate to trip planner with search query
    navigate(`/trip-planner?destination=${encodeURIComponent(query)}`);
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion?.category === 'destination') {
      setSearchQuery(suggestion?.name);
      onDestinationSelect?.(suggestion);
      handleSearch(suggestion?.name);
    } else if (suggestion?.category === 'route') {
      navigate(`/route-details?route=${suggestion?.number}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'landmark': return 'MapPin';
      case 'hospital': return 'Cross';
      case 'transport': return 'Train';
      case 'education': return 'GraduationCap';
      case 'business': return 'Building';
      case 'shopping': return 'ShoppingBag';
      default: return 'MapPin';
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Input
          type="search"
          placeholder="Search destinations, routes, or stops..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          onKeyDown={(e) => {
            if (e?.key === 'Enter') {
              handleSearch();
            }
          }}
          className="pl-12 pr-12 h-12 text-base"
        />
        
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <Icon 
            name={isSearching ? "Loader" : "Search"} 
            size={20} 
            className={`text-muted-foreground ${isSearching ? 'animate-spin' : ''}`} 
          />
        </div>

        {/* Clear Button */}
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <Icon name="X" size={16} />
          </Button>
        )}
      </div>
      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-nav-strong z-150 max-h-96 overflow-y-auto">
          {/* Current Search */}
          {searchQuery && (
            <button
              onClick={() => handleSearch()}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-muted transition-colors border-b border-border"
            >
              <Icon name="Search" size={16} className="text-primary" />
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-card-foreground">
                  Search for "{searchQuery}"
                </div>
                <div className="text-xs text-muted-foreground">
                  Find routes and destinations
                </div>
              </div>
            </button>
          )}

          {/* Suggestions */}
          {suggestions?.length > 0 && (
            <div className="py-2">
              {suggestions?.map((suggestion, index) => (
                <button
                  key={`${suggestion?.category}-${suggestion?.id || suggestion?.number}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <Icon 
                      name={suggestion?.category === 'route' ? 'Bus' : getTypeIcon(suggestion?.type)} 
                      size={14} 
                      className="text-primary" 
                    />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-card-foreground">
                      {suggestion?.category === 'route' ? `Route ${suggestion?.number}` : suggestion?.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {suggestion?.category === 'route' 
                        ? `${suggestion?.name} • ${suggestion?.stops} stops`
                        : `${suggestion?.routes?.join(', ')} • ${suggestion?.type}`
                      }
                    </div>
                  </div>
                  
                  <Icon name="ArrowUpRight" size={14} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          )}

          {/* Search History */}
          {searchHistory?.length > 0 && !searchQuery && (
            <div className="py-2 border-t border-border">
              <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Recent Searches
              </div>
              {searchHistory?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(item);
                    handleSearch(item);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-muted transition-colors"
                >
                  <Icon name="Clock" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-card-foreground">{item}</span>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {suggestions?.length === 0 && searchQuery && !isSearching && (
            <div className="px-4 py-8 text-center text-muted-foreground">
              <Icon name="Search" size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No results found for "{searchQuery}"</p>
              <p className="text-xs mt-1">Try searching for bus routes, stops, or landmarks</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;