import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CubeCase, Algorithm } from '../../types';

interface EditCaseModalProps {
  cubeCase: CubeCase;
  onClose: () => void;
  onSave: (algorithms: Algorithm[]) => void;
}

// EditCaseModal allows user to modify the main/alt algorithms for a given cube case
const EditCaseModal: React.FC<EditCaseModalProps> = ({ cubeCase, onClose, onSave }) => {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>(
    cubeCase.algorithms.map(alg => ({ ...alg }))
  );

  const getAlgorithmLabel = (index: number): string => {
    if (index === 0) return 'Main';
    if (index === 1) return 'Alt 1';
    return 'Alt 2';
  };

  // Update the moves string for the selected algorithm
const handleAlgorithmChange = (id: string, moves: string) => {
    setAlgorithms(algorithms.map(alg => 
      alg.id === id ? { ...alg, moves } : alg
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(algorithms.filter(alg => alg.moves.trim()));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">{cubeCase.id}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            {[0, 1, 2].map((index) => {
              const algorithm = algorithms[index] || {
                id: `${cubeCase.id}_${index === 0 ? 'main' : `alt${index}`}`,
                moves: '',
                isMain: index === 0,
                practiceCount: 0
              };

              return (
                <div key={algorithm.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-300 mb-2">{getAlgorithmLabel(index)}</div>
                  <input
                    type="text"
                    value={algorithm.moves}
                    onChange={(e) => handleAlgorithmChange(algorithm.id, e.target.value)}
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                    placeholder="Algorithm notation..."
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCaseModal;