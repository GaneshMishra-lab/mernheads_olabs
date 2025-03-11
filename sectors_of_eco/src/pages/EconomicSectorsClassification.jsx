import React, { useState } from 'react';

const EconomicSectorsClassification = () => {
  // Define the sectors and items
  const sectors = ["Primary Sector", "Secondary Sector", "Tertiary Sector"];
  
  const allItems = [
    { id: 1, name: "Farming", image: "/assets/farming.svg", initialSector: null },
    { id: 2, name: "Fishing", image: "/assets/fishing.svg", initialSector: null },
    { id: 3, name: "Textile", image: "/assets/textile.svg", initialSector: null },
    { id: 4, name: "Construction", image: "/assets/construction.svg", initialSector: null },
    { id: 5, name: "Manufacturing", image: "/assets/manufacturing.svg", initialSector: null },
    { id: 6, name: "Healthcare", image: "/assets/healthcare.svg", initialSector: null },
    { id: 7, name: "Mining", image: "/assets/mining.svg", initialSector: null },
    { id: 8, name: "Teaching", image: "/assets/teaching.svg", initialSector: null },
    { id: 9, name: "IT Services", image: "/assets/it.svg", initialSector: null },
    { id: 10, name: "Banking", image: "/assets/banking.svg", initialSector: null },
    { id: 11, name: "Automobile Manufacturing", image: "/assets/automobile.svg", initialSector: null },
   
  ];

  // State to keep track of which sector each item is assigned to
  const [itemAssignments, setItemAssignments] = useState({
    "Primary Sector": [],
    "Secondary Sector": [],
    "Tertiary Sector": []
  });
  
  // State to track unassigned items
  const [unassignedItems, setUnassignedItems] = useState(allItems);

  // Function to handle drag start
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("itemId", item.id);
  };

  // Function to handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Function to handle drop
  const handleDrop = (e, targetSector) => {
    e.preventDefault();
    const itemId = parseInt(e.dataTransfer.getData("itemId"));
    
    // Find the item that was dragged
    const draggedItem = [...unassignedItems, 
      ...itemAssignments["Primary Sector"],
      ...itemAssignments["Secondary Sector"],
      ...itemAssignments["Tertiary Sector"]
    ].find(item => item.id === itemId);
    
    if (!draggedItem) return;
    
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
  };

  return (
    <div className="bg-blue-50 h-screen w-screen p-6 rounded-lg  mx-auto">
      <h2 className="text-center text-lg font-bold mb-4">Rearrange the given elements in appropriate system box</h2>
      
      {/* Sectors boxes */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {sectors.map((sector) => (
          <div key={sector} className="flex flex-col items-center">
            <div 
              className="border-2 border-black rounded-md w-40 h-40 sm:w-48 sm:h-48 md:w-80 md:h-80 flex flex-wrap content-start justify-center p-2 overflow-y-auto"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, sector)}
            > 
              {itemAssignments[sector].map((item) => (
                <div 
                  key={item.id}
                  className=" h-fit w-fit m-1 flex flex-col items-center justify-center bg-white rounded-md p-1 cursor-grab"
                  draggable
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
      <div className="bg-transparent p-4 rounded-md">
        <div className="flex flex-wrap gap-2 justify-center">
          {unassignedItems.map((item) => (
            <div 
              key={item.id}
              className=" h-28 w-28 flex flex-col items-center justify-center bg-gray-50 rounded-md p-1 cursor-grab"
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
            >
              <img src={item.image} alt={item.name} className="w-24 h-24 object-contain mb-1" />
              <span className="text-xs text-center">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EconomicSectorsClassification;