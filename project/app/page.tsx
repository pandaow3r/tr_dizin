'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import ResultsContainer from '@/components/ResultsContainer';
import Footer from '@/components/Footer';
import { useDebounce } from '@/hooks/useDebounce';
import { fetchResearch } from '@/lib/api';

interface Research {
  title: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Research[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce süresini 800ms'ye çıkarıyoruz ki kullanıcı yazmayı bitirsin
  const debouncedSearchQuery = useDebounce(searchQuery, 800);

  useEffect(() => {
    // Minimum 3 karakter olması gerekiyor ve boş değilse arama yap
    if (debouncedSearchQuery.trim() && debouncedSearchQuery.length >= 3) {
      handleSearch(debouncedSearchQuery);
    } else if (debouncedSearchQuery.trim() === '') {
      setResults([]);
      setHasSearched(false);
      setError(null);
    }
  }, [debouncedSearchQuery]);

  const handleSearch = async (query: string) => {
    if (!query.trim() || query.length < 3) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await fetchResearch(query);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setHasSearched(false);
    setError(null);
  };

  const handleRetry = () => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="relative">
        <SearchBar
          onSearch={handleSearch}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <ResultsContainer
          results={results}
          loading={loading}
          error={error}
          searchQuery={searchQuery}
          onClearSearch={handleClearSearch}
          onRetry={handleRetry}
        />
      </main>

      <Footer />
    </div>
  );
}