'use client';

import { AlertCircle, RefreshCw, Wifi, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  const isNetworkError = error.includes('fetch') || error.includes('network') || error.includes('bağlantı');
  const isCorsError = error.includes('CORS') || error.includes('cors') || error.includes('Cross-Origin');
  
  return (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
        {isCorsError ? (
          <Globe className="h-10 w-10 text-red-500" />
        ) : isNetworkError ? (
          <Wifi className="h-10 w-10 text-red-500" />
        ) : (
          <AlertCircle className="h-10 w-10 text-red-500" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {isCorsError ? 'API Erişim Sorunu' : 
         isNetworkError ? 'Bağlantı Sorunu' : 'Bir Hata Oluştu'}
      </h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        {isCorsError ? 
          'External API CORS politikası nedeniyle erişilemiyor. Demo veriler gösteriliyor.' :
          error
        }
      </p>
      <div className="space-y-3">
        <Button
          onClick={onRetry}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Tekrar Dene
        </Button>
        {(isNetworkError || isCorsError) && (
          <div className="text-sm text-gray-500 space-y-2">
            <p>
              {isCorsError ? 
                'API sağlayıcısı CORS ayarlarını kontrol etmelidir' :
                'İnternet bağlantınızı kontrol edin ve tekrar deneyin'
              }
            </p>
            <p className="text-xs text-gray-400">
              Sistem demo verilerle çalışmaya devam ediyor
            </p>
          </div>
        )}
      </div>
    </div>
  );
}