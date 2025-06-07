import React, { useState, useEffect } from 'react';
import { X, Trash2, Save, Clock, AlertTriangle } from 'lucide-react';
import { generateScramblePreview } from '../../utils/visualCube';

interface SolveDetailsModalProps {
  solve: {
    id: string;
    time: number;
    scramble: string;
    date: Date;
    notes?: string;
    penalty?: 'DNF' | '+2';
  };
  sessionName?: string;
  onClose: () => void;
  onDelete: () => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onUpdatePenalty: (id: string, penalty: 'DNF' | '+2' | undefined) => void;
}

// Modal component to edit/view a solve, including notes and penalties
const SolveDetailsModal: React.FC<SolveDetailsModalProps> = ({ 
  solve, 
  sessionName,
  onClose, 
  onDelete,
  onUpdateNotes,
  onUpdatePenalty 
}) => {
  const [notes, setNotes] = useState(solve.notes || '');
  const [isEditing, setIsEditing] = useState(false);
  const [penalty, setPenalty] = useState<'DNF' | '+2' | undefined>(solve.penalty);

  // Allow Escape key to close modal, but prevent spacebar interference when editing notes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle Escape key
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Prevent spacebar from being handled by timer when editing notes
      if (e.code === 'Space' && isEditing) {
        e.stopPropagation();
      }
    };

    // Use capture phase to intercept events before they reach the timer
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [onClose, isEditing]);

  const handleSaveNotes = () => {
    onUpdateNotes(solve.id, notes);
    setIsEditing(false);
  };

  // Toggle penalty for a solve (DNF or +2)
  const handlePenaltyChange = (newPenalty: 'DNF' | '+2' | undefined) => {
    // Toggle penalty if clicking the same one
    const updatedPenalty = penalty === newPenalty ? undefined : newPenalty;
    setPenalty(updatedPenalty);
    onUpdatePenalty(solve.id, updatedPenalty);
  };

  // Handle textarea events to prevent timer interference
  const handleTextareaKeyDown = (e: React.KeyboardEvent) => {
    // Stop all keyboard events from propagating to prevent timer interference
    e.stopPropagation();
  };

  const handleTextareaKeyUp = (e: React.KeyboardEvent) => {
    // Stop all keyboard events from propagating to prevent timer interference
    e.stopPropagation();
  };

  const getDisplayTime = () => {
    if (penalty === 'DNF') return 'DNF';
    const time = penalty === '+2' ? solve.time + 2000 : solve.time;
    return `${(time / 1000).toFixed(2)}s`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            Solve Details{sessionName && ` - ${sessionName}`}
          </h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={onDelete}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Delete solve"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className={`text-3xl font-mono ${penalty === 'DNF' ? 'text-red-500' : penalty === '+2' ? 'text-yellow-500' : 'text-white'}`}>
                  {getDisplayTime()}
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(solve.date).toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handlePenaltyChange('+2')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
                  penalty === '+2'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                title="Add +2 penalty"
              >
                <Clock className="h-4 w-4" />
                <span>+2</span>
              </button>
              <button
                onClick={() => handlePenaltyChange('DNF')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 ${
                  penalty === 'DNF'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                title="Mark as DNF"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>DNF</span>
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-400 mb-2">Scramble</div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-white font-mono break-words mb-4">
                {solve.scramble}
              </div>
              <img 
                src={generateScramblePreview(solve.scramble)}
                alt="Scramble state"
                className="w-[120px] h-[120px] mx-auto rounded-lg"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-400">Notes</div>
              {isEditing ? (
                <button
                  onClick={handleSaveNotes}
                  className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-1"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Edit
                </button>
              )}
            </div>
            {isEditing ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onKeyDown={handleTextareaKeyDown}
                onKeyUp={handleTextareaKeyUp}
                className="w-full h-24 bg-gray-700 border border-gray-600 rounded-lg p-3 text-white resize-none focus:outline-none focus:border-blue-500"
                placeholder="Add notes about your solve..."
                autoFocus
              />
            ) : (
              <div className="bg-gray-700 rounded-lg p-3 text-white min-h-[4rem]">
                {notes || 'No notes added'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolveDetailsModal;