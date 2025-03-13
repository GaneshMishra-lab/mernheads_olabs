import { Home } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const EconomicSectors = () => {
    const navigate = useNavigate();
    const sectors = [
    {
      title: "Primary Sector",
      description:
        "This sector involves the extraction and harvesting of natural resources directly from nature. It forms the base of all economic activities.",
      examples: "Examples: Agriculture, Fishing, Forestry etc.",
      bgImage: "/assets/primary-sector.jpg",
      borderColor: "border-yellow-500",
    },
    {
      title: "Secondary Sector",
      description:
        "The secondary sector involves manufacturing and industrial processes where raw materials from the primary sector are processed into finished goods.",
      examples:
        "Examples: Textile Industry, Steel Production, Automobile Manufacturing etc.",
      bgImage: "/assets/secondary-sector.jpg",
      borderColor: "border-blue-400",
    },
    {
      title: "Tertiary Sector",
      description:
        "The tertiary sector focuses on providing services rather than goods. It acts as a support system for the primary and secondary sectors and caters to consumer needs.",
      examples:
        "Examples: Banking, Transportation, IT Services, Retail etc.",
      bgImage: "/assets/tertiary-sector.jpg",
      borderColor: "border-amber-700",
    },
  ];

  return (
    <div className="min-h-screen bg-[#506f6a] flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="flex items-center w-full max-w-4xl justify-between mb-6">
        <div className="p-3 bg-[#506f6a] rounded-full">
          <Home ></Home>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-black border px-6 py-2 rounded-lg border-black">
          Economics: Sectors of Indian Economy
        </h1>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>

      {/* Sectors List */}
      <div className="w-full max-w-4xl space-y-4">
        {sectors.map((sector, index) => (
          <div
            key={index}
            className={`relative p-4 rounded-lg shadow-lg border-4 text-black bg-[#a7b7b5] bg-opacity-60`}
            style={{
              backgroundImage: `url(${sector.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h2 className="text-lg md:text-xl font-bold text-black">
              {sector.title}
            </h2>
            <p className="text-black text-sm md:text-base">{sector.description}</p>
            <p className="text-black font-semibold text-sm">{sector.examples}</p>
          </div>
        ))}
      </div>

      {/* Next Button */}
      <button className="mt-6 px-6 py-2 bg-yellow-500 text-black font-bold text-lg rounded-lg shadow-md hover:bg-yellow-600" onClick={()=>{navigate('/level1')}}>
        Next
      </button>
    </div>
  );
};

export default EconomicSectors;
