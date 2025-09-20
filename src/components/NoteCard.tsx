import React from 'react';

interface Note {
  id: string;
  content: string;
  summary?: string;
  createdAt: any;
}

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onSummarize: (id: string, content: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, onSummarize }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-between">
      <p className="text-gray-300 mb-4 whitespace-pre-wrap">{note.content}</p>
      {note.summary && (
        <div className="border-t border-gray-700 pt-4 mt-4">
          <h3 className="font-bold text-sm text-blue-400 mb-2">AI Summary</h3>
          <p className="text-gray-400 text-sm italic">{note.summary}</p>
        </div>
      )}
      <div className="flex justify-between items-center mt-4">
        <button 
          onClick={() => onSummarize(note.id, note.content)}
          className="text-sm text-blue-500 hover:text-blue-400"
        >
          Summarize
        </button>
        <button 
          onClick={() => onDelete(note.id)}
          className="text-sm text-red-500 hover:text-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
