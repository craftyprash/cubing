import React, { useState, useRef, useEffect } from 'react';
import { Plus, Check, Trash2 } from 'lucide-react';
import { Session } from '../../types';

interface SessionManagerProps {
  sessions: Session[];
  currentSession: Session;
  onSessionChange: (sessionId: string) => void;
  onCreateSession: (name: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

const SessionManager: React.FC<SessionManagerProps> = ({
  sessions,
  currentSession,
  onSessionChange,
  onCreateSession,
  onDeleteSession
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mark container as having active input when creating
  useEffect(() => {
    if (containerRef.current) {
      if (isCreating) {
        containerRef.current.setAttribute('data-input-active', 'true');
      } else {
        containerRef.current.removeAttribute('data-input-active');
      }
    }
  }, [isCreating]);

  const handleCreateSession = async () => {
    if (!newSessionName.trim()) return;
    
    try {
      await onCreateSession(newSessionName.trim());
      setNewSessionName('');
      setIsCreating(false);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create session');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateSession();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsCreating(false);
      setNewSessionName('');
      setError(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSessionName(e.target.value);
    setError(null);
  };

  const startCreating = () => {
    setIsCreating(true);
    setNewSessionName('');
    setError(null);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const cancelCreating = () => {
    setIsCreating(false);
    setNewSessionName('');
    setError(null);
  };

  return (
    <div 
      ref={containerRef}
      className="flex items-center gap-2 mb-2"
    >
      {isCreating ? (
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={newSessionName}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Session name..."
              className={`w-full bg-gray-700 border ${error ? 'border-red-500' : 'border-gray-600'} rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500`}
              autoFocus
            />
            {error && (
              <div className="text-red-500 text-xs mt-1">{error}</div>
            )}
          </div>
          <button
            onClick={handleCreateSession}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Save session"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={cancelCreating}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Cancel"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex-1 flex items-center gap-2">
          <select
            value={currentSession.id}
            onChange={(e) => onSessionChange(e.target.value)}
            className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.name} ({session.solveCount || 0})
              </option>
            ))}
          </select>
          <button
            onClick={startCreating}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="New session"
          >
            <Plus className="h-4 w-4" />
          </button>
          {currentSession.id !== 'default' && (
            <button
              onClick={() => onDeleteSession(currentSession.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete session"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionManager;