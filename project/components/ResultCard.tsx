'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, ExternalLink, User, Calendar } from 'lucide-react';

interface ResultCardProps {
  title: string;
  authors?: string[];
  year?: string;
  abstract?: string;
  doi?: string;
  url?: string;
  index: number;
}

export default function ResultCard({ 
  title, 
  authors = [], 
  year, 
  abstract, 
  doi, 
  url, 
  index 
}: ResultCardProps) {
  const truncatedTitle = title.length > 120 ? title.substring(0, 120) + '...' : title;
  const truncatedAbstract = abstract && abstract.length > 150 ? abstract.substring(0, 150) + '...' : abstract;
  const displayAuthors = authors.length > 0 ? authors.slice(0, 2).join(', ') + (authors.length > 2 ? ' ve diğerleri' : '') : '';

  const handleCardClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (doi) {
      window.open(`https://doi.org/${doi}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card 
      className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-200 ${
        (url || doi) ? 'cursor-pointer' : ''
      }`}
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors duration-200">
              <BookOpen className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
              {truncatedTitle}
            </h3>
            
            {/* Yazarlar */}
            {displayAuthors && (
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <User className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">{displayAuthors}</span>
              </div>
            )}
            
            {/* Yıl */}
            {year && (
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>{year}</span>
              </div>
            )}
            
            {/* Özet */}
            {truncatedAbstract && (
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                {truncatedAbstract}
              </p>
            )}
            
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">
                Araştırma #{index + 1}
              </span>
              <div className="flex items-center space-x-2">
                {doi && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    DOI
                  </span>
                )}
                {(url || doi) && (
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 transition-colors duration-200" />
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}