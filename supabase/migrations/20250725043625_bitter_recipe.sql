/*
  # Daily Journal App Database Schema

  1. New Tables
    - `journal_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `content` (text)
      - `mood` (text) - Values: excellent, good, okay, bad, terrible
      - `entry_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `entry_images`
      - `id` (uuid, primary key)
      - `entry_id` (uuid, foreign key to journal_entries)
      - `image_url` (text)
      - `image_name` (text)
      - `created_at` (timestamp)

  2. Storage
    - Create storage bucket for entry images

  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add storage policies for image uploads
*/

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  mood text NOT NULL DEFAULT 'okay' CHECK (mood IN ('excellent', 'good', 'okay', 'bad', 'terrible')),
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create entry_images table
CREATE TABLE IF NOT EXISTS entry_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id uuid REFERENCES journal_entries(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  image_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_entry_date ON journal_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_entry_images_entry_id ON entry_images(entry_id);

-- Enable Row Level Security
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_images ENABLE ROW LEVEL SECURITY;

-- Create policies for journal_entries
CREATE POLICY "Users can view own journal entries" ON journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries" ON journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries" ON journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries" ON journal_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for entry_images
CREATE POLICY "Users can view images for own entries" ON entry_images
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM journal_entries WHERE id = entry_images.entry_id
    )
  );

CREATE POLICY "Users can insert images for own entries" ON entry_images
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM journal_entries WHERE id = entry_images.entry_id
    )
  );

CREATE POLICY "Users can delete images for own entries" ON entry_images
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM journal_entries WHERE id = entry_images.entry_id
    )
  );

-- Create storage bucket for entry images
INSERT INTO storage.buckets (id, name, public) VALUES ('entry-images', 'entry-images', true);

-- Create storage policies
CREATE POLICY "Users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'entry-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'entry-images');

CREATE POLICY "Users can delete own images" ON storage.objects
  FOR DELETE USING (bucket_id = 'entry-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();