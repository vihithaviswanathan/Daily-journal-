import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useJournalEntries } from '../../hooks/useJournalEntries';
import { Header } from './Header';
import { EntryCard } from './EntryCard';
import { EntryForm } from './EntryForm';
import { EntryViewer } from './EntryViewer';
import { Modal } from '../ui/Modal';
import { JournalEntry, MoodType } from '../../types';
import { BookOpen } from 'lucide-react';

export const JournalDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    entries,
    loading,
    createEntry,
    updateEntry,
    deleteEntry,
    searchEntries,
  } = useJournalEntries(user?.id);

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | undefined>();
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | undefined>();
  const [formLoading, setFormLoading] = useState(false);

  const filteredEntries = searchEntries(searchQuery);

  const handleCreateEntry = () => {
    setEditingEntry(undefined);
    setIsFormOpen(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const handleViewEntry = (entry: JournalEntry) => {
    setViewingEntry(entry);
    setIsViewerOpen(true);
  };

  const handleFormSubmit = async (
    title: string,
    content: string,
    mood: MoodType,
    entryDate: string,
    images?: File[]
  ) => {
    setFormLoading(true);
    try {
      if (editingEntry) {
        await updateEntry(editingEntry.id, title, content, mood, images);
      } else {
        await createEntry(title, content, mood, entryDate, images);
      }
      setIsFormOpen(false);
      setEditingEntry(undefined);
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    await deleteEntry(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCreateEntry={handleCreateEntry}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No entries found' : 'No entries yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Start by creating your first journal entry'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateEntry}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Create Your First Entry
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onEdit={handleEditEntry}
                onDelete={handleDeleteEntry}
                onView={handleViewEntry}
              />
            ))}
          </div>
        )}
      </main>

      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEntry(undefined);
        }}
        title={editingEntry ? 'Edit Entry' : 'New Journal Entry'}
        size="lg"
      >
        <EntryForm
          entry={editingEntry}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingEntry(undefined);
          }}
          loading={formLoading}
        />
      </Modal>

      <Modal
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setViewingEntry(undefined);
        }}
        title="Journal Entry"
        size="lg"
      >
        {viewingEntry && <EntryViewer entry={viewingEntry} />}
      </Modal>
    </div>
  );
};