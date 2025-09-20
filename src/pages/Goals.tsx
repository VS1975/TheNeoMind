import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiTrash2, FiEdit2, FiFlag, FiFilter, FiChevronDown } from 'react-icons/fi';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../context/AuthContext';

interface Goal {
  id: string;
  title: string;
  description: string;
  isPinned: boolean;
  status: 'not-started' | 'in-progress' | 'completed';
  dueDate?: Date;
  createdAt: any;
  updatedAt: any;
}

const statusOptions = [
  { value: 'not-started', label: 'Not Started', color: 'bg-gray-200 text-gray-800' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
];

const Goals = () => {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch goals
  useEffect(() => {
    if (!currentUser) return;
    
    const goalsCollection = collection(db, 'users', currentUser.uid, 'goals');
    const q = query(goalsCollection, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const goalsData = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        description: doc.data().description || '',
        isPinned: doc.data().isPinned || false,
        status: doc.data().status || 'not-started',
        dueDate: doc.data().dueDate?.toDate(),
        createdAt: doc.data().createdAt,
        updatedAt: doc.data().updatedAt || doc.data().createdAt
      } as Goal));
      
      setGoals(goalsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching goals:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Filter goals based on search and filters
  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        goal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || goal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Add or update goal
  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || (!title.trim() && !description.trim())) return;

    const goalsCollection = collection(db, 'users', currentUser.uid, 'goals');
    const now = serverTimestamp();
    
    try {
      if (editingGoalId) {
        // Update existing goal
        const goalDoc = doc(db, 'users', currentUser.uid, 'goals', editingGoalId);
        await updateDoc(goalDoc, {
          title: title.trim(),
          description: description.trim(),
          updatedAt: now
        });
      } else {
        // Add new goal
        await addDoc(goalsCollection, { 
          title: title.trim(),
          description: description.trim(),
          isPinned: false,
          status: 'not-started',
          createdAt: now,
          updatedAt: now
        });
      }
      
      // Reset form
      setTitle('');
      setDescription('');
      setEditingGoalId(null);
      setIsAddingGoal(false);
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  // Delete goal
  const handleDeleteGoal = async (id: string) => {
    if (!currentUser) return;
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      const goalDoc = doc(db, 'users', currentUser.uid, 'goals', id);
      await deleteDoc(goalDoc);
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  // Toggle pin status
  const togglePin = async (id: string, currentStatus: boolean) => {
    if (!currentUser) return;
    
    try {
      const goalDoc = doc(db, 'users', currentUser.uid, 'goals', id);
      await updateDoc(goalDoc, {
        isPinned: !currentStatus,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error toggling pin status:', error);
    }
  };

  // Update goal status
  const updateStatus = async (id: string, newStatus: Goal['status']) => {
    if (!currentUser) return;
    
    try {
      const goalDoc = doc(db, 'users', currentUser.uid, 'goals', id);
      await updateDoc(goalDoc, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Edit goal
  const startEditing = (goal: Goal) => {
    setTitle(goal.title);
    setDescription(goal.description);
    setEditingGoalId(goal.id);
    setIsAddingGoal(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel editing/adding
  const cancelEdit = () => {
    setTitle('');
    setDescription('');
    setEditingGoalId(null);
    setIsAddingGoal(false);
  };

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'No due date';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
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
          <h1 className="text-2xl font-bold">Goals</h1>
          <p className="text-muted-foreground">Turn your ambitions into actionable plans</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search goals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-card focus:ring-2 focus:ring-primary/50 focus:outline-none"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-lg border hover:bg-accent transition-colors"
            aria-label="Filters"
          >
            <FiFilter className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setIsAddingGoal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
          >
            <FiPlus className="-ml-1 mr-2 h-4 w-4" />
            New Goal
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="bg-card p-4 rounded-lg border flex flex-wrap gap-3 items-center">
            <div className="font-medium">Status:</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 text-sm rounded-full ${
                  statusFilter === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-accent hover:bg-accent/80'
                }`}
              >
                All
              </button>
              {statusOptions.map(status => (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    statusFilter === status.value
                      ? `${status.color} font-medium`
                      : 'bg-accent hover:bg-accent/80'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Add/Edit Goal Form */}
      {(isAddingGoal || editingGoalId) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold mb-4">
            {editingGoalId ? 'Edit Goal' : 'New Goal'}
          </h2>
          <form onSubmit={handleSaveGoal}>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Goal title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none"
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-lg border bg-background text-foreground min-h-[100px] focus:ring-2 focus:ring-primary/50 focus:outline-none"
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
                  disabled={!title.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {editingGoalId ? 'Update Goal' : 'Add Goal'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      )}

      {/* Goals Grid */}
      {filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {filteredGoals
              .sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1))
              .map((goal) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-card rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                    goal.isPinned ? 'border-l-4 border-l-primary' : ''
                  }`}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {goal.isPinned && (
                            <FiFlag className="h-4 w-4 text-primary flex-shrink-0" />
                          )}
                          <h3 className="text-lg font-semibold truncate">
                            {goal.title}
                          </h3>
                        </div>
                        {goal.description && (
                          <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                            {goal.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <button
                          onClick={() => togglePin(goal.id, goal.isPinned)}
                          className={`p-1.5 rounded-full ${
                            goal.isPinned
                              ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                              : 'text-muted-foreground hover:bg-accent'
                          }`}
                          title={goal.isPinned ? 'Unpin goal' : 'Pin goal'}
                        >
                          <FiFlag className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => startEditing(goal)}
                          className="p-1.5 rounded-full hover:bg-accent text-muted-foreground"
                          title="Edit goal"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="p-1.5 rounded-full hover:bg-accent text-red-500 hover:text-red-600"
                          title="Delete goal"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">Status:</span>
                        <div className="relative">
                          <select
                            value={goal.status}
                            onChange={(e) => updateStatus(goal.id, e.target.value as Goal['status'])}
                            className="appearance-none bg-background border rounded-md pl-2 pr-8 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                          >
                            {statusOptions.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <FiChevronDown className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Last updated: {formatDate(goal.updatedAt || goal.createdAt)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <FiFlag className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium text-foreground">
            {searchQuery || statusFilter !== 'all' 
              ? 'No goals match your filters' 
              : 'No goals yet'}
          </h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first goal'}
          </p>
          <button
            onClick={() => {
              setIsAddingGoal(true);
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
          >
            <FiPlus className="-ml-1 mr-2 h-4 w-4" />
            New Goal
          </button>
        </div>
      )}
    </div>
  );
};

export default Goals;
