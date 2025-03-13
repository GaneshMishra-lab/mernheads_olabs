import React, { useState, useEffect } from 'react';

const EconomicSectorsClassification = () => {
  // Define the sectors and items
  const sectors = ["Primary Sector", "Secondary Sector", "Tertiary Sector"];
  
  const allItems = [
    { id: 1, name: "Farming", image: "/assets/farming.svg", answer: "Primary Sector" },
    { id: 2, name: "Fishing", image: "/assets/fishing.svg", answer: "Primary Sector" },
    { id: 3, name: "Textile", image: "/assets/textile.svg", answer: "Secondary Sector" },
    { id: 4, name: "Construction", image: "/assets/construction.svg", answer: "Secondary Sector" },
    { id: 5, name: "Manufacturing", image: "/assets/manufacturing.svg", answer: "Secondary Sector" },
    { id: 6, name: "Healthcare", image: "/assets/healthcare.svg", answer: "Tertiary Sector" },
    { id: 7, name: "Mining", image: "/assets/mining.svg", answer: "Primary Sector" },
    { id: 8, name: "Teaching", image: "/assets/teaching.svg", answer: "Tertiary Sector" },
    { id: 9, name: "IT Services", image: "/assets/it.svg", answer: "Tertiary Sector" },
    { id: 10, name: "Banking", image: "/assets/banking.svg", answer: "Tertiary Sector" },
    { id: 11, name: "Automobile Manufacturing", image: "/assets/automobile.svg", answer: "Secondary Sector" },
  ];

  // State to keep track of which sector each item is assigned to
  const [itemAssignments, setItemAssignments] = useState({
    "Primary Sector": [],
    "Secondary Sector": [],
    "Tertiary Sector": []
  });
  
  // State to track unassigned items
  const [unassignedItems, setUnassignedItems] = useState(allItems);
  
  // State to track validation errors for sectors
  const [sectorErrors, setSectorErrors] = useState({
    "Primary Sector": false,
    "Secondary Sector": false,
    "Tertiary Sector": false
  });
  
  // State for points and game status
  const [points, setPoints] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedback, setFeedback] = useState('');
  
  // Constants for point system
  const CORRECT_PLACEMENT = 10; // Points awarded for correct placement
  const WRONG_PLACEMENT = -5; // Points deducted for wrong placement
  
  // Check for game completion
  useEffect(() => {
    const totalAssignedItems = Object.values(itemAssignments).flat().length;
    const allItemsPlaced = totalAssignedItems === allItems.length;
    const allCorrectlyPlaced = allItems.every(item => {
      const sector = item.answer;
      return itemAssignments[sector].some(assignedItem => assignedItem.id === item.id);
    });
    
    if (allItemsPlaced && allCorrectlyPlaced && !isCompleted) {
      setIsCompleted(true);
      // Bonus points for completing the activity
      setPoints(prevPoints => prevPoints + 20);
      setFeedback('Congratulations! You\'ve correctly classified all items!');
    }
  }, [itemAssignments, isCompleted ]);
  
  // Reset error state after a delay
  useEffect(() => {
    const timeouts = Object.keys(sectorErrors).map(sector => {
      if (sectorErrors[sector]) {
        return setTimeout(() => {
          setSectorErrors(prev => ({
            ...prev,
            [sector]: false
          }));
        }, 1500);
      }
      return null;
    }).filter(Boolean);
    
    // Clear feedback message after delay
    let feedbackTimeout;
    if (feedback && !isCompleted) {
      feedbackTimeout = setTimeout(() => {
        setFeedback('');
      }, 3000);
    }
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
      if (feedbackTimeout) clearTimeout(feedbackTimeout);
    };
  }, [sectorErrors, feedback, isCompleted]);

  // Function to handle drag start
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("itemId", item.id);
  };

  // Function to handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Function to handle drop with validation
  const handleDrop = (e, targetSector) => {
    e.preventDefault();
    if (isCompleted) return; // Prevent changes after completion
    
    const itemId = parseInt(e.dataTransfer.getData("itemId"));
    
    // Find the item that was dragged
    const draggedItem = [...unassignedItems, 
      ...itemAssignments["Primary Sector"],
      ...itemAssignments["Secondary Sector"],
      ...itemAssignments["Tertiary Sector"]
    ].find(item => item.id === itemId);
    
    if (!draggedItem) return;
    
    // Check if the target sector is correct
    const isCorrectSector = draggedItem.answer === targetSector;
    
    // Track if this is a new placement or a move
    const isNewPlacement = unassignedItems.some(item => item.id === itemId);
    
    // If incorrect sector, show error, apply penalty and don't move the item
    if (!isCorrectSector) {
      // Show error for the sector
      setSectorErrors(prev => ({
        ...prev,
        [targetSector]: true
      }));
      
      // Apply penalty only if it's a new placement
      if (isNewPlacement) {
        setPoints(prevPoints => prevPoints + WRONG_PLACEMENT);
        setFeedback(`Oops! -${Math.abs(WRONG_PLACEMENT)} points. Try another sector.`);
      }
      
      return; // Don't proceed with the drop
    }
    
    // Proceed with the drop since sector is correct
    // Check if the item is already in a sector and remove it
    let newUnassigned = [...unassignedItems];
    let newAssignments = { ...itemAssignments };
    
    // Remove from unassigned if it's there
    if (unassignedItems.some(item => item.id === itemId)) {
      newUnassigned = unassignedItems.filter(item => item.id !== itemId);
    }
    
    // Remove from any sector it might be in
    sectors.forEach(sector => {
      if (newAssignments[sector].some(item => item.id === itemId)) {
        newAssignments[sector] = newAssignments[sector].filter(item => item.id !== itemId);
      }
    });
    
    // Add to the target sector
    newAssignments[targetSector] = [...newAssignments[targetSector], draggedItem];
    
    // Update state
    setUnassignedItems(newUnassigned);
    setItemAssignments(newAssignments);
    
    // Award points for correct placement (only if it's a new placement)
    if (isNewPlacement) {
      setPoints(prevPoints => prevPoints + CORRECT_PLACEMENT);
      setFeedback(`Great! +${CORRECT_PLACEMENT} points!`);
    }
  };
  
  // Function to reset the game
  const handleReset = () => {
    setUnassignedItems(allItems);
    setItemAssignments({
      "Primary Sector": [],
      "Secondary Sector": [],
      "Tertiary Sector": []
    });
    setPoints(0);
    setIsCompleted(false);
    setFeedback('');
  };

  return (
    <div className="bg-blue-50 h-screen w-screen p-6 mx-auto">
      <div className=" mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-center text-xl font-bold">Rearrange the given elements in appropriate system box</h2>
          <div className="flex gap-4 items-center">
            <div className="bg-white p-2 rounded-lg shadow">
              <span className="font-bold">Points: {points}</span>
            </div>
            <button 
              onClick={handleReset}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
        
        {/* Feedback message */}
        {feedback && (
            <div className={`mb-4 p-3  rounded-lg text-center animate-pulse ${isCompleted ? '' : 'fixed'}  ${feedback.charAt(0) == 'G' ||feedback.charAt(0) == 'C'  ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className={`font-bold   ${isCompleted ? 'text-lg' : ''}`}>{feedback}</p>
            {isCompleted && (
              <p className="mt-2">
                Final Score: <span className="font-bold">{points}</span> points
              </p>
            )}
          </div>
        )}
        
        {/* Sectors boxes */}
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          {sectors.map((sector) => (
            <div key={sector} className="flex flex-col items-center">
              <div 
                className={`border-2 ${sectorErrors[sector] ? 'border-red-500 bg-red-50' : isCompleted ? 'border-green-500 bg-green-50' : 'border-black'} rounded-md w-40 h-40 sm:w-48 sm:h-48 md:w-80 md:h-72 flex flex-wrap content-start justify-center p-2 overflow-y-auto transition-colors duration-300`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, sector)}
              > 
                {itemAssignments[sector].map((item) => (
                  <div 
                    key={item.id}
                    className="h-fit w-fit m-1 flex flex-col items-center justify-center rounded-md p-1 cursor-grab"
                    draggable={!isCompleted}
                    onDragStart={(e) => handleDragStart(e, item)}
                  >
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-contain mb-1" />
                    <span className="text-xs text-center">{item.name}</span>
                  </div>
                ))}
              </div>
              <div className="text-center font-bold mt-2">{sector}</div>
            </div>
          ))}
        </div>
        
        {/* Unassigned items */}
        {!isCompleted && unassignedItems.length > 0 && (
          <div className="bg-transparent p-4 rounded-md">
            <div className="flex flex-wrap gap-1 justify-center">
              {unassignedItems.map((item) => (
                <div 
                  key={item.id}
                  className="h-24 w-32 flex flex-col items-center justify-center rounded-md p-1 cursor-grab"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                >
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-contain mb-1" />
                  <span className="text-xs text-center">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EconomicSectorsClassification;