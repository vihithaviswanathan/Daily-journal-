import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { MoodSelector } from './MoodSelector';
import { ImageUpload } from './ImageUpload';
import { JournalEntry, MoodType } from '../../types';
import { format } from 'date-fns';

interface EntryFormProps {
  entry?: JournalEntry;
  onSubmit: (
    title: string,
    content: string,
    mood: MoodType,
    entryDate: string,
    images?: File[]
  ) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export const EntryForm: React.FC<EntryFormProps> = ({
  entry,
  onSubmit,
  onCancel,
  loading
}) => {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [mood, setMood] = useState<MoodType>(entry?.mood || 'okay');
  const [entryDate, setEntryDate] = useState(
    entry?.entry_date || format(new Date(), 'yyyy-MM-dd')
  );
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(title, content, mood, entryDate, images);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's on your mind?"
          required
        />
        <Input
          type="date"
          label="Date"
          value={entryDate}
          onChange={(e) => setEntryDate(e.target.value)}
          required
        />
      </div>

      <MoodSelector value={mood} onChange={setMood} />

      <Textarea
        label="Your thoughts"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write about your day, thoughts, feelings..."
        rows={8}
        required
      />

      <ImageUpload images={images} onImagesChange={setImages} />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          {entry ? 'Update Entry' : 'Save Entry'}
        </Button>
      </div>
    </form>
  );
};