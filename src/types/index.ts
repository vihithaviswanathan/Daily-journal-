export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: MoodType;
  entry_date: string;
  created_at: string;
  updated_at: string;
  images?: EntryImage[];
}

export interface EntryImage {
  id: string;
  entry_id: string;
  image_url: string;
  image_name: string;
  created_at: string;
}

export type MoodType = 'excellent' | 'good' | 'okay' | 'bad' | 'terrible';

export interface MoodOption {
  value: MoodType;
  label: string;
  emoji: string;
  color: string;
}