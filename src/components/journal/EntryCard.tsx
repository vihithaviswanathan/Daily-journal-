import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Edit, Trash2, Calendar, Eye } from 'lucide-react';
import { JournalEntry } from '../../types';
import { getMoodOption } from '../../lib/constants';
import { format } from 'date-fns';

interface EntryCardProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
  onView: (entry: JournalEntry) => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({
  entry,
  onEdit,
  onDelete,
  onView
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const moodOption = getMoodOption(entry.mood);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setIsDeleting(true);
      await onDelete(entry.id);
      setIsDeleting(false);
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {entry.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(entry.entry_date), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-lg">{moodOption.emoji}</span>
              <span className={moodOption.color}>{moodOption.label}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Eye}
            onClick={() => onView(entry)}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={() => onEdit(entry)}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={handleDelete}
            loading={isDeleting}
            className="text-red-500 hover:text-red-700"
          />
        </div>
      </div>

      <p className="text-gray-700 mb-4">
        {truncateContent(entry.content)}
      </p>

      {entry.images && entry.images.length > 0 && (
        <div className="flex space-x-2 overflow-x-auto">
          {entry.images.slice(0, 3).map((image) => (
            <img
              key={image.id}
              src={image.image_url}
              alt={image.image_name}
              className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
            />
          ))}
          {entry.images.length > 3 && (
            <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-xs text-gray-500">
              +{entry.images.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  );
};