import React from 'react';
import { JournalEntry } from '../../types';
import { getMoodOption } from '../../lib/constants';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

interface EntryViewerProps {
  entry: JournalEntry;
}

export const EntryViewer: React.FC<EntryViewerProps> = ({ entry }) => {
  const moodOption = getMoodOption(entry.mood);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">{entry.title}</h2>
        
        <div className="flex items-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(entry.entry_date), 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{moodOption.emoji}</span>
            <span className={`font-medium ${moodOption.color}`}>
              {moodOption.label}
            </span>
          </div>
        </div>
      </div>

      <div className="prose max-w-none">
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {entry.content}
        </div>
      </div>

      {entry.images && entry.images.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {entry.images.map((image) => (
              <img
                key={image.id}
                src={image.image_url}
                alt={image.image_name}
                className="w-full h-48 object-cover rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => window.open(image.image_url, '_blank')}
              />
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400 pt-4 border-t border-gray-200">
        Created: {format(new Date(entry.created_at), 'MMM d, yyyy h:mm a')}
        {entry.updated_at !== entry.created_at && (
          <span className="ml-4">
            Updated: {format(new Date(entry.updated_at), 'MMM d, yyyy h:mm a')}
          </span>
        )}
      </div>
    </div>
  );
};