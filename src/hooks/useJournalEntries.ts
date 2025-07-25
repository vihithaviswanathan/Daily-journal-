import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { JournalEntry, MoodType } from '../types';

export const useJournalEntries = (userId: string | undefined) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchEntries();
    }
  }, [userId]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('journal_entries')
        .select(`
          *,
          entry_images (*)
        `)
        .eq('user_id', userId)
        .order('entry_date', { ascending: false });

      if (error) throw error;

      setEntries(data.map(entry => ({
        ...entry,
        images: entry.entry_images || []
      })) || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (
    title: string,
    content: string,
    mood: MoodType,
    entryDate: string,
    images?: File[]
  ) => {
    try {
      const { data: entry, error: entryError } = await supabase
        .from('journal_entries')
        .insert({
          user_id: userId,
          title,
          content,
          mood,
          entry_date: entryDate,
        })
        .select()
        .single();

      if (entryError) throw entryError;

      // Upload images if provided
      if (images && images.length > 0) {
        await uploadImages(entry.id, images);
      }

      await fetchEntries();
      return { data: entry, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  const updateEntry = async (
    id: string,
    title: string,
    content: string,
    mood: MoodType,
    images?: File[]
  ) => {
    try {
      const { data: entry, error: entryError } = await supabase
        .from('journal_entries')
        .update({
          title,
          content,
          mood,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (entryError) throw entryError;

      // Upload new images if provided
      if (images && images.length > 0) {
        await uploadImages(id, images);
      }

      await fetchEntries();
      return { data: entry, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      // Delete associated images first
      const { error: imagesError } = await supabase
        .from('entry_images')
        .delete()
        .eq('entry_id', id);

      if (imagesError) throw imagesError;

      // Delete the entry
      const { error: entryError } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (entryError) throw entryError;

      await fetchEntries();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const uploadImages = async (entryId: string, images: File[]) => {
    try {
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${entryId}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('entry-images')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('entry-images')
          .getPublicUrl(fileName);

        const { error: dbError } = await supabase
          .from('entry_images')
          .insert({
            entry_id: entryId,
            image_url: urlData.publicUrl,
            image_name: image.name,
          });

        if (dbError) throw dbError;
      }
    } catch (err: any) {
      console.error('Error uploading images:', err);
    }
  };

  const searchEntries = (query: string) => {
    if (!query.trim()) return entries;
    
    const lowercaseQuery = query.toLowerCase();
    return entries.filter(entry =>
      entry.title.toLowerCase().includes(lowercaseQuery) ||
      entry.content.toLowerCase().includes(lowercaseQuery)
    );
  };

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    searchEntries,
    refetch: fetchEntries,
  };
};