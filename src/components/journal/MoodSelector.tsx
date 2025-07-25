import React from 'react';
import { MOOD_OPTIONS } from '../../lib/constants';
import { MoodType } from '../../types';

interface MoodSelectorProps {
  value: MoodType;
  onChange: (mood: MoodType) => void;
  label?: string;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  value,
  onChange,
  label = 'How are you feeling?'
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {MOOD_OPTIONS.map((mood) => (
          <button
            key={mood.value}
            type="button"
            onClick={() => onChange(mood.value)}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all duration-200
              ${value === mood.value
                ? 'border-primary-500 bg-primary-50 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
          >
            <span className="text-lg">{mood.emoji}</span>
            <span className={`text-sm font-medium ${mood.color}`}>
              {mood.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};