import React from 'react';
import { X, Timer, BookOpen, BarChart3, Settings, Zap } from 'lucide-react';

interface IntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IntroModal: React.FC<IntroModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <img 
              src="/brand-logo.png" 
              alt="CraftyCubing Logo" 
              className="w-12 h-12 rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">CraftyCubing</h1>
              <p className="text-gray-400 text-sm">
                Built with ❤️ by{' '}
                <a 
                  href="https://www.linkedin.com/in/prashantpadmanabhan/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Prashant
                </a>
                {' '}aka{' '}
                <a 
                  href="https://www.craftyprash.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  CraftyPrash
                </a>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Welcome Message */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-3">
              Welcome to CraftyCubing!
            </h2>
            <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Your ultimate speedcubing companion for practicing algorithms, tracking solves, 
              and improving your times. Whether you're learning F2L, mastering OLL/PLL, or 
              working on your full solve times, CraftyCubing has everything you need to take 
              your speedcubing to the next level.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <Timer className="h-6 w-6 text-blue-400" />
                <h3 className="font-semibold text-white text-lg">Full Solve Timer</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Practice with inspection time, track your solves, and monitor your progress 
                with detailed statistics including ao5, ao12, ao50, and ao100. Features 
                customizable inspection time and session management.
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="h-6 w-6 text-green-400" />
                <h3 className="font-semibold text-white text-lg">Case Library</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Browse and practice F2L, OLL, and PLL cases with visual cube states, 
                multiple algorithms per case, individual timing, and comprehensive 
                statistics tracking for each algorithm.
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="h-6 w-6 text-purple-400" />
                <h3 className="font-semibold text-white text-lg">Session Management</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Organize your practice with multiple sessions, track personal bests, 
                and analyze your improvement over time. Each session can have its own 
                inspection settings and solve history.
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <Settings className="h-6 w-6 text-orange-400" />
                <h3 className="font-semibold text-white text-lg">Customizable Settings</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Adjust inspection time (8s, 15s, 30s), timer settings, and session 
                preferences to match your training style and competition preparation. 
                Settings are saved per session.
              </p>
            </div>
          </div>

          {/* How to Use */}
          <div className="bg-gray-700 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-6 w-6 text-yellow-400" />
              <h3 className="font-semibold text-white text-lg">Quick Start Guide</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">1</span>
                  <span><strong>Full Solve:</strong> Use the main timer to practice complete solves with scrambles and inspection time</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">2</span>
                  <span><strong>Cases:</strong> Visit the Cases page to practice specific F2L, OLL, or PLL algorithms with visual guides</span>
                </div>
              </div>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">3</span>
                  <span><strong>Sessions:</strong> Create different sessions for various practice types (speed, accuracy, specific algorithms)</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">4</span>
                  <span><strong>Timer Controls:</strong> Hold spacebar for 0.25s to start, tap to stop, or press Esc to cancel without recording</span>
                </div>
              </div>
            </div>
          </div>

          {/* Get Started Button */}
          <div className="text-center pt-4">
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-lg"
            >
              Start Cubing! 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroModal;