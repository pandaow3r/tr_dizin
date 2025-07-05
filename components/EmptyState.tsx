'use client';

import { Search, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  searchQuery: string;
  onClear: () => void;
}

export default function EmptyState({ searchQuery, onClear }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Search className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Sonuç Bulunamadı
      </h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        "{searchQuery}" için arama kriterlerinize uygun araştırma bulunamadı.
      </p>
      <div className="space-y-4">
        <Button
          onClick={onClear}
          variant="outline"
          className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
        >
          Aramayı Temizle
        </Button>
        <div className="text-sm text-gray-500">
          <p>Arama önerileri:</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {['zekât', 'vergi', 'finans', 'İslami', 'ekonomi'].map((suggestion) => (
              <span
                key={suggestion}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}