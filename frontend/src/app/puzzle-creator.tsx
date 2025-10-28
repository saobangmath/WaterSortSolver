'use client';

import { useState } from 'react';

interface Bottle {
  capacity: number;
  waters: string[];
}

const AVAILABLE_COLORS = [
  { name: 'XanhLaNhat', color: '#90EE90', label: 'Light Green' },
  { name: 'XanhBlueNhat', color: '#87CEEB', label: 'Light Blue' },
  { name: 'XanhLa', color: '#32CD32', label: 'Green' },
  { name: 'Xam', color: '#808080', label: 'Gray' },
  { name: 'Tim', color: '#8A2BE2', label: 'Purple' },
  { name: 'Hong', color: '#FFB6C1', label: 'Pink' },
  { name: 'Do', color: '#FF0000', label: 'Red' },
  { name: 'XanhBlue', color: '#0000FF', label: 'Blue' },
  { name: 'Nau', color: '#A52A2A', label: 'Brown' },
  { name: 'XanhCyan', color: '#00FFFF', label: 'Cyan' },
  { name: 'Cam', color: '#FFA500', label: 'Orange' },
  { name: 'Vang', color: '#FFFF00', label: 'Yellow' },
  { name: 'XanhNavy', color: '#000080', label: 'Navy Blue' }
];

export default function PuzzleCreator({ onBack }: { onBack: () => void }) {
  const [bottles, setBottles] = useState<Bottle[]>([
    { capacity: 4, waters: [] },
    { capacity: 4, waters: [] },
    { capacity: 4, waters: [] },
    { capacity: 4, waters: [] },
    { capacity: 4, waters: [] },
    { capacity: 4, waters: [] },
    { capacity: 4, waters: [] },
    { capacity: 4, waters: [] },
    { capacity: 4, waters: [] },
    { capacity: 4, waters: [] },
    { capacity: 4, waters: [] },
    { capacity: 4, waters: [] },
    { capacity: 4, waters: [] },
    { capacity: 4, waters: [] }
  ]);

  const [selectedColor, setSelectedColor] = useState<string>('XanhLaNhat');
  const [selectedBottle, setSelectedBottle] = useState<number | null>(null);
  const [bottleCapacity, setBottleCapacity] = useState<number>(4);
  const [isSolving, setIsSolving] = useState(false);
  const [solution, setSolution] = useState<[number, number][]>([]);
  const [solveResult, setSolveResult] = useState<{success: boolean, message: string} | null>(null);
  const [isPlayingSolution, setIsPlayingSolution] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [originalBottles, setOriginalBottles] = useState<Bottle[]>([]);

  const addWater = (bottleIndex: number, color: string) => {
    if (bottles[bottleIndex].waters.length >= bottles[bottleIndex].capacity) {
      return;
    }

    const newBottles = [...bottles];
    newBottles[bottleIndex].waters.push(color);
    setBottles(newBottles);
  };

  const handleColorClick = (color: string) => {
    if (selectedBottle !== null) {
      // If a bottle is selected, add the color to that bottle
      addWater(selectedBottle, color);
    } else {
      // If no bottle is selected, just select the color
      setSelectedColor(color);
    }
  };

  const removeWater = (bottleIndex: number) => {
    const newBottles = [...bottles];
    if (newBottles[bottleIndex].waters.length > 0) {
      newBottles[bottleIndex].waters.pop();
      setBottles(newBottles);
    }
  };

  const clearBottle = (bottleIndex: number) => {
    const newBottles = [...bottles];
    newBottles[bottleIndex].waters = [];
    setBottles(newBottles);
  };

  const setCapacity = (bottleIndex: number, capacity: number) => {
    const newBottles = [...bottles];
    newBottles[bottleIndex].capacity = capacity;
    // Remove excess waters if new capacity is smaller
    if (newBottles[bottleIndex].waters.length > capacity) {
      newBottles[bottleIndex].waters = newBottles[bottleIndex].waters.slice(0, capacity);
    }
    setBottles(newBottles);
  };

  const addBottle = () => {
    setBottles([...bottles, { capacity: bottleCapacity, waters: [] }]);
  };

  const removeBottle = (bottleIndex: number) => {
    if (bottles.length > 2) { // Keep at least 2 bottles
      const newBottles = bottles.filter((_, index) => index !== bottleIndex);
      setBottles(newBottles);
    }
  };

  const clearAll = () => {
    setBottles(bottles.map(bottle => ({ ...bottle, waters: [] })));
  };

  const randomizePuzzle = () => {
    const newBottles: Bottle[] = bottles.map(bottle => ({ ...bottle, waters: [] }));
    
    // Create a solvable puzzle by ensuring each color appears exactly 4 times
    const colorCounts: { [key: string]: number } = {};
    const numColors = Math.min(12, Math.floor((bottles.length - 2) * bottleCapacity / 4));
    
    // Initialize color counts
    for (let i = 0; i < numColors; i++) {
      colorCounts[AVAILABLE_COLORS[i].name] = 0;
    }

    // Fill bottles with colors
    for (let bottleIndex = 0; bottleIndex < bottles.length - 2; bottleIndex++) {
      for (let waterIndex = 0; waterIndex < bottleCapacity; waterIndex++) {
        const availableColors = Object.keys(colorCounts).filter(
          color => colorCounts[color] < 4
        );
        
        if (availableColors.length > 0) {
          const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
          newBottles[bottleIndex].waters.push(randomColor);
          colorCounts[randomColor as keyof typeof colorCounts]++;
        }
      }
    }

    setBottles(newBottles);
  };

  const exportPuzzle = () => {
    const puzzleData = {
      bottles: bottles.map(bottle => ({
        capacity: bottle.capacity,
        waters: bottle.waters
      }))
    };
    
    const dataStr = JSON.stringify(puzzleData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'water-sort-puzzle.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importPuzzle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const puzzleData = JSON.parse(e.target?.result as string);
        if (puzzleData.bottles && Array.isArray(puzzleData.bottles)) {
          setBottles(puzzleData.bottles);
        }
      } catch (error) {
        alert('Invalid puzzle file');
      }
    };
    reader.readAsText(file);
  };

  const canPour = (fromIndex: number, toIndex: number): boolean => {
    if (fromIndex === toIndex) return false;
    
    const fromBottle = bottles[fromIndex];
    const toBottle = bottles[toIndex];
    
    if (fromBottle.waters.length === 0) return false;
    if (toBottle.waters.length === toBottle.capacity) return false;
    
    const topWater = fromBottle.waters[fromBottle.waters.length - 1];
    
    if (toBottle.waters.length === 0) return true;
    
    const toTopWater = toBottle.waters[toBottle.waters.length - 1];
    return topWater === toTopWater;
  };

  const pourWater = (fromIndex: number, toIndex: number) => {
    if (!canPour(fromIndex, toIndex)) return;

    const newBottles = [...bottles];
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

    setBottles(newBottles);
  };

  const solvePuzzle = async () => {
    // Check if puzzle is valid
    const totalWaters = bottles.reduce((sum, bottle) => sum + bottle.waters.length, 0);
    const emptyBottles = bottles.filter(bottle => bottle.waters.length === 0).length;
    
    if (totalWaters === 0) {
      setSolveResult({ success: false, message: "Please add some water to the bottles first!" });
      return;
    }
    
    if (emptyBottles < 2) {
      setSolveResult({ success: false, message: "Puzzle needs at least 2 empty bottles to be solvable!" });
      return;
    }

    // Save the current state as original before solving
    const currentState = bottles.map(bottle => ({
      capacity: bottle.capacity,
      waters: [...bottle.waters] // Deep copy of waters array
    }));
    setOriginalBottles(currentState);

    setIsSolving(true);
    setSolveResult(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/solve/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bottles: bottles.map(bottle => ({
            capacity: bottle.capacity,
            waters: bottle.waters
          }))
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSolution(data.plan || []);
        setSolveResult({ 
          success: true, 
          message: `✅ Puzzle solved! Found solution in ${data.steps || data.plan?.length || 0} steps.` 
        });
      } else {
        const errorData = await response.json();
        setSolveResult({ 
          success: false, 
          message: `❌ ${errorData.error || 'Failed to solve puzzle'}` 
        });
      }
    } catch (error) {
      setSolveResult({ 
        success: false, 
        message: `❌ Network error: ${error}` 
      });
    } finally {
      setIsSolving(false);
    }
  };

  const playSolution = () => {
    if (solution.length === 0 || originalBottles.length === 0) return;
    
    setIsPlayingSolution(true);
    setCurrentStep(0);
    // Deep copy the original bottles to ensure proper restoration
    const restoredBottles = originalBottles.map(bottle => ({
      capacity: bottle.capacity,
      waters: [...bottle.waters]
    }));
    setBottles(restoredBottles);
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

  const resetToOriginal = () => {
    if (originalBottles.length > 0) {
      // Deep copy the original bottles to ensure proper restoration
      const restoredBottles = originalBottles.map(bottle => ({
        capacity: bottle.capacity,
        waters: [...bottle.waters]
      }));
      setBottles(restoredBottles);
    }
    setIsPlayingSolution(false);
    setIsAutoPlaying(false);
    setCurrentStep(0);
  };

  const saveCurrentAsOriginal = () => {
    // Save the current state as the new original state
    const currentState = bottles.map(bottle => ({
      capacity: bottle.capacity,
      waters: [...bottle.waters] // Deep copy of waters array
    }));
    setOriginalBottles(currentState);
    setSolveResult(null); // Clear any previous solve results
    setSolution([]); // Clear any previous solution
    setIsPlayingSolution(false);
    setIsAutoPlaying(false);
    setCurrentStep(0);
  };

  const executeAllSteps = () => {
    if (solution.length === 0 || originalBottles.length === 0) return;
    
    setIsAutoPlaying(true);
    setCurrentStep(0);
    
    // Deep copy the original bottles to ensure proper restoration
    const restoredBottles = originalBottles.map(bottle => ({
      capacity: bottle.capacity,
      waters: [...bottle.waters]
    }));
    setBottles(restoredBottles);
    
    // Execute all steps with delay
    solution.forEach((step, index) => {
      setTimeout(() => {
        const [from, to] = step;
        pourWater(from, to);
        setCurrentStep(index + 1);
        
        // If this is the last step, stop auto-playing
        if (index === solution.length - 1) {
          setTimeout(() => {
            setIsAutoPlaying(false);
          }, 1000); // Wait 1 second after last step
        }
      }, index * 1500); // 1.5 second delay between steps
    });
  };

  const renderBottle = (bottle: Bottle, index: number) => {
    const isSelected = selectedBottle === index;
    
    return (
      <div
        key={index}
        className={`relative w-20 h-28 border-4 rounded-b-2xl transition-all duration-200 ${
          isSelected 
            ? 'border-blue-400 shadow-lg scale-105' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={() => setSelectedBottle(isSelected ? null : index)}
      >
        {/* Bottle neck */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-10 h-5 border-2 border-gray-300 rounded-t-full bg-white"></div>
        
        {/* Water layers */}
        <div className="absolute bottom-0 w-full h-full flex flex-col-reverse">
          {bottle.waters.map((water, waterIndex) => (
            <div
              key={waterIndex}
              className="w-full border-t border-gray-200"
              style={{
                height: `${100 / bottle.capacity}%`,
                backgroundColor: AVAILABLE_COLORS.find(c => c.name === water)?.color || '#F0F0F0'
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
                backgroundColor: '#F0F0F0'
              }}
            />
          ))}
        </div>
        
        {/* Bottle controls */}
        {isSelected && (
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col space-y-1">
            <div className="flex space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeWater(index);
                }}
                className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
              >
                -
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearBottle(index);
                }}
                className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
              >
                Clear
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeBottle(index);
                }}
                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
              >
                ×
              </button>
            </div>
            <select
              value={bottle.capacity}
              onChange={(e) => setCapacity(index, parseInt(e.target.value))}
              className="text-xs border rounded px-1"
              onClick={(e) => e.stopPropagation()}
            >
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
            </select>
          </div>
        )}
        
        {/* Bottle label */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
          {index + 1}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span>←</span>
            <span>Back to Home</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-800">🎨 Puzzle Creator</h1>
          
          <div className="flex space-x-2">
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={randomizePuzzle}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Randomizep
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Color Palette */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Color Palette</h2>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorClick(color.name)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedColor === color.name
                      ? 'border-blue-500 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="w-full h-8 rounded mb-2"
                    style={{ backgroundColor: color.color }}
                  />
                  <div className="text-xs text-gray-600">{color.label}</div>
                </button>
              ))}
            </div>
            
            <div className={`mt-4 p-3 rounded-lg ${
              selectedBottle !== null 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-blue-50'
            }`}>
              <p className="text-sm text-blue-800">
                <strong>Selected Color:</strong> {AVAILABLE_COLORS.find(c => c.name === selectedColor)?.label}
              </p>
              {selectedBottle !== null && (
                <p className="text-sm text-green-800 mt-1">
                  <strong>Selected Bottle:</strong> Bottle {selectedBottle + 1}
                </p>
              )}
              <p className={`text-xs mt-1 ${
                selectedBottle !== null ? 'text-green-600' : 'text-blue-600'
              }`}>
                {selectedBottle !== null 
                  ? `Click any color to add it to bottle ${selectedBottle + 1}`
                  : "Click on a bottle first, then click a color to add it"
                }
              </p>
            </div>
          </div>

          {/* Bottle Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Bottle Editor</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={solvePuzzle}
                    disabled={isSolving}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
                  >
                    {isSolving ? 'Solving...' : 'Solve Puzzle'}
                  </button>
                  <button
                    onClick={saveCurrentAsOriginal}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Save as Original
                  </button>
                  <button
                    onClick={addBottle}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Add Bottle
                  </button>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importPuzzle}
                    className="hidden"
                    id="import-file"
                  />
                  <label
                    htmlFor="import-file"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                  >
                    Import
                  </label>
                  <button
                    onClick={exportPuzzle}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    Export
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-8 gap-y-12 justify-items-center mb-6">
                {bottles.map((bottle, index) => (
                  <div key={index} className="flex flex-col items-center">
                    {renderBottle(bottle, index)}
                  </div>
                ))}
              </div>

              {/* Solve Result Display */}
              {solveResult && (
                <div className={`rounded-lg p-4 mb-4 ${
                  solveResult.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className={`font-semibold mb-2 ${
                    solveResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {solveResult.success ? '✅ Solve Result' : '❌ Solve Error'}
                  </div>
                  <p className={`text-sm ${
                    solveResult.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {solveResult.message}
                  </p>
                  {solveResult.success && solution.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm text-green-600 mb-3">
                        <strong>Solution Steps:</strong> {solution.length} moves
                        <div className="mt-1 text-xs text-green-500">
                          {solution.slice(0, 5).map((step, index) => (
                            <span key={index}>
                              {index > 0 && ', '}
                              {step[0] + 1}→{step[1] + 1}
                            </span>
                          ))}
                          {solution.length > 5 && ` ... and ${solution.length - 5} more`}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {!isPlayingSolution && !isAutoPlaying ? (
                          <>
                            <button
                              onClick={playSolution}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                            >
                              ▶️ Play Solution
                            </button>
                            <button
                              onClick={executeAllSteps}
                              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                            >
                              🚀 Execute All Steps
                            </button>
                          </>
                        ) : (
                          <>
                            {!isAutoPlaying && (
                              <button
                                onClick={nextStep}
                                disabled={currentStep >= solution.length}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors text-sm"
                              >
                                Next Step ({currentStep + 1}/{solution.length})
                              </button>
                            )}
                            <button
                              onClick={resetToOriginal}
                              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                            >
                              Reset
                            </button>
                          </>
                        )}
                      </div>
                      
                      {isPlayingSolution && currentStep < solution.length && (
                        <div className="mt-2 text-xs text-blue-600">
                          Next move: Bottle {solution[currentStep][0] + 1} → Bottle {solution[currentStep][1] + 1}
                        </div>
                      )}
                      
                      {isAutoPlaying && (
                        <div className="mt-2 text-xs text-purple-600">
                          🚀 Auto-executing solution... Step {currentStep}/{solution.length}
                          {currentStep < solution.length && (
                            <div className="mt-1">
                              Current move: Bottle {solution[currentStep - 1]?.[0] + 1} → Bottle {solution[currentStep - 1]?.[1] + 1}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Click on a bottle to select it (highlighted in blue)</li>
                  <li>• <strong>Method 1:</strong> Click a color, then click a bottle to add that color</li>
                  <li>• <strong>Method 2:</strong> Click a bottle first, then click any color to add it to that bottle</li>
                  <li>• Use the controls below selected bottles to remove waters or change capacity</li>
                  <li>• Each color should appear exactly 4 times for a solvable puzzle</li>
                  <li>• Leave 2 empty bottles for the solution</li>
                  <li>• Click &quot;Save as Original&quot; to save current state as the starting point</li>
                  <li>• Click &quot;Solve Puzzle&quot; to test your puzzle with AI</li>
                  <li>• After solving, click &quot;Play Solution&quot; for manual step-by-step or &quot;Execute All Steps&quot; for automatic playback</li>
                  <li>• Use &quot;Reset&quot; to return to the saved original state</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
