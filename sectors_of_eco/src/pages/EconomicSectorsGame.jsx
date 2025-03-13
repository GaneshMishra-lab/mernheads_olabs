import React, { useState } from 'react';

// Define occupation options with categories
const occupationOptions = [
  { id: 'sugar-shop', name: 'Sugar Shop', category: 'tertiary', image: "/assets/sugarshop.svg" , product: "sugar" },
  { id: 'gold-mine', name: 'Gold Mine', category: 'primary', image: "/assets/mine.svg", product: "jewellery" },
  { id: 'sugarcane-farmer', name: 'Sugarcane farmer', category: 'primary', image: "/assets/sugarcane.svg", product: "sugar" },
  { id: 'goldsmith', name: 'GoldSmith', category: 'secondary', image: "/assets/goldsmit.svg", product: "jewellery" },
  { id: 'sugarcane-mill', name: 'Sugarcane Mill', category: 'secondary', image: "/assets/mill.svg", product: "sugar" },
  { id: 'jewellry-shop', name: 'Jewellry Shop', category: 'tertiary', image: "/assets/jewellry.svg", product: "jewellery" },
  { id: 'teaching', name: 'Teaching', category: 'tertiary', image: "/assets/teaching.svg", product: "education" },
  { id: 'it-services', name: 'IT Services', category: 'tertiary', image: "/assets/it.svg", product: "service" },
  { id: 'automobile-manufacturing', name: 'Automobile Manufacturing', category: 'secondary', image: "/assets/automobile.svg", product: "car" },
  { id: 'dairy-farming', name: 'Dairy Farming', category: 'primary', image: "/assets/dairy.svg" , product: "milk"}
];

const EconomicSystemDiagram = () => {
  // State for sectors and unassigned items
  const [sectors, setSectors] = useState({
    primary: [],
    secondary: [],
    tertiary: []
  });
  const [unassignedItems, setUnassignedItems] = useState(occupationOptions);
  const [feedback, setFeedback] = useState('');
  const [points, setPoints] = useState(0);
  const [sectorErrors, setSectorErrors] = useState({
    primary: false,
    secondary: false,
    tertiary: false
  });

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("itemId", item.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetSector) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("itemId");

    // Find dragged item in unassigned or sectors
    let draggedItem = unassignedItems.find(item => item.id === itemId);
    let sourceSector = null;

    if (!draggedItem) {
      for (const [sector, items] of Object.entries(sectors)) {
        const foundItem = items.find(item => item.id === itemId);
        if (foundItem) {
          draggedItem = foundItem;
          sourceSector = sector;
          break;
        }
      }
    }

    if (!draggedItem) return;

    // Validate category
    const isCorrect = draggedItem.category === targetSector && draggedItem.product === "sugar";


    if (!isCorrect) {
      setSectorErrors(prev => ({ ...prev, [targetSector]: true }));
      setFeedback('Incorrect placement! Try another sector.');
      setPoints(10);
      return;
    }

    // Clear errors
    setSectorErrors(prev => ({ ...prev, [targetSector]: false }));

    const existingItem = sectors[targetSector].length > 0 ? sectors[targetSector][0] : null;

    setSectors(prev => ({
      ...prev,
      [targetSector]: [draggedItem] // Replace with the new item
    }));
  
    // Remove from source (previous location)
    if (sourceSector) {
      setSectors(prev => ({
        ...prev,
        [sourceSector]: prev[sourceSector].filter(item => item.id !== itemId)
      }));
    } else {
      setUnassignedItems(prev => prev.filter(item => item.id !== itemId));
    }
  
    // Move the existing item back to unassigned items
    if (existingItem) {
      setUnassignedItems(prev => [...prev, existingItem]);
    }
  };

  return (
    <div className="bg-gray-100 p-8 rounded-lg max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8">Rearrange the elements into the correct economic sectors</h1>
      
      {/* Economic Sectors Flow */}
      <div className="flex justify-between items-center mb-12">
        {['primary', 'secondary', 'tertiary'].map((sector) => (
          <React.Fragment key={sector}>
            <div className="flex flex-col items-center">
              <div
                className={`w-32 h-32 rounded-full flex flex-wrap items-center justify-center mb-2  ${
                  sectorErrors[sector] ? 'bg-red-200' : 'bg-gray-200'
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, sector)}
              >
                {sectors[sector].map((item) => (
                  <img
                    key={item.id}
                    src={item.image}
                    alt={item.name}
                    className="w-fit h-32  rounded-full object-cover"
                  />
                ))}
              </div>
              <div className="text-center">
                <p className="font-bold capitalize">{sector}</p>
                <p className="font-bold">Sector</p>
              </div>
            </div>
            {sector !== 'tertiary' && (
             <img src="/assets/arrow.svg" alt="Arrow Right" className="w-28 h-32 self-start "  />
            )}
            
          </React.Fragment>
        ))}
        
        {/* Product Display */}
        <img src="/assets/arrow.svg" alt="Arrow Right" className="w-28 h-32 self-start "  />
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-white rounded-full border-2 border-amber-300 flex items-center justify-center mb-2">
            <img src="/assets/sugar.svg" alt="sugar image" />
          </div>
          <p className="font-bold">Product</p>
        </div>
        
      </div>

      {/* Available Items */}
      <div className="bg-white p-6 rounded-lg">
        <div className="grid grid-cols-5 gap-4">
          {unassignedItems.map((option) => (
            <div key={option.id} className="flex flex-col items-center">
              <div
                className="relative mb-2"
                draggable
                onDragStart={(e) => handleDragStart(e, option)}
              >
                <img
                  src={option.image}
                  alt={option.name}
                  className="w-20 h-20 rounded-full object-cover cursor-pointer hover:opacity-80"
                />
              </div>
              <p className="text-xs text-center">{option.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Section */}
      {feedback && (
        <div className="mt-4 p-3 text-center text-red-600 font-semibold">
          {feedback}
        </div>
      )}
      <div className="mt-4 text-center font-bold">
        Points: {points}
      </div>
    </div>
  );
};

export default EconomicSystemDiagram;