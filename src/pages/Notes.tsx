import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiSearch, FiTrash2, FiEdit2, FiClock, FiCheck, FiFileText } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface Note {
  id: string;
  content: string;
  title: string;
  isPinned: boolean;
  updatedAt: any;
  createdAt: any;
}

const Notes = () => {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pinned'>('all');

  // Filter notes based on search and active tab
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (note.title?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTab = activeTab === 'pinned' ? note.isPinned : true;
    return matchesSearch && matchesTab;
  });

  // Fetch notes
  useEffect(() => {
    if (!currentUser) return;
    
    const notesCollection = collection(db, 'users', currentUser.uid, 'notes');
    const q = query(notesCollection, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title || 'Untitled',
        content: doc.data().content,
        isPinned: doc.data().isPinned || false,
        createdAt: doc.data().createdAt,
        updatedAt: doc.data().updatedAt || doc.data().createdAt
      } as Note));
      
      setNotes(notesData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching notes:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Add or update note
  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || (!content.trim() && !title.trim())) return;

    const notesCollection = collection(db, 'users', currentUser.uid, 'notes');
    const now = serverTimestamp();
    
    try {
      if (editingNoteId) {
        // Update existing note
        const noteDoc = doc(db, 'users', currentUser.uid, 'notes', editingNoteId);
        await updateDoc(noteDoc, {
          title: title.trim() || 'Untitled',
          content: content.trim(),
          updatedAt: now
        });
      } else {
        // Add new note
        await addDoc(notesCollection, { 
          title: title.trim() || 'Untitled',
          content: content.trim(),
          isPinned: false,
          createdAt: now,
          updatedAt: now
        });
      }
      
      // Reset form
      setTitle('');
      setContent('');
      setEditingNoteId(null);
      setIsAddingNote(false);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  // Delete note
  const handleDeleteNote = async (id: string) => {
    if (!currentUser) return;
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    try {
      const noteDoc = doc(db, 'users', currentUser.uid, 'notes', id);
      await deleteDoc(noteDoc);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Toggle pin status
  const togglePin = async (id: string, currentStatus: boolean) => {
    if (!currentUser) return;
    
    try {
      const noteDoc = doc(db, 'users', currentUser.uid, 'notes', id);
      await updateDoc(noteDoc, {
        isPinned: !currentStatus,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error toggling pin status:', error);
    }
  };

  // Edit note
  const startEditing = (note: Note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingNoteId(note.id);
    setIsAddingNote(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel editing/adding
  const cancelEdit = () => {
    setTitle('');
    setContent('');
    setEditingNoteId(null);
    setIsAddingNote(false);
  };

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return format(date, 'MMM d, yyyy h:mm a');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notes</h1>
          <p className="text-muted-foreground">Capture your thoughts and ideas</p>
        </div>
        
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-card focus:ring-2 focus:ring-primary/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            All Notes
          </button>
          <button
            onClick={() => setActiveTab('pinned')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pinned'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
            }`}
          >
            Pinned
          </button>
        </nav>
      </div>

      {/* Add/Edit Note Form */}
      {(isAddingNote || editingNoteId) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold mb-4">
            {editingNoteId ? 'Edit Note' : 'New Note'}
          </h2>
          <form onSubmit={handleSaveNote}>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none"
                />
              </div>
              <div>
                <textarea
                  placeholder="Start writing your note here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 rounded-lg border bg-background text-foreground min-h-[200px] focus:ring-2 focus:ring-primary/50 focus:outline-none"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 text-sm font-medium rounded-lg border hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!content.trim() && !title.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {editingNoteId ? 'Update Note' : 'Save Note'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      )}

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg line-clamp-1">
                      {note.title}
                    </h3>
                    <button
                      onClick={() => togglePin(note.id, note.isPinned)}
                      className={`p-1.5 rounded-full ${
                        note.isPinned
                          ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                          : 'text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      <FiCheck
                        className={`h-4 w-4 ${note.isPinned ? 'block' : 'hidden'}`}
                      />
                      <FiClock
                        className={`h-4 w-4 ${!note.isPinned ? 'block' : 'hidden'}`}
                      />
                    </button>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-4">
                    {note.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {formatDate(note.updatedAt || note.createdAt)}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(note)}
                        className="p-1.5 rounded-full hover:bg-accent"
                        title="Edit note"
                      >
                        <FiEdit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1.5 rounded-full hover:bg-accent text-red-500 hover:text-red-600"
                        title="Delete note"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <FiFileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium text-foreground">
            {activeTab === 'pinned' ? 'No pinned notes' : 'No notes yet'}
          </h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {activeTab === 'pinned'
              ? 'Pin important notes to see them here'
              : 'Get started by creating a new note'}
          </p>
          <button
            onClick={() => setIsAddingNote(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
          >
            <FiPlus className="-ml-1 mr-2 h-4 w-4" />
            New Note
          </button>
        </div>
      )}
    </div>
  );
};

export default Notes;
