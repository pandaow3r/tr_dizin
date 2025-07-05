'use client';

import { Heart, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-6 w-6 text-emerald-600 mr-2" />
            <span className="text-lg font-semibold text-gray-900">
              Zekât Araştırmaları
            </span>
          </div>
          <p className="text-gray-600 mb-4">
            İslami finans ve zekât konularında akademik çalışmalara erişim platformu
          </p>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 mx-1" />
            <span>for Islamic research</span>
          </div>
        </div>
      </div>
    </footer>
  );
}