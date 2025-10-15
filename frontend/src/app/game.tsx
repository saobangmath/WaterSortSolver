'use client';

import { useState, useEffect } from 'react';

interface Bottle {
  capacity: number;
  waters: string[];
}

interface GameState {
  bottles: Bottle[];
  plan?: [number, number][];
}

const COLOR_MAP: { [key: string]: string } = {
  'XanhLaNhat': '#90EE90',
  'XanhBlueNhat': '#87CEEB', 
  'XanhLa': '#32CD32',
  'Xam': '#808080',
  'Tim': '#8A2BE2',
  'Hong': '#FFB6C1',
  'Do': '#FF0000',
  'XanhBlue': '#0000FF',
  'Nau': '#A52A2A',
  'XanhCyan': '#00FFFF',
  'Cam': '#FFA500',
  'Vang': '#FFFF00',
  'XanhNavy': '#000080',
  'Empty': '#F0F0F0'
};

export default function Game({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<GameState>({
    bottles: [
      { capacity: 4, waters: ["XanhLaNhat", "XanhBlueNhat", "XanhLa", "Xam"] },
      { capacity: 4, waters: ["Tim", "XanhLa", "Hong", "Do"] },
      { capacity: 4, waters: ["XanhBlue", "Xam", "Nau", "XanhCyan"] },
      { capacity: 4, waters: ["Nau", "XanhBlueNhat", "XanhLaNhat", "XanhBlueNhat"] },
      { capacity: 4, waters: ["Cam", "Cam", "Cam", "Xam"] },
      { capacity: 4, waters: ["Nau", "Nau", "XanhLaNhat", "Do"] },
      { capacity: 4, waters: ["XanhCyan", "Do", "Vang", "XanhBlue"] },
      { capacity: 4, waters: ["Xam", "Cam", "Vang", "Do"] },
      { capacity: 4, waters: ["XanhLa", "XanhCyan", "Vang", "Tim"] },
      { capacity: 4, waters: ["XanhBlue", "Vang", "XanhBlueNhat", "Tim"] },
      { capacity: 4, waters: ["Hong", "XanhCyan", "XanhBlue", "XanhLaNhat"] },
      { capacity: 4, waters: ["Tim", "XanhLa", "Hong", "Hong"] },
      { capacity: 4, waters: [] },
      { capacity: 4, waters: [] }
    ]
  });

  const [selectedBottle, setSelectedBottle] = useState<number | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const [solution, setSolution] = useState<[number, number][]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlayingSolution, setIsPlayingSolution] = useState(false);
  const [animatingBottles, setAnimatingBottles] = useState<{[key: number]: {from: number, to: number, isAnimating: boolean}}>({});

  const canPour = (fromIndex: number, toIndex: number): boolean => {
    if (fromIndex === toIndex) return false;
    
    const fromBottle = gameState.bottles[fromIndex];
    const toBottle = gameState.bottles[toIndex];
    
    if (fromBottle.waters.length === 0) return false;
    if (toBottle.waters.length === toBottle.capacity) return false;
    
    const topWater = fromBottle.waters[fromBottle.waters.length - 1];
    
    if (toBottle.waters.length === 0) return true;
    
    const toTopWater = toBottle.waters[toBottle.waters.length - 1];
    return topWater === toTopWater;
  };

  const pourWater = (fromIndex: number, toIndex: number) => {
    if (!canPour(fromIndex, toIndex)) return;

    // Start animation
    setAnimatingBottles(prev => ({
      ...prev,
      [fromIndex]: { from: fromIndex, to: toIndex, isAnimating: true }
    }));

    // After animation delay, perform the actual pour
    setTimeout(() => {
      const newBottles = [...gameState.bottles];
      const fromBottle = { ...newBottles[fromIndex] };
      const toBottle = { ...newBottles[toIndex] };

      const topWater = fromBottle.waters[fromBottle.waters.length - 1];
      
      while (fromBottle.waters.length > 0 && 
             toBottle.waters.length < toBottle.capacity &&
             fromBottle.waters[fromBottle.waters.length - 1] === topWater) {
        const water = fromBottle.waters.pop()!;
        toBottle.waters.push(water);
      }

      newBottles[fromIndex] = fromBottle;
      newBottles[toIndex] = toBottle;

      setGameState({ ...gameState, bottles: newBottles });
      setSelectedBottle(null);

      // End animation
      setAnimatingBottles(prev => ({
        ...prev,
        [fromIndex]: { from: fromIndex, to: toIndex, isAnimating: false }
      }));
    }, 800); // 800ms animation duration
  };

  const handleBottleClick = (index: number) => {
    if (selectedBottle === null) {
      if (gameState.bottles[index].waters.length > 0) {
        setSelectedBottle(index);
      }
    } else {
      if (selectedBottle === index) {
        setSelectedBottle(null);
      } else {
        pourWater(selectedBottle, index);
      }
    }
  };

  const solvePuzzle = async () => {
    setIsSolving(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/solve/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bottles: gameState.bottles.map(bottle => ({
            capacity: bottle.capacity,
            waters: bottle.waters
          }))
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSolution(data.plan || []);
      } else {
        console.error('Failed to solve puzzle');
      }
    } catch (error) {
      console.error('Error solving puzzle:', error);
    } finally {
      setIsSolving(false);
    }
  };

  const playSolution = () => {
    if (solution.length === 0) return;
    
    setIsPlayingSolution(true);
    setCurrentStep(0);
    setAnimatingBottles({});
    
    // Reset to initial state
    const initialBottles = [
      { capacity: 4, waters: ["XanhLaNhat", "XanhBlueNhat", "XanhLa", "Xam"] },
      { capacity: 4, waters: ["Tim", "XanhLa", "Hong", "Do"] },
      { capacity: 4, waters: ["XanhBlue", "Xam", "Nau", "XanhCyan"] },
      { capacity: 4, waters: ["Nau", "XanhBlueNhat", "XanhLaNhat", "XanhBlueNhat"] },
      { capacity: 4, waters: ["Cam", "Cam", "Cam", "Xam"] },
      { capacity: 4, waters: ["Nau", "Nau", "XanhLaNhat", "Do"] },
      { capacity: 4, waters: ["XanhCyan", "Do", "Vang", "XanhBlue"] },
      { capacity: 4, waters: ["Xam", "Cam", "Vang", "Do"] },
      { capacity: 4, waters: ["XanhLa", "XanhCyan", "Vang", "Tim"] },
      { capacity: 4, waters: ["XanhBlue", "Vang", "XanhBlueNhat", "Tim"] },
      { capacity: 4, waters: ["Hong", "XanhCyan", "XanhBlue", "XanhLaNhat"] },
      { capacity: 4, waters: ["Tim", "XanhLa", "Hong", "Hong"] },
      { capacity: 4, waters: [] },
      { capacity: 4, waters: [] }
    ];
    
    setGameState({ bottles: initialBottles, plan: solution });
  };

  const nextStep = () => {
    if (currentStep < solution.length) {
      const [from, to] = solution[currentStep];
      pourWater(from, to);
      setCurrentStep(currentStep + 1);
    } else {
      setIsPlayingSolution(false);
    }
  };

  const resetGame = () => {
    const initialBottles = [
      { capacity: 4, waters: ["XanhLaNhat", "XanhBlueNhat", "XanhLa", "Xam"] },
      { capacity: 4, waters: ["Tim", "XanhLa", "Hong", "Do"] },
      { capacity: 4, waters: ["XanhBlue", "Xam", "Nau", "XanhCyan"] },
      { capacity: 4, waters: ["Nau", "XanhBlueNhat", "XanhLaNhat", "XanhBlueNhat"] },
      { capacity: 4, waters: ["Cam", "Cam", "Cam", "Xam"] },
      { capacity: 4, waters: ["Nau", "Nau", "XanhLaNhat", "Do"] },
      { capacity: 4, waters: ["XanhCyan", "Do", "Vang", "XanhBlue"] },
      { capacity: 4, waters: ["Xam", "Cam", "Vang", "Do"] },
      { capacity: 4, waters: ["XanhLa", "XanhCyan", "Vang", "Tim"] },
      { capacity: 4, waters: ["XanhBlue", "Vang", "XanhBlueNhat", "Tim"] },
      { capacity: 4, waters: ["Hong", "XanhCyan", "XanhBlue", "XanhLaNhat"] },
      { capacity: 4, waters: ["Tim", "XanhLa", "Hong", "Hong"] },
      { capacity: 4, waters: [] },
      { capacity: 4, waters: [] }
    ];
    
    setGameState({ bottles: initialBottles });
    setSelectedBottle(null);
    setSolution([]);
    setCurrentStep(0);
    setIsPlayingSolution(false);
    setAnimatingBottles({});
  };

  const renderBottle = (bottle: Bottle, index: number) => {
    const isSelected = selectedBottle === index;
    const canReceive = selectedBottle !== null && selectedBottle !== index && canPour(selectedBottle, index);
    const isAnimating = animatingBottles[index]?.isAnimating;
    const animationData = animatingBottles[index];
    
    // Check if this bottle is a target of any animation
    const isTarget = Object.values(animatingBottles).some(anim => 
      anim.isAnimating && anim.to === index
    );
    
    // Calculate animation position
    let animationStyle = {};
    if (isAnimating && animationData) {
      const fromIndex = animationData.from;
      const toIndex = animationData.to;
      
      // Calculate positions (assuming 7-column grid)
      const fromCol = fromIndex % 7;
      const fromRow = Math.floor(fromIndex / 7);
      const toCol = toIndex % 7;
      const toRow = Math.floor(toIndex / 7);
      
      // Calculate movement
      const deltaX = (toCol - fromCol) * 80; // 80px per column (64px width + 32px gap)
      const deltaY = (toRow - fromRow) * 160; // 160px per row (96px height + 48px gap)
      
      animationStyle = {
        transform: `translate(${deltaX}px, ${deltaY}px) scale(1.1)`,
        zIndex: 1000,
        transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      };
    }
    
    return (
      <div
        key={index}
        className={`relative w-16 h-24 border-4 rounded-b-2xl cursor-pointer transition-all duration-200 ${
          isSelected 
            ? 'border-yellow-400 shadow-lg scale-105' 
            : canReceive 
            ? 'border-green-400 shadow-md' 
            : isAnimating
            ? 'border-blue-400 shadow-xl animate-pour'
            : isTarget
            ? 'border-purple-400 shadow-lg animate-target-glow'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        style={animationStyle}
        onClick={() => !isAnimating && handleBottleClick(index)}
      >
        {/* Bottle neck */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-4 border-2 border-gray-300 rounded-t-full bg-white"></div>
        
        {/* Water drop animation during pouring */}
        {isAnimating && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div 
              className="w-3 h-3 rounded-full animate-water-drop"
              style={{ 
                backgroundColor: COLOR_MAP[bottle.waters[bottle.waters.length - 1]] || '#F0F0F0'
              }}
            />
          </div>
        )}
        
        {/* Water layers */}
        <div className="absolute bottom-0 w-full h-full flex flex-col-reverse">
          {bottle.waters.map((water, waterIndex) => (
            <div
              key={waterIndex}
              className="w-full border-t border-gray-200"
              style={{
                height: `${100 / bottle.capacity}%`,
                backgroundColor: COLOR_MAP[water] || '#F0F0F0'
              }}
            />
          ))}
          {/* Empty space */}
          {Array.from({ length: bottle.capacity - bottle.waters.length }).map((_, emptyIndex) => (
            <div
              key={`empty-${emptyIndex}`}
              className="w-full border-t border-gray-200"
              style={{
                height: `${100 / bottle.capacity}%`,
                backgroundColor: COLOR_MAP['Empty']
              }}
            />
          ))}
        </div>
        
        {/* Bottle label */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
          {index + 1}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span>←</span>
            <span>Back to Home</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-800">🧪 Water Sort Puzzle</h1>
          
          <div className="flex space-x-2">
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={solvePuzzle}
              disabled={isSolving}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {isSolving ? 'Solving...' : 'Solve'}
            </button>
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="grid grid-cols-7 gap-8 gap-y-12 justify-items-center">
            {gameState.bottles.map((bottle, index) => renderBottle(bottle, index))}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {selectedBottle !== null ? `Selected bottle ${selectedBottle + 1}` : 'Click a bottle to select'}
              </span>
              {Object.values(animatingBottles).some(anim => anim.isAnimating) && (
                <span className="text-sm text-blue-600 animate-pulse">
                  🧪 Pouring water...
                </span>
              )}
            </div>
            
            {solution.length > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Solution: {currentStep} / {solution.length} steps
                </span>
                <button
                  onClick={playSolution}
                  disabled={isPlayingSolution}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                >
                  {isPlayingSolution ? 'Playing...' : 'Play Solution'}
                </button>
                {isPlayingSolution && (
                  <button
                    onClick={nextStep}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Next Step
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">How to Play:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Click on a bottle to select it (highlighted in yellow)</li>
            <li>• Click on another bottle to pour water from selected to target</li>
            <li>• You can only pour water of the same color on top of each other</li>
            <li>• Goal: Sort all waters so each bottle contains only one color</li>
            <li>• Use the "Solve" button to get the optimal solution</li>
          </ul>
        </div>
      </div>
    </div>
  );
}