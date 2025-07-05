'use client';

import { useState, useEffect } from 'react';
import { Search, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function SearchBar({ onSearch, loading, searchQuery, setSearchQuery }: SearchBarProps) {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const history = localStorage.getItem('zakat-search-history');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim() && query.length >= 3) {
      onSearch(query);
      addToHistory(query);
      setShowHistory(false);
    }
  };

  const addToHistory = (query: string) => {
    const updatedHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 5);
    setSearchHistory(updatedHistory);
    localStorage.setItem('zakat-search-history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('zakat-search-history');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearInput = () => {
    setSearchQuery('');
    setShowHistory(false);
  };

  return (
    <div className="bg-white shadow-lg -mt-8 mx-4 sm:mx-6 lg:mx-8 relative z-10 rounded-lg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Zekât konularında arama yapın... (en az 3 karakter)"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                onFocus={() => setShowHistory(searchHistory.length > 0)}
                onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                className="pl-10 pr-10 py-3 text-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                disabled={loading}
              />
              {searchQuery && (
                <button
                  onClick={handleClearInput}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <Button
              onClick={() => handleSearch(searchQuery)}
              disabled={loading || searchQuery.length < 3}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Arıyor...
                </div>
              ) : (
                'Ara'
              )}
            </Button>
          </div>

          {/* Search History */}
          {showHistory && searchHistory.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 z-20">
              <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Arama Geçmişi
                </div>
                <button
                  onClick={clearHistory}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Temizle
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(item);
                      handleSearch(item);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 border-b border-gray-50 last:border-b-0"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Arama ipucu */}
        {searchQuery.length > 0 && searchQuery.length < 3 && (
          <div className="mt-2 text-sm text-gray-500 text-center">
            Arama yapmak için en az 3 karakter girmelisiniz
          </div>
        )}
      </div>
    </div>
  );
}