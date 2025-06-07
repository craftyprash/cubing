/**
 * SessionManager.tsx - Session Management Component
 * 
 * Handles creation, deletion, and switching between different practice sessions.
 * Each session maintains its own solve history, statistics, and settings.
 * This allows users to organize their practice by different goals or methods.
 * 
 * Key Features:
 * - Session dropdown with solve counts
 * - Create new sessions with custom names
 * - Delete sessions (with protection for last session)
 * - Real-time session switching
 * - Input validation and error handling
 * - Keyboard shortcuts (Enter to save, Escape to cancel)
 * 
 * Session Types:
 * Sessions can be used for different purposes:
 * - Speed practice sessions
 * - Accuracy-focused sessions
 * - Algorithm-specific practice
 * - Competition preparation
 * - Different cube sizes or methods
 * 
 * Props:
 * - sessions: Array of all available sessions
 * - currentSession: Currently active session
 * - onSessionChange: Callback when user switches sessions
 * - onCreateSession: Callback when user creates a new session
 * - onDeleteSession: Callback when user deletes a session
 * 
 * Technical Implementation:
 * - Prevents spacebar from triggering timer when typing session names
 * - Uses event capture to intercept keyboard events during input
 * - Validates session names (no empty names)
 * - Provides visual feedback for errors
 * - Automatically focuses input when creating sessions
 * 
 * Database Integration:
 * - Sessions are stored in IndexedDB via Dexie
 * - Each session has unique ID, name, creation date, solve count
 * - Session settings (inspection time, etc.) are stored per session
 * - Solves are linked to sessions via sessionId foreign key
 */

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

// Dropdown and session control buttons to allow switching or creating sessions
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

  // Prevent keydown propagation when typing session name (e.g., space to start timer)
useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === inputRef.current && e.code === 'Space') {
        e.stopPropagation();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

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
      setIsCreating(false);
      setNewSessionName('');
      setError(null);
    }
  };

  return (
    <div className="flex items-center gap-2 mb-2">
      {isCreating ? (
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={newSessionName}
              onChange={(e) => {
                setNewSessionName(e.target.value);
                setError(null);
              }}
              onKeyDown={handleKeyPress}
              placeholder="Session name..."
              className={`w-full bg-gray-700 border ${error ? 'border-red-500' : 'border-gray-600'} rounded px-2 py-1 text-sm text-white`}
              autoFocus
            />
            {error && (
              <div className="text-red-500 text-xs mt-1">{error}</div>
            )}
          </div>
          <button
            onClick={handleCreateSession}
            className="p-1 text-gray-400 hover:text-white"
          >
            <Check className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex-1 flex items-center gap-2">
          <select
            value={currentSession.id}
            onChange={(e) => onSessionChange(e.target.value)}
            className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
          >
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.name} ({session.solveCount || 0})
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsCreating(true)}
            className="p-1 text-gray-400 hover:text-white"
            title="New session"
          >
            <Plus className="h-4 w-4" />
          </button>
          {currentSession.id !== 'default' && (
            <button
              onClick={() => onDeleteSession(currentSession.id)}
              className="p-1 text-gray-400 hover:text-red-500"
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