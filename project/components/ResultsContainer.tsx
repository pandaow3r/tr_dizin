'use client';

import { FileText, Wifi, WifiOff, AlertTriangle, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import ResultCard from './ResultCard';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import { testApiConnection } from '@/lib/api';

interface Research {
  title: string;
  authors?: string[];
  year?: string;
  abstract?: string;
  doi?: string;
  url?: string;
}

interface ResultsContainerProps {
  results: Research[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  onClearSearch: () => void;
  onRetry: () => void;
}

export default function ResultsContainer({
  results,
  loading,
  error,
  searchQuery,
  onClearSearch,
  onRetry,
}: ResultsContainerProps) {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [showApiWarning, setShowApiWarning] = useState(false);

  useEffect(() => {
    // N8N API durumunu kontrol et
    const checkApi = async () => {
      const isOnline = await testApiConnection();
      const newStatus = isOnline ? 'online' : 'offline';
      setApiStatus(newStatus);
      
      // Eğer API offline ise uyarı göster
      if (newStatus === 'offline' && searchQuery) {
        setShowApiWarning(true);
        // 7 saniye sonra uyarıyı gizle
        setTimeout(() => setShowApiWarning(false), 7000);
      }
    };
    
    checkApi();
    
    // Her 45 saniyede bir API durumunu kontrol et
    const interval = setInterval(checkApi, 45000);
    return () => clearInterval(interval);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState error={error} onRetry={onRetry} />
      </div>
    );
  }

  if (searchQuery && results.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState searchQuery={searchQuery} onClear={onClearSearch} />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="mx-auto w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <FileText className="h-10 w-10 text-emerald-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Araştırma Yapmaya Başlayın
        </h3>
        <p className="text-gray-600 max-w-sm mx-auto mb-4">
          Zekât konularında arama yaparak TRDizin'den akademik çalışmaları keşfedin.
        </p>
        <div className="text-sm text-gray-500">
          <p>Popüler arama terimleri:</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {['zekât hesaplama', 'İslami finans', 'zekât dağıtımı', 'modern zekât', 'İslami ekonomi'].map((term) => (
              <span
                key={term}
                className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm border border-emerald-200 hover:bg-emerald-100 cursor-pointer transition-colors"
                onClick={() => {
                  // Arama terimini otomatik olarak doldur
                  const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                  if (searchInput) {
                    searchInput.value = term;
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                  }
                }}
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Arama Sonuçları
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              "{searchQuery}" için <strong>{results.length}</strong> sonuç bulundu
            </span>
            {/* N8N API Durum Göstergesi */}
            <div className="flex items-center space-x-2">
              {apiStatus === 'checking' ? (
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              ) : apiStatus === 'online' ? (
                <div className="flex items-center">
                  <Settings className="h-4 w-4 text-green-500 mr-1" title="N8N Workflow Aktif" />
                  <Wifi className="h-4 w-4 text-green-500" title="TRDizin API Bağlantısı" />
                </div>
              ) : (
                <WifiOff className="h-4 w-4 text-orange-500" title="Çevrimdışı Mod - Demo Veriler" />
              )}
              <span className="text-xs text-gray-500">
                {apiStatus === 'checking' ? 'Kontrol ediliyor...' : 
                 apiStatus === 'online' ? 'N8N + TRDizin' : 'Demo Veri'}
              </span>
            </div>
          </div>
        </div>
        
        {/* N8N/TRDizin API Uyarısı */}
        {showApiWarning && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-700 font-medium">
                  N8N Workflow bağlantı sorunu tespit edildi
                </p>
                <p className="text-sm text-yellow-600 mt-1">
                  N8N webhook'i veya TRDizin API'si erişilemez durumda. Demo veriler gösteriliyor. 
                  N8N workflow'unuzun aktif olduğundan emin olun.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Çevrimdışı mod uyarısı */}
        {apiStatus === 'offline' && !showApiWarning && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <WifiOff className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-700 font-medium">
                  Demo mod aktif
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  N8N workflow bağlantısı kurulamadı. Yerel demo veriler gösteriliyor.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Başarılı bağlantı bildirimi */}
        {apiStatus === 'online' && searchQuery && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <Settings className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-green-700 font-medium">
                  N8N Workflow aktif
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Veriler N8N workflow üzerinden TRDizin API'sinden alınıyor.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((research, index) => (
          <ResultCard
            key={`${searchQuery}-${index}`}
            title={research.title}
            authors={research.authors}
            year={research.year}
            abstract={research.abstract}
            doi={research.doi}
            url={research.url}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}