import { MoodOption } from '../types';

export const MOOD_OPTIONS: MoodOption[] = [
  {
    value: 'excellent',
    label: 'Excellent',
    emoji: '🌟',
    color: 'text-mood-excellent'
  },
  {
    value: 'good',
    label: 'Good',
    emoji: '😊',
    color: 'text-mood-good'
  },
  {
    value: 'okay',
    label: 'Okay',
    emoji: '😐',
    color: 'text-mood-okay'
  },
  {
    value: 'bad',
    label: 'Bad',
    emoji: '😔',
    color: 'text-mood-bad'
  },
  {
    value: 'terrible',
    label: 'Terrible',
    emoji: '😢',
    color: 'text-mood-terrible'
  }
];

export const getMoodOption = (mood: string): MoodOption => {
  return MOOD_OPTIONS.find(option => option.value === mood) || MOOD_OPTIONS[2];
};