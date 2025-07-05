'use client';

import { Search, BookOpen } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-emerald-200 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Zekât Araştırmaları
            </h1>
          </div>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            İslami Finans ve Zekât Konularında Akademik Çalışmalar
          </p>
        </div>
      </div>
    </header>
  );
}