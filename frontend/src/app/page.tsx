'use client';

import { useState } from 'react';
import PuzzleCreator from './puzzle-creator';

export default function Home() {
  const [currentView, setCurrentView] = useState<'home' | 'creator'>('home');

  if (currentView === 'creator') {
    return <PuzzleCreator onBack={() => setCurrentView('home')} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            🧪 Water Sort Solver
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Solve colorful water sorting puzzles with AI assistance
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div 
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            onClick={() => setCurrentView('creator')}
          >
            <div className="text-4xl mb-4">🎨</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Puzzle and Solve</h2>
            <p className="text-gray-600 mb-6">
              Design your own water sorting puzzle. Choose colors, arrange bottles, test with AI solver, and challenge others.
            </p>
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium">
              Create New Puzzle
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 text-sm text-gray-500">
            <span>✨ AI-Powered Solutions</span>
            <span>•</span>
            <span>🎯 Step-by-Step Guidance</span>
            <span>•</span>
            <span>🎨 Custom Puzzles</span>
          </div>
        </div>
      </div>
    </main>
  );
}