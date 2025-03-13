import React from "react";
import { useNavigate } from "react-router-dom"; 

const EconomicIntro = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#506f6a] flex flex-col items-center justify-center p-6">
      {/* Main Card */}
      <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-xl md:text-2xl font-bold text-red-700 mb-4">
          Sectors of Indian Economy
        </h1>
        <p className="font-bold text-lg">Objective:</p>
        <p className="text-gray-800 text-sm mb-4">
          To classify and explore the various sectors of the Indian economy
        </p>
        <p className="font-bold text-lg">Learning Outcome:</p>
        <p className="text-gray-800 text-sm">
          Students will be able to recognize the significance and interdependence
          of the various sectors of the Indian economy.
        </p>

        {/* Start Button */}
        <button className="mt-6 px-6 py-2 bg-yellow-500 text-black font-bold text-lg rounded-lg shadow-md hover:bg-yellow-600" onClick={()=>{navigate('/info')}}>
          Start
        </button>
      </div>

      {/* Footer */}
      <div className="mt-4 bg-white p-2 rounded-md shadow text-center text-xs w-full max-w-md">
        <p>Developed by: C-DAC Mumbai</p>
        <p>
          Funded by: Ministry of Electronics and Information Technology || Ministry of
          Education, Government of India
        </p>
      </div>
    </div>
  );
};

export default EconomicIntro;
